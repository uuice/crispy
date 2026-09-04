import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import { getRequestPathname } from '@/utilities/requestPathname'

import { resolveBlogMenu } from './data/constants'
import type { SidebarData } from './data/types'

import { BackToTop, FooterBackToTop } from './components/BackToTop'
import { BlogSearch } from './components/BlogSearch'
import { BlogSidebarShell } from './components/BlogSidebarShell'
import { DarkModeToggle } from './components/DarkModeToggle'
import { MobileNav } from './components/MobileNav'
import { Sidebar } from './components/Sidebar'
import { ThemeColor } from './components/ThemeColor'

type Props = {
  children: React.ReactNode
  layoutData?: unknown
}

const emptySidebar: SidebarData = {
  categories: [],
  tags: [],
  authors: [],
  menu: [],
  footerMenu: [],
}

function isNavItemActive(pathname: string, url: string): boolean {
  if (url === '/') return pathname === '/'
  const base = url.endsWith('/') ? url.slice(0, -1) : url
  return pathname === base || pathname.startsWith(`${base}/`)
}

export async function Layout({ children, layoutData }: Props) {
  const pathname = await getRequestPathname()
  const settings = await getCachedSiteSettings()()
  const sidebar = (layoutData as SidebarData | undefined) ?? emptySidebar

  const siteName = settings.siteName || '博客'
  const menu = resolveBlogMenu(sidebar.menu)
  const footerMenu = sidebar.footerMenu
  const recordInfo = settings.recordSettings
  const showRecord =
    recordInfo?.showRecord !== false && (recordInfo?.icpNumber || recordInfo?.policeNumber)

  const defaultSidebar = (
    <Sidebar authors={sidebar.authors} categories={sidebar.categories} tags={sidebar.tags} />
  )

  return (
    <>
      <div aria-hidden="true" className="blog-bg-comic-bottom" />
      <div
        aria-hidden="true"
        className="scroll-progress-bar fixed top-0 left-0 right-0 z-50 h-0.5 origin-left"
        role="presentation"
        style={{
          background: 'var(--accent)',
          animation: 'scale-progress linear',
          animationDuration: '1ms',
          animationTimeline: 'scroll(root block)',
          animationRange: '0% 100%',
        }}
      />

      <div className="relative z-[1] min-h-screen flex flex-col">
        <a className="blog-skip-link" href="#main-content">
          跳到主要内容
        </a>
        <header
          className="site-header sticky top-0 z-30 flex flex-col border-b"
          style={{ background: 'var(--header-bg)', borderColor: 'var(--border)' }}
        >
          <div className="blog-shell mx-auto w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <Link
              className="header-brand font-semibold transition-opacity hover:opacity-80"
              href="/"
              prefetch={false}
              style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}
            >
              <span className="header-brand-name">{siteName}</span>
            </Link>

            <nav aria-label="主导航" className="hidden lg:flex items-center gap-5">
              {menu.map((item) => {
                const active = isNavItemActive(pathname, item.url)
                return (
                  <Link
                    aria-current={active ? 'page' : undefined}
                    className="nav-link-cute py-1 flex items-center gap-1.5"
                    href={item.url}
                    key={item.url + item.title}
                    prefetch={false}
                    style={{
                      color: active ? 'var(--accent)' : 'var(--text-muted)',
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'var(--font-mono)',
                    }}
                    target={item.target || '_self'}
                  >
                    {item.title}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
              <MobileNav menu={menu} />
              <BlogSearch />
              <ThemeColor />
              <DarkModeToggle />
            </div>
          </div>
        </header>

        <div className="blog-shell mx-auto w-full px-4 sm:px-6 py-6 md:py-8 flex-1 flex flex-col lg:flex-row gap-8 lg:gap-10">
          <main className="flex-1 min-w-0 page-main" id="main-content">
            {children}
          </main>
          <BlogSidebarShell>
            <div className="w-64 shrink-0 hidden lg:block">
              <div className="sticky top-24">{defaultSidebar}</div>
            </div>
            <div className="lg:hidden border-t" style={{ borderColor: 'var(--card-border)' }}>
              {defaultSidebar}
            </div>
          </BlogSidebarShell>
        </div>

        <footer
          className="py-8 mt-auto border-t"
          style={{ background: 'var(--footer-bg)', borderColor: 'var(--border)' }}
        >
          <div
            className="blog-shell mx-auto px-4 sm:px-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
            }}
          >
            <p className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <FooterBackToTop />
            </p>
            <p className="font-medium" style={{ color: 'var(--text)' }}>
              © {new Date().getFullYear()} {siteName}
            </p>
            {footerMenu.length > 0 ? (
              <nav
                aria-label="页脚导航"
                className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1"
              >
                {footerMenu.map((item) => (
                  <Link
                    key={item.url + item.title}
                    className="hover:opacity-80"
                    href={item.url}
                    prefetch={false}
                    style={{ color: 'var(--accent)' }}
                    target={item.target || '_self'}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            ) : null}
            <p className="pt-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              网站基于{' '}
              <a
                className="hover:opacity-80"
                href="https://nextjs.org"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)' }}
                target="_blank"
              >
                Next.js
              </a>{' '}
              +{' '}
              <a
                className="hover:opacity-80"
                href="https://payloadcms.com"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)' }}
                target="_blank"
              >
                Payload
              </a>{' '}
              构建 ·{' '}
              <a
                className="hover:opacity-80"
                href="/rss"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)' }}
                target="_blank"
              >
                {frontendLabels.site.blogRss}
              </a>
              {' · '}
              <a
                className="hover:opacity-80"
                href="/sitemap.xml"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)' }}
                target="_blank"
              >
                Sitemap
              </a>
            </p>
            {showRecord ? (
              <p className="pt-1.5" style={{ fontSize: 'var(--text-xs)' }}>
                {recordInfo?.icpNumber ? (
                  <a
                    className="hover:opacity-80"
                    href={recordInfo.icpLink || 'https://beian.miit.gov.cn/'}
                    rel="noopener noreferrer"
                    style={{ color: 'var(--text-muted)' }}
                    target="_blank"
                  >
                    {recordInfo.icpNumber}
                  </a>
                ) : null}
                {recordInfo?.policeNumber ? (
                  <>
                    {recordInfo?.icpNumber ? ' · ' : null}
                    <a
                      className="hover:opacity-80"
                      href={recordInfo.policeLink || '#'}
                      rel="noopener noreferrer"
                      style={{ color: 'var(--text-muted)' }}
                      target="_blank"
                    >
                      {recordInfo.policeNumber}
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        </footer>

        <BackToTop />
      </div>
    </>
  )
}
