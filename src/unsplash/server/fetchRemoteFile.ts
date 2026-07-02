import type { File } from 'payload'

export async function fetchRemoteFile(url: string, name: string): Promise<File> {
  const res = await fetch(url, { method: 'GET' })

  if (!res.ok) {
    throw new Error(`Failed to fetch file (${res.status})`)
  }

  const data = await res.arrayBuffer()
  const contentType = res.headers.get('content-type') ?? 'image/jpeg'

  return {
    name,
    data: Buffer.from(data),
    mimetype: contentType,
    size: data.byteLength,
  }
}
