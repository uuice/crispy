import { HeaderClient } from './Component.client'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function Header() {
  const [headerData, siteSettings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedSiteSettings()(),
  ])

  return <HeaderClient data={headerData} siteSettings={siteSettings} />
}
