import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedFriendLinks } from '@/utilities/getFriendLinks'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import { getCachedSiteExploreData } from '@/utilities/getSiteExploreData'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { frontendLabels, socialPlatformLabel } from '@/i18n/frontend-labels'
import type { Media as MediaType } from '@/payload-types'

export async function Footer() {
  const [footerData, siteSettings, friendLinks, explore] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedSiteSettings()(),
    getCachedFriendLinks(),
    getCachedSiteExploreData(),
  ])

  const navItems = footerData?.navItems || []
  const socialLinks = siteSettings.socialLinks || []
  const showRss = siteSettings.enableRss !== false

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Link className="flex items-center" href="/">
            <Logo logo={siteSettings.logo} siteName={siteSettings.siteName || 'Crispy'} />
          </Link>
          {siteSettings.siteDescription && (
            <p className="text-sm text-white/70 max-w-sm">{siteSettings.siteDescription}</p>
          )}
          <ThemeSelector />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-4 text-white/90">{frontendLabels.explore.navigation}</h3>
          <nav className="flex flex-col gap-2">
            {navItems.map(({ link }, i) => (
              <CMSLink className="text-white/80 hover:text-white text-sm" key={i} {...link} />
            ))}
            <Link className="text-white/80 hover:text-white text-sm" href="/archives">
              {frontendLabels.site.posts}
            </Link>
            <Link className="text-white/80 hover:text-white text-sm" href="/archives">
              {frontendLabels.site.archive}
            </Link>
            <Link className="text-white/80 hover:text-white text-sm" href="/links">
              {frontendLabels.links.title}
            </Link>
            <Link className="text-white/80 hover:text-white text-sm" href="/about">
              关于
            </Link>
            <Link className="text-white/80 hover:text-white text-sm" href="/navigations">
              导航
            </Link>
            <Link className="text-white/80 hover:text-white text-sm" href="/games">
              小游戏
            </Link>
            {showRss && (
              <Link className="text-white/80 hover:text-white text-sm" href="/rss.xml">
                {frontendLabels.site.rss}
              </Link>
            )}
            <Link className="text-white/80 hover:text-white text-sm" href="/admin">
              {frontendLabels.site.admin}
            </Link>
          </nav>
        </div>

        {(explore.categories.length > 0 || explore.tags.length > 0) && (
          <div>
            {explore.categories.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-4 text-white/90">{frontendLabels.explore.categories}</h3>
                <nav className="flex flex-wrap gap-x-3 gap-y-2 mb-6">
                  {explore.categories.slice(0, 12).map((cat) => (
                    <Link
                      className="text-sm text-white/80 hover:text-white"
                      href={`/categories/${cat.slug}`}
                      key={cat.id}
                    >
                      {cat.title}
                    </Link>
                  ))}
                </nav>
              </>
            )}
            {explore.tags.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-4 text-white/90">{frontendLabels.explore.tags}</h3>
                <nav className="flex flex-wrap gap-x-3 gap-y-2">
                  {explore.tags.slice(0, 16).map((tag) => (
                    <Link
                      className="text-sm text-white/80 hover:text-white"
                      href={`/tags/${tag.slug}`}
                      key={tag.id}
                    >
                      #{tag.title}
                    </Link>
                  ))}
                </nav>
              </>
            )}
          </div>
        )}

        <div className="space-y-6">
          {friendLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-4 text-white/90">{frontendLabels.links.title}</h3>
              <nav aria-label={frontendLabels.links.title} className="flex flex-col gap-2">
                {friendLinks.map((item) => {
                  const logo = item.logo
                  const logoResource =
                    logo && typeof logo === 'object' ? (logo as MediaType) : null

                  return (
                    <Link
                      className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
                      href={item.url}
                      key={item.id}
                      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                      target={item.openInNewTab ? '_blank' : undefined}
                      title={item.description || item.title}
                    >
                      {logoResource?.url ? (
                        <Media
                          className="shrink-0"
                          imgClassName="h-4 w-4 rounded-sm object-contain"
                          resource={logoResource}
                        />
                      ) : null}
                      {item.title}
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-4 text-white/90">{frontendLabels.social.title}</h3>
              <nav className="flex flex-col gap-2">
                {socialLinks.map(({ platform, url }, i) => (
                  <Link
                    className="text-sm text-white/80 hover:text-white"
                    href={url}
                    key={i}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {socialPlatformLabel(platform)}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
