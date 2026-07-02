import Link from 'next/link'
import React from 'react'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import { getPagePath, getPostsListPath } from '@/utilities/frontendPaths'
import { querySidebarData, type NavItem } from '@/utilities/queryFrontendData'

import { BackToTop, FooterBackToTop } from './BackToTop'
import { BlogSearch } from './BlogSearch'
import { DarkModeToggle } from './DarkModeToggle'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { SiteCuteDecor } from './SiteCuteDecor'
import { ThemeColor } from './ThemeColor'

const defaultMenu: NavItem[] = [
  { title: '首页', url: '/', target: '_self' },
  { title: '文章', url: getPostsListPath(), target: '_self' },
  { title: '友链', url: '/links', target: '_self' },
  { title: '关于', url: getPagePath('about'), target: '_self' },
  { title: '导航', url: '/navigations', target: '_self' },
  { title: '小游戏', url: '/games', target: '_self' },
]

type Props = {
  children: React.ReactNode
}

export async function BlogLayout({ children }: Props) {
  const [settings, sidebar] = await Promise.all([getCachedSiteSettings()(), querySidebarData()])

  const siteName = settings.siteName || '博客'
  const menu = sidebar.menu.length > 0 ? sidebar.menu : defaultMenu
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
      <SiteCuteDecor variant="blog" />

      <div className="relative z-[1] min-h-screen flex flex-col">
        <header
          className="sticky top-0 z-30 flex flex-col border-b"
          style={{ background: 'var(--header-bg)', borderColor: 'var(--border)' }}
        >
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <Link
              className="header-brand font-semibold transition-opacity hover:opacity-80 flex items-center gap-1.5"
              href="/"
              style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}
            >
              <span className="header-brand-name">{siteName}</span>
              <span aria-hidden="true" className="header-cute-sparkle select-none">
                ✨
              </span>
            </Link>

            <nav aria-label="主导航" className="hidden lg:flex items-center gap-5">
              {menu.map((item) => (
                <Link
                  className="nav-link-cute py-1 flex items-center gap-1.5"
                  href={item.url}
                  key={item.url + item.title}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                  }}
                  target={item.target || '_self'}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
              <MobileNav menu={menu} />
              <BlogSearch />
              <ThemeColor />
              <DarkModeToggle />
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8 flex-1 flex flex-col lg:flex-row gap-8 lg:gap-10">
          <main className="flex-1 min-w-0 page-main" id="pjax-main">
            {children}
          </main>
          <div className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <Sidebar
                user={sidebar.user}
                categories={sidebar.categories}
                tags={sidebar.tags}
              />
            </div>
          </div>
          <div className="lg:hidden mt-6 pt-6 border-t" style={{ borderColor: 'var(--card-border)' }}>
            <Sidebar user={sidebar.user} categories={sidebar.categories} tags={sidebar.tags} />
          </div>
        </div>

        <footer
          className="py-8 mt-auto border-t"
          style={{ background: 'var(--footer-bg)', borderColor: 'var(--border)' }}
        >
          <div
            className="max-w-6xl mx-auto px-4 sm:px-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
            }}
          >
            <p className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <FooterBackToTop />
            </p>
            <p
              className="font-medium flex flex-wrap items-center gap-x-1.5 gap-y-0.5"
              style={{ color: 'var(--text)' }}
            >
              <span aria-hidden="true" className="footer-cute-emoji select-none">
                ♡
              </span>
              <span>
                © {new Date().getFullYear()} {siteName}
              </span>
            </p>
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
                RSS
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
