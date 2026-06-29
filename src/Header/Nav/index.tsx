'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { defaultHeaderNav, frontendLabels } from '@/i18n/frontend-labels'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const cmsNavItems = data?.navItems || []
  const hasCmsNav = cmsNavItems.length > 0

  return (
    <nav className="flex flex-wrap gap-3 items-center justify-end">
      {hasCmsNav
        ? cmsNavItems.map(({ link }, i) => <CMSLink key={i} {...link} appearance="link" />)
        : defaultHeaderNav.map(({ label, url }) => (
            <Link className="text-sm hover:underline" href={url} key={url}>
              {label}
            </Link>
          ))}
      <Link href="/search" title={frontendLabels.site.search}>
        <span className="sr-only">{frontendLabels.search.ariaLabel}</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
