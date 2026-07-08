/** Date-based document prefix for OSS object keys (e.g. `2026/07/08`). */
export function buildOssDatePrefix(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}
