import pinyin from 'pinyin'

export const titleToUrl = (title: string): string => {
  // Check whether the title contains Chinese
  if (/[\u4e00-\u9fa5]/.test(title)) {
    // Convert Chinese to pinyin using the Pinyin.js library
    let url = pinyin(title, {
      style: pinyin.STYLE_NORMAL
    }).join('-')

    // Convert the English portion to lowercase and replace the space with a hyphen
    url = url
      .replace(/[^a-zA-Z-\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
    // Remove the first and last hyphen
    url = url.replace(/^-|-$/g, '')
    return url
  } else {
    // If the title does not have Chinese, replace the space and convert to lowercase
    let url = title
      .replace(/[^a-zA-Z-\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
    // Remove the first and last hyphen
    url = url.replace(/^-|-$/g, '')
    return url
  }
}
