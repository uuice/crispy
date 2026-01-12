import { inject, Injectable } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'

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
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private title = inject(Title)
  private meta = inject(Meta)

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
   * Set default SEO data for the site
   */
  setDefaultSeo(): void {
    this.setSeoData({
      title: 'Crispy - A Modern Web Application',
      description: 'Crispy - A Modern Web Application built with Angular and Node.js',
      keywords: 'crispy, web app, application, angular, nodejs',
      author: 'Your Name',
      ogTitle: 'Crispy',
      ogDescription: 'Crispy - A Modern Web Application',
      ogType: 'website',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for home page
   */
  setHomeSeo(): void {
    this.setSeoData({
      title: 'Crispy - 现代化博客平台',
      description:
        '基于 Angular 和 PrimeNG 构建的现代化、优雅的博客平台。发现精彩内容，分享你的想法。',
      keywords: 'crispy, 博客, angular, primeng, 现代化, 优雅',
      author: 'Crispy Team',
      ogTitle: 'Crispy - 现代化博客平台',
      ogDescription: '基于 Angular 和 PrimeNG 构建的现代化、优雅的博客平台',
      ogType: 'website',
      ogImage: '/assets/images/og-home.jpg',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Crispy - 现代化博客平台',
      twitterDescription: '基于 Angular 和 PrimeNG 构建的现代化、优雅的博客平台',
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
    this.setSeoData({
      title: `${article.title} - Crispy`,
      description: article.description || article.title,
      keywords: article.keywords,
      author: article.author || 'Crispy Team',
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
    this.setSeoData({
      title: `${category.name} - 分类 - Crispy`,
      description: category.description || `${category.name} 分类下的 ${category.count} 篇文章`,
      keywords: `${category.name}, 分类, 文章, crispy`,
      ogTitle: `${category.name} - 分类`,
      ogDescription: category.description || `${category.name} 分类下的 ${category.count} 篇文章`,
      ogType: 'website',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for tag page
   */
  setTagSeo(tag: { name: string; count: number }): void {
    this.setSeoData({
      title: `${tag.name} - 标签 - Crispy`,
      description: `${tag.name} 标签下的 ${tag.count} 篇文章`,
      keywords: `${tag.name}, 标签, 文章, crispy`,
      ogTitle: `${tag.name} - 标签`,
      ogDescription: `${tag.name} 标签下的 ${tag.count} 篇文章`,
      ogType: 'website',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for about page
   */
  setAboutSeo(): void {
    this.setSeoData({
      title: '关于我们 - Crispy',
      description: '了解 Crispy 博客平台的故事，我们的使命和价值观。',
      keywords: '关于, 我们, crispy, 博客平台, 使命',
      ogTitle: '关于我们 - Crispy',
      ogDescription: '了解 Crispy 博客平台的故事，我们的使命和价值观。',
      ogType: 'website',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for archives page
   */
  setArchivesSeo(): void {
    this.setSeoData({
      title: '文章归档 - Crispy',
      description: '浏览 Crispy 博客平台的所有文章，按时间顺序排列。',
      keywords: '归档, 文章, 时间顺序, crispy',
      ogTitle: '文章归档 - Crispy',
      ogDescription: '浏览 Crispy 博客平台的所有文章，按时间顺序排列。',
      ogType: 'website',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for links page
   */
  setLinksSeo(): void {
    this.setSeoData({
      title: '友情链接 - Crispy',
      description: 'Crispy 博客平台的友情链接，发现更多优质网站。',
      keywords: '友情链接, 网站, 推荐, crispy',
      ogTitle: '友情链接 - Crispy',
      ogDescription: 'Crispy 博客平台的友情链接，发现更多优质网站。',
      ogType: 'website',
      robots: 'index, follow'
    })
  }

  /**
   * Set SEO data for disclaimer page
   */
  setDisclaimerSeo(): void {
    this.setSeoData({
      title: '免责声明 - Crispy',
      description: 'Crispy 博客平台的免责声明和使用条款。',
      keywords: '免责声明, 使用条款, 法律, crispy',
      ogTitle: '免责声明 - Crispy',
      ogDescription: 'Crispy 博客平台的免责声明和使用条款。',
      ogType: 'website',
      robots: 'noindex, nofollow'
    })
  }

  /**
   * Set SEO data for 404 page
   */
  set404Seo(): void {
    this.setSeoData({
      title: '页面未找到 - Crispy',
      description: '抱歉，您访问的页面不存在。',
      keywords: '404, 页面未找到, 错误, crispy',
      ogTitle: '页面未找到 - Crispy',
      ogDescription: '抱歉，您访问的页面不存在。',
      ogType: 'website',
      robots: 'noindex, nofollow'
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

  /**
   * Clear all meta tags (useful for cleanup)
   */
  clearMetaTags(): void {
    // Note: This is a simplified version. In production, you might want to be more specific
    // about which tags to remove
    const metaTags = document.querySelectorAll('meta[name], meta[property]')
    metaTags.forEach((tag) => {
      const name = tag.getAttribute('name') || tag.getAttribute('property')
      if (name && !['viewport', 'charset', 'theme-color'].includes(name)) {
        tag.remove()
      }
    })
  }
}
