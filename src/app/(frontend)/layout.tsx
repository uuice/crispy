import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { FrontendAiAssistant } from '@/components/FrontendAiAssistant'
import { ThemePreviewBanner } from '@/components/ThemePreviewBanner'
import { ThemePreviewShell } from '@/components/ThemePreview/ThemePreviewShell'
import { Providers } from '@/providers'
import { getActiveFrontendTheme, getActiveFrontendThemeId } from '@/themes/registry'
import { getThemePreviewIdFromHeaders } from '@/themes/preview.server'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

// HTML is generated at request time and cached in DB; skip build-time prerender.
export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ isEnabled }, theme, previewThemeId, themeId] = await Promise.all([
    draftMode(),
    getActiveFrontendTheme(),
    getThemePreviewIdFromHeaders(),
    getActiveFrontendThemeId(),
  ])
  const ThemeLayout = theme.Layout
  const ThemeInit = theme.InitTheme
  const layoutData = theme.loadLayoutData ? await theme.loadLayoutData() : undefined

  return (
    <html
      className={cn(theme.rootClassName, GeistSans.variable, GeistMono.variable)}
      lang="zh-CN"
      suppressHydrationWarning
    >
      <head>
        {ThemeInit ? <ThemeInit /> : null}
        <link href={`/theme-assets/${themeId}.css`} rel="stylesheet" />
        <link href="/favicon.svg" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={cn(theme.bodyClassName, 'min-h-screen antialiased')}>
        <Providers>
          <ThemePreviewShell themeId={previewThemeId}>
            <div className="crispy-chrome">
              {isEnabled ? (
                <AdminBar
                  adminBarProps={{
                    preview: isEnabled,
                  }}
                />
              ) : null}
              <ThemePreviewBanner />
              <FrontendAiAssistant />
            </div>
            <ThemeLayout layoutData={layoutData}>{children}</ThemeLayout>
          </ThemePreviewShell>
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const [settings, previewThemeId] = await Promise.all([
    getCachedSiteSettings()(),
    getThemePreviewIdFromHeaders(),
  ])
  const siteName = settings.siteName || 'Crispy'

  return {
    metadataBase: new URL(getServerSideURL()),
    description: settings.siteDescription || undefined,
    openGraph: mergeOpenGraph(undefined, siteName, settings.siteDescription),
    title: {
      default: siteName,
      template: `%s · ${siteName}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
    ...(previewThemeId
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  }
}
