import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import { DocSearch } from './components/DocSearch'
import { MobileNav } from './components/MobileNav'
import { Sidebar } from './components/Sidebar'
import { ThemeToggle } from './components/ThemeToggle'
import type { KbLayoutData } from './data/constants'
import { resolveKbMenu } from './data/constants'

type Props = {
  children: React.ReactNode
  layoutData?: unknown
}

const emptyLayoutData: KbLayoutData = { menu: [], footerMenu: [], categories: [] }

export async function Layout({ children, layoutData }: Props) {
  const settings = await getCachedSiteSettings()()
  const data = (layoutData as KbLayoutData | undefined) ?? emptyLayoutData
  const siteName = settings.siteName || 'Crispy'
  const siteDescription = settings.siteDescription || '产品文档与帮助中心'
  const menu = resolveKbMenu(data.menu)
  const { categories, footerMenu } = data
  const recordInfo = (settings as { recordSettings?: {
    showRecord?: boolean
    icpNumber?: string
    icpLink?: string
    policeNumber?: string
    policeLink?: string
  } }).recordSettings
  const showRecord =
    recordInfo?.showRecord !== false && (recordInfo?.icpNumber || recordInfo?.policeNumber)

  return (
    <div className="kb-shell">
      <header className="kb-topbar">
        <div className="kb-topbar-inner">
          <Link className="kb-logo" href="/" prefetch={false}>
            <span className="kb-logo-mark" aria-hidden="true">
              ◈
            </span>
            <span className="kb-logo-text">{siteName}</span>
          </Link>

          <DocSearch />

          <nav aria-label="主导航" className="kb-topnav">
            {menu.map((item) => (
              <Link
                className="kb-topnav-link"
                href={item.url}
                key={item.url + item.title}
                prefetch={false}
                target={item.target || '_self'}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="kb-topbar-actions">
            <ThemeToggle />
            <MobileNav categories={categories} menu={menu} />
          </div>
        </div>
      </header>

      <div className="kb-body">
        <Sidebar categories={categories} />
        <main className="kb-main">{children}</main>
      </div>

      <footer className="kb-footer">
        <div className="kb-footer-inner">
          <div className="kb-footer-brand">
            <p className="kb-footer-logo">{siteName}</p>
            <p className="kb-footer-tagline">{siteDescription}</p>
          </div>
          <div className="kb-footer-col">
            <p className="kb-footer-heading">导航</p>
            <ul className="kb-footer-links">
              {(footerMenu.length > 0 ? footerMenu : menu).slice(0, 6).map((item) => (
                <li key={item.url + item.title}>
                  <Link href={item.url} prefetch={false} target={item.target || '_self'}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="kb-footer-col">
            <p className="kb-footer-heading">资源</p>
            <ul className="kb-footer-links">
              <li>
                <Link href="/rss" prefetch={false}>{frontendLabels.site.blogRss}</Link>
              </li>
              <li>
                <Link href="/novels/rss" prefetch={false}>{frontendLabels.novels.rss}</Link>
              </li>
              <li>
                <Link href="/sitemap.xml" prefetch={false}>站点地图</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="kb-footer-bottom">
          <p>© {new Date().getFullYear()} {siteName}</p>
          {showRecord ? (
            <p className="kb-footer-record">
              {recordInfo?.icpNumber ? (
                <a
                  href={recordInfo.icpLink || 'https://beian.miit.gov.cn/'}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {recordInfo.icpNumber}
                </a>
              ) : null}
              {recordInfo?.policeNumber ? (
                <>
                  {recordInfo?.icpNumber ? ' · ' : null}
                  <a href={recordInfo.policeLink || '#'} rel="noopener noreferrer" target="_blank">
                    {recordInfo.policeNumber}
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      </footer>
    </div>
  )
}
