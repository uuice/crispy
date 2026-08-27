import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { FrontendAiAssistant } from '@/components/FrontendAiAssistant'
import { InitTheme } from '@/frontend/InitTheme'
import { Layout } from '@/frontend/Layout'
import { querySidebarData } from '@/frontend/data/queries'
import { Providers } from '@/providers'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

// HTML is generated at request time and cached in DB; skip build-time prerender.
export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ isEnabled }, layoutData] = await Promise.all([draftMode(), querySidebarData()])

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="zh-CN"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.svg" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          <div className="crispy-chrome">
            {isEnabled ? (
              <AdminBar
                adminBarProps={{
                  preview: isEnabled,
                }}
              />
            ) : null}
            <FrontendAiAssistant />
          </div>
          <Layout layoutData={layoutData}>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings()()
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
  }
}
