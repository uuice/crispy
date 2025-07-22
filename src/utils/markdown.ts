export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Generate TOC and add id/name to h1/h2/h3 in HTML string
 * @param html HTML string
 * @returns { html: string, toc: TocItem[] }
 */
export function generateTocAndHeadings(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  // 支持 h1~h6，允许前面有空白字符
  let output = html
  const headingRegex = /<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/gi
  const slugMap: Record<string, number> = {}
  output = output.replace(headingRegex, (match, tag, attrs, text) => {
    // Remove HTML tags from text for id
    const plainText = text.replace(/<[^>]+>/g, '').trim()
    let slug =
      plainText
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'heading'
    // Ensure unique id
    if (slugMap[slug]) {
      slugMap[slug]++
      slug = `${slug}-${slugMap[slug]}`
    } else {
      slugMap[slug] = 1
    }
    toc.push({ id: slug, text: plainText, level: Number(tag[1]) })
    // Add id and name
    return `<${tag}${attrs} id="${slug}" name="${slug}">${text}</${tag}>`
  })
  return { html: output, toc }
}
