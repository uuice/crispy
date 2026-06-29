import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const [footerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedSiteSettings()(),
  ])

  const navItems = footerData?.navItems || []
  const socialLinks = siteSettings.socialLinks || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <div className="flex flex-col gap-4">
          <Link className="flex items-center" href="/">
            <Logo logo={siteSettings.logo} siteName={siteSettings.siteName || 'Crispy'} />
          </Link>
          {siteSettings.siteDescription && (
            <p className="text-sm text-white/70 max-w-sm">{siteSettings.siteDescription}</p>
          )}
        </div>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
          {socialLinks.length > 0 && (
            <nav className="flex flex-wrap gap-3">
              {socialLinks.map(({ platform, url }, i) => (
                <Link
                  className="text-sm text-white/80 hover:text-white"
                  href={url}
                  key={i}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {platform}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}
