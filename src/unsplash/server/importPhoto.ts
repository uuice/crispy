import type { Payload, PayloadRequest } from 'payload'

import { getUnsplashAccessKey } from '@/unsplash/isEnabled'
import { fetchRemoteFile } from '@/unsplash/server/fetchRemoteFile'
import type { UnsplashImportRequest } from '@/unsplash/types'

async function resolveDownloadUrl(downloadLocation: string): Promise<string> {
  const accessKey = getUnsplashAccessKey()
  const res = await fetch(downloadLocation, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (!res.ok) {
    throw new Error(`Unsplash download tracking failed (${res.status})`)
  }

  const data = (await res.json()) as { url?: string }
  if (!data.url) {
    throw new Error('Unsplash did not return a download URL')
  }

  return data.url
}

export async function importUnsplashPhoto({
  payload,
  req,
  input,
}: {
  payload: Payload
  req: PayloadRequest
  input: UnsplashImportRequest
}) {
  const downloadUrl = await resolveDownloadUrl(input.downloadLocation)
  const file = await fetchRemoteFile(downloadUrl, `unsplash-${input.photoId}.jpg`)

  return payload.create({
    collection: 'media',
    data: {
      alt: input.alt?.trim() || 'Unsplash photo',
    },
    file,
    req,
  })
}
