import { inject, Injectable, PLATFORM_ID } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { SiteSettingsService } from './site-settings.service'

export interface SeoData {
  title?: string
  description?: string
  keywords?: string
  author?: string
  ogTitle?: string
  ogDescription?: string
  ogType?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonicalUrl?: string
  robots?: string
  ogLocale?: string
}

@Injectable({
  providedIn: 'root'
})
export class SsrSeoService {
  private title = inject(Title)
  private meta = inject(Meta)
  private platformId = inject(PLATFORM_ID)
  private siteSettingsService = inject(SiteSettingsService)

  /**
   * Set SEO data for current page
   */
  setSeoData(data: SeoData): void {
    // Set page title
    if (data.title) {
      this.title.setTitle(data.title)
    }

    // Set meta description
    if (data.description) {
      this.updateMetaTag('description', data.description)
    }

    // Set meta keywords
    if (data.keywords) {
      this.updateMetaTag('keywords', data.keywords)
    }

    // Set meta author
    if (data.author) {
      this.updateMetaTag('author', data.author)
    }

    // Set robots
    if (data.robots) {
      this.updateMetaTag('robots', data.robots)
    }

    // Set Open Graph tags
    if (data.ogTitle) {
      this.updateMetaTag('og:title', data.ogTitle)
    }

    if (data.ogDescription) {
      this.updateMetaTag('og:description', data.ogDescription)
    }

    if (data.ogType) {
      this.updateMetaTag('og:type', data.ogType)
    }

    if (data.ogImage) {
      this.updateMetaTag('og:image', data.ogImage)
    }

    if (data.ogUrl) {
      this.updateMetaTag('og:url', data.ogUrl)
    }

    // Set Twitter Card tags
    if (data.twitterCard) {
      this.updateMetaTag('twitter:card', data.twitterCard)
    }

    if (data.twitterTitle) {
      this.updateMetaTag('twitter:title', data.twitterTitle)
    }

    if (data.twitterDescription) {
      this.updateMetaTag('twitter:description', data.twitterDescription)
    }

    if (data.twitterImage) {
      this.updateMetaTag('twitter:image', data.twitterImage)
    }

    // Set canonical URL
    if (data.canonicalUrl) {
      this.setCanonicalUrl(data.canonicalUrl)
    }
  }

  /**
   * Set SEO data for home page
   */
  setHomeSeo(): void {
    const settings = this.siteSettingsService.siteSettings()
    this.setSeoData({
      title: settings?.siteName || '轻盈的鱼',
      description:
        settings?.siteDescription ||
        '专注于前端开发的程序员，分享Vue、Angular、Node.js等技术栈的学习笔记和解决方案。',
      keywords:
        settings?.siteKeywords || '前端开发, Vue, Angular, Node.js, JavaScript, 学习笔记, 技术博客',
      author: 'UUICE',
      ogTitle: settings?.siteName || '轻盈的鱼',
      ogDescription:
        settings?.siteDescription ||
        '专注于前端开发的程序员，分享Vue、Angular、Node.js等技术栈的学习笔记和解决方案。',
      ogType: 'website',
      ogLocale: 'zh_CN',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for article page
   */
  setArticleSeo(article: {
    title: string
    description?: string
    keywords?: string
    author?: string
    image?: string
    url: string
  }): void {
    const settings = this.siteSettingsService.siteSettings()
    this.setSeoData({
      title: `${article.title} - ${settings?.siteName || '轻盈的鱼'}`,
      description: article.description || article.title,
      keywords: article.keywords,
      author: article.author || 'UUICE',
      ogTitle: article.title,
      ogDescription: article.description || article.title,
      ogType: 'article',
      ogImage: article.image,
      ogUrl: article.url,
      twitterCard: 'summary_large_image',
      twitterTitle: article.title,
      twitterDescription: article.description || article.title,
      twitterImage: article.image,
      canonicalUrl: article.url,
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for category page
   */
  setCategorySeo(category: { name: string; description?: string; count: number }): void {
    const settings = this.siteSettingsService.siteSettings()
    this.setSeoData({
      title: `${category.name} - 分类 - ${settings?.siteName || '轻盈的鱼'}`,
      description: category.description || `${category.name} 分类下的 ${category.count} 篇文章`,
      keywords: `${category.name}, 分类, 文章, ${settings?.siteKeywords || '前端开发'}`,
      ogTitle: `${category.name} - 分类`,
      ogDescription: category.description || `${category.name} 分类下的 ${category.count} 篇文章`,
      ogType: 'website',
      ogLocale: 'zh_CN',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for tag page
   */
  setTagSeo(tag: { name: string; count: number }): void {
    const settings = this.siteSettingsService.siteSettings()
    this.setSeoData({
      title: `${tag.name} - 标签 - ${settings?.siteName || '轻盈的鱼'}`,
      description: `${tag.name} 标签下的 ${tag.count} 篇文章`,
      keywords: `${tag.name}, 标签, 文章, ${settings?.siteKeywords || '前端开发'}`,
      ogTitle: `${tag.name} - 标签`,
      ogDescription: `${tag.name} 标签下的 ${tag.count} 篇文章`,
      ogType: 'website',
      ogLocale: 'zh_CN',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for about page
   */
  setAboutSeo(): void {
    const settings = this.siteSettingsService.siteSettings()
    this.setSeoData({
      title: `关于我们 - ${settings?.siteName || '轻盈的鱼'}`,
      description: '了解我们的故事，我们的使命和价值观。',
      keywords: '关于, 我们, 使命, 价值观',
      ogTitle: `关于我们 - ${settings?.siteName || '轻盈的鱼'}`,
      ogDescription: '了解我们的故事，我们的使命和价值观。',
      ogType: 'website',
      ogLocale: 'zh_CN',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for archives page
   */
  setArchivesSeo(): void {
    const settings = this.siteSettingsService.siteSettings()
    this.setSeoData({
      title: `文章归档 - ${settings?.siteName || '轻盈的鱼'}`,
      description: '浏览所有文章，按时间顺序排列。',
      keywords: '归档, 文章, 时间顺序',
      ogTitle: `文章归档 - ${settings?.siteName || '轻盈的鱼'}`,
      ogDescription: '浏览所有文章，按时间顺序排列。',
      ogType: 'website',
      ogLocale: 'zh_CN',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for links page
   */
  setLinksSeo(): void {
    const settings = this.siteSettingsService.siteSettings()
    this.setSeoData({
      title: `友情链接 - ${settings?.siteName || '轻盈的鱼'}`,
      description: '友情链接，发现更多优质网站。',
      keywords: '友情链接, 网站, 推荐',
      ogTitle: `友情链接 - ${settings?.siteName || '轻盈的鱼'}`,
      ogDescription: '友情链接，发现更多优质网站。',
      ogType: 'website',
      ogLocale: 'zh_CN',
      robots: 'index, follow'
    })
  }

  /**
   * Update or create meta tag
   */
  private updateMetaTag(name: string, content: string): void {
    if (this.meta.getTag(`name="${name}"`)) {
      this.meta.updateTag({ name, content })
    } else if (this.meta.getTag(`property="${name}"`)) {
      this.meta.updateTag({ property: name, content })
    } else {
      this.meta.addTag({ name, content })
    }
  }

  /**
   * Set canonical URL
   */
  private setCanonicalUrl(url: string): void {
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]')
    if (existingCanonical) {
      existingCanonical.remove()
    }

    // Add new canonical link
    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = url
    document.head.appendChild(link)
  }
}
