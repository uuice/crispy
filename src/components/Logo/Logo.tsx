import clsx from 'clsx'
import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  logo?: MediaType | number | null
  priority?: boolean
  siteName?: string
}

export const Logo = (props: Props) => {
  const {
    className,
    loading: loadingFromProps,
    logo,
    priority: priorityFromProps,
    siteName = 'Crispy',
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps ?? false

  if (logo && typeof logo === 'object' && logo.url) {
    return (
      <Media
        className={clsx('max-w-[9.375rem]', className)}
        imgClassName="h-[34px] w-auto object-contain"
        loading={loading}
        priority={priority}
        resource={logo}
      />
    )
  }

  return (
    <span className={clsx('text-xl font-semibold tracking-tight', className)}>{siteName}</span>
  )
}
