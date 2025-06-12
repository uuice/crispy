import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

interface FeedItem {
  title: string
  link: string
  description: string
  date: string
  author: string
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  // Generate RSS feed XML
  generateRssFeed(): string {
    const items = this.getFeedItems()
    const now = new Date().toUTCString()

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Crispy Blog</title>
    <link>https://example.com</link>
    <description>A modern blog platform built with Angular and Node.js</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://example.com/rss" rel="self" type="application/rss+xml" />
    ${items
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.date}</pubDate>
      <author>${item.author}</author>
      <guid isPermaLink="true">${item.link}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`
  }

  // Generate sitemap XML
  generateSitemap(): string {
    const urls = this.getSitemapUrls()
    const now = new Date().toISOString()

    return `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || now}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`
  }

  // Get feed items for RSS
  private getFeedItems(): FeedItem[] {
    // In a real application, this would come from a database or API
    return [
      {
        title: 'Getting Started with Angular SSR',
        link: 'https://example.com/post/1',
        description: 'Learn how to implement server-side rendering in your Angular applications.',
        date: new Date('2024-03-15').toUTCString(),
        author: 'John Doe'
      },
      {
        title: 'TypeScript Best Practices',
        link: 'https://example.com/post/2',
        description: 'Explore advanced TypeScript features and best practices.',
        date: new Date('2024-03-10').toUTCString(),
        author: 'John Doe'
      }
    ]
  }

  // Get URLs for sitemap
  private getSitemapUrls(): Array<{
    loc: string
    lastmod?: string
    changefreq: string
    priority: number
  }> {
    // In a real application, this would be dynamically generated
    return [
      {
        loc: 'https://example.com',
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: 'https://example.com/about',
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: 'https://example.com/archives',
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: 'https://example.com/links',
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: 'https://example.com/categories',
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: 'https://example.com/tags',
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: 'https://example.com/author',
        changefreq: 'monthly',
        priority: 0.7
      }
    ]
  }
}
