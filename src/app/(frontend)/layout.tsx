import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { BlogLayout } from '@/components/BlogSkin/BlogLayout'
import { InitBlogTheme } from '@/components/BlogSkin/InitBlogTheme'
import { Providers } from '@/providers'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="zh-CN" suppressHydrationWarning>
      <head>
        <InitBlogTheme />
        <link href="/favicon.svg" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="blog-skin min-h-screen flex flex-col antialiased">
        <Providers>
          {isEnabled ? (
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
          ) : null}
          <BlogLayout>{children}</BlogLayout>
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
