export const truncate = (str: string, length: number = 100) => {
  if (!str) return ''
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}
