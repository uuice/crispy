import { headers } from 'next/headers'

export const FRONTEND_PATHNAME_HEADER = 'x-crispy-pathname'

export async function getRequestPathname(): Promise<string> {
  const headerList = await headers()
  return headerList.get(FRONTEND_PATHNAME_HEADER) ?? ''
}
