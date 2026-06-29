import { getPayload } from 'payload'
import config from '@payload-config'
import type { Ad } from '@/payload-types'
import { unstable_cache } from 'next/cache'

function isAdActive(ad: Ad, now: number): boolean {
  if (!ad.enabled) return false
  if (ad.startAt && new Date(ad.startAt).getTime() > now) return false
  if (ad.endAt && new Date(ad.endAt).getTime() < now) return false
  return true
}

export async function getAdForSlot(slotKey: string): Promise<Ad | null> {
  const payload = await getPayload({ config })

  const slotResult = await payload.find({
    collection: 'ad-slots',
    limit: 1,
    pagination: false,
    where: {
      and: [{ slug: { equals: slotKey } }, { enabled: { equals: true } }],
    },
  })

  const slot = slotResult.docs[0]
  if (!slot) return null

  const adsResult = await payload.find({
    collection: 'ads',
    depth: 2,
    limit: 20,
    pagination: false,
    sort: 'sort',
    where: {
      and: [{ enabled: { equals: true } }, { slot: { equals: slot.id } }],
    },
  })

  const now = Date.now()
  return adsResult.docs.find((ad) => isAdActive(ad, now)) ?? null
}

export function getCachedAdForSlot(slotKey: string) {
  return unstable_cache(() => getAdForSlot(slotKey), [`ad-slot-${slotKey}`], {
    tags: ['collection_ads', 'collection_ad-slots'],
  })
}
