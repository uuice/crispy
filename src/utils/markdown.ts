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

    // Generate hash-based id from text content
    let hash = generateHash(plainText)

    // Ensure unique id
    if (slugMap[hash]) {
      slugMap[hash]++
      hash = `${hash}-${slugMap[hash]}`
    } else {
      slugMap[hash] = 1
    }

    // Remove existing id attribute and add new hash-based id
    attrs = attrs.replace(/id=["'][^"']*["']/gi, '')
    attrs = attrs ? `${attrs} id="${hash}"` : `id="${hash}"`

    toc.push({ id: hash, text: plainText, level: Number(tag[1]) })

    // Return the heading with hash-based id
    return `<${tag}${attrs}>${text}</${tag}>`
  })

  return { html: output, toc }
}

/**
 * Generate a simple hash from string
 * @param str Input string
 * @returns Hash string
 */
function generateHash(str: string): string {
  let hash = 0
  if (str.length === 0) return 'h' + hash.toString(36)

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return 'h' + Math.abs(hash).toString(36)
}
