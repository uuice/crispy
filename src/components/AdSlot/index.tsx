import React from 'react'
import { cn } from '@/utilities/ui'

import { getCachedAdForSlot } from '@/utilities/getAdsBySlot'

import { AdBanner } from './AdBanner'

type Props = {
  slot: string
  className?: string
}

export async function AdSlot({ slot, className }: Props) {
  const ad = await getCachedAdForSlot(slot)()

  if (!ad) return null

  return <AdBanner ad={ad} className={cn('my-6', className)} />
}
