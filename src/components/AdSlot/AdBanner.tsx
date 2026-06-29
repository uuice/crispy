import Link from 'next/link'
import React from 'react'
import { cn } from '@/utilities/ui'

import { Media } from '@/components/Media'
import type { Ad, Media as MediaType } from '@/payload-types'

type Props = {
  ad: Ad
  className?: string
}

export const AdBanner: React.FC<Props> = ({ ad, className }) => {
  if (ad.format === 'html' && ad.html) {
    return (
      <aside
        aria-label="Advertisement"
        className={cn('ad-banner ad-banner--html', className)}
        // Trusted CMS editors only
        dangerouslySetInnerHTML={{ __html: ad.html }}
      />
    )
  }

  if (ad.format !== 'image') return null

  const image = ad.image
  const resource = image && typeof image === 'object' ? (image as MediaType) : null
  if (!resource?.url) return null

  const img = (
    <Media
      className="w-full"
      imgClassName="w-full h-auto rounded-md object-contain"
      resource={resource}
    />
  )

  return (
    <aside aria-label="Advertisement" className={cn('ad-banner ad-banner--image', className)}>
      {ad.link ? (
        <Link
          href={ad.link}
          rel={ad.openInNewTab ? 'noopener noreferrer sponsored' : 'sponsored'}
          target={ad.openInNewTab ? '_blank' : undefined}
          title={ad.alt || ad.title}
        >
          {img}
        </Link>
      ) : (
        img
      )}
    </aside>
  )
}
