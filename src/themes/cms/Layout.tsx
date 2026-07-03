import Link from 'next/link'
import React from 'react'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import { MobileNav } from './components/MobileNav'
import { ThemeToggle } from './components/ThemeToggle'
import type { CmsLayoutData } from './data/constants'
import { resolveCmsMenu } from './data/constants'

type Props = {
  children: React.ReactNode
  layoutData?: unknown
}

const emptyLayoutData: CmsLayoutData = { menu: [], footerMenu: [] }

export async function Layout({ children, layoutData }: Props) {
  const settings = await getCachedSiteSettings()()
  const data = (layoutData as CmsLayoutData | undefined) ?? emptyLayoutData
  const siteName = settings.siteName || 'Crispy'
  const siteDescription = settings.siteDescription || '企业级内容管理平台'
  const menu = resolveCmsMenu(data.menu)
  const footerMenu = data.footerMenu
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
    <div className="cms-shell">
      <header className="cms-topbar">
        <div className="cms-container cms-topbar-inner">
          <Link className="cms-logo" href="/">
            <span className="cms-logo-mark" aria-hidden="true" />
            <span className="cms-logo-text">{siteName}</span>
          </Link>

          <nav aria-label="主导航" className="cms-nav">
            {menu.map((item) => (
              <Link
                className="cms-nav-link"
                href={item.url}
                key={item.url + item.title}
                target={item.target || '_self'}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="cms-topbar-actions">
            <ThemeToggle />
            <MobileNav menu={menu} />
          </div>
        </div>
      </header>

      <main className="cms-main">{children}</main>

      <footer className="cms-footer">
        <div className="cms-container cms-footer-grid">
          <div className="cms-footer-brand">
            <p className="cms-footer-logo">{siteName}</p>
            <p className="cms-footer-tagline">{siteDescription}</p>
          </div>
          <div className="cms-footer-col">
            <p className="cms-footer-heading">页脚导航</p>
            <ul className="cms-footer-links">
              {footerMenu.length > 0
                ? footerMenu.slice(0, 8).map((item) => (
                    <li key={item.url + item.title}>
                      <Link href={item.url} target={item.target || '_self'}>
                        {item.title}
                      </Link>
                    </li>
                  ))
                : menu.slice(0, 6).map((item) => (
                    <li key={item.url + item.title}>
                      <Link href={item.url} target={item.target || '_self'}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
          <div className="cms-footer-col">
            <p className="cms-footer-heading">资源</p>
            <ul className="cms-footer-links">
              <li>
                <Link href="/rss">RSS 订阅</Link>
              </li>
              <li>
                <Link href="/sitemap.xml">站点地图</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="cms-container cms-footer-bottom">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          {showRecord ? (
            <p className="cms-footer-record">
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
