# SEO 服务使用指南

## 概述

SEO 服务提供了在 Angular 应用中动态设置页面标题和 meta 标签的功能，支持不同页面使用不同的 SEO 配置。

## 基本用法

### 1. 在组件中使用 SEO 服务

```typescript
import { Component, OnInit } from '@angular/core'
import { SeoService } from '../../services/seo.service'

@Component({
  selector: 'app-my-page',
  template: `<div>页面内容</div>`
})
export class MyPageComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // 使用预定义的 SEO 方法
    this.seoService.setHomeSeo()

    // 或者使用自定义 SEO 数据
    this.seoService.setSeoData({
      title: '我的页面 - Crispy',
      description: '这是一个自定义页面的描述',
      keywords: '关键词1, 关键词2',
      ogTitle: '我的页面',
      ogDescription: 'Open Graph 描述',
      ogType: 'website'
    })
  }
}
```

### 2. 使用 SEO 指令（推荐）

```typescript
import { Component } from '@angular/core'
import { SeoDirective } from '../../directives/seo.directive'

@Component({
  selector: 'app-home',
  template: `
    <div csSeo="home">
      <!-- 页面内容 -->
    </div>
  `,
  imports: [SeoDirective],
  standalone: true
})
export class HomeComponent {}
```

或者使用自定义 SEO 数据：

```typescript
@Component({
  selector: 'app-article',
  template: `
    <div [csSeo]="articleSeo">
      <!-- 页面内容 -->
    </div>
  `,
  imports: [SeoDirective],
  standalone: true
})
export class ArticleComponent {
  articleSeo = {
    title: '文章标题 - Crispy',
    description: '文章描述',
    keywords: '文章关键词',
    ogTitle: '文章标题',
    ogDescription: '文章描述',
    ogType: 'article',
    ogImage: '/path/to/image.jpg'
  }
}
```

## 预定义的 SEO 方法

### 页面类型

1. **首页** - `setHomeSeo()`
2. **关于页面** - `setAboutSeo()`
3. **文章归档** - `setArchivesSeo()`
4. **友情链接** - `setLinksSeo()`
5. **免责声明** - `setDisclaimerSeo()`
6. **404 页面** - `set404Seo()`

### 动态内容 SEO

1. **文章页面** - `setArticleSeo(article)`
2. **分类页面** - `setCategorySeo(category)`
3. **标签页面** - `setTagSeo(tag)`

## SEO 数据接口

```typescript
interface SeoData {
  title?: string // 页面标题
  description?: string // 页面描述
  keywords?: string // 关键词
  author?: string // 作者
  ogTitle?: string // Open Graph 标题
  ogDescription?: string // Open Graph 描述
  ogType?: string // Open Graph 类型
  ogImage?: string // Open Graph 图片
  ogUrl?: string // Open Graph URL
  twitterCard?: string // Twitter Card 类型
  twitterTitle?: string // Twitter 标题
  twitterDescription?: string // Twitter 描述
  twitterImage?: string // Twitter 图片
  canonicalUrl?: string // 规范 URL
  robots?: string // 搜索引擎爬虫指令
}
```

## 最佳实践

### 1. 在 ngOnInit 中设置 SEO

```typescript
ngOnInit(): void {
  this.seoService.setHomeSeo()
}
```

### 2. 为动态内容设置 SEO

```typescript
ngOnInit(): void {
  // 获取文章数据后设置 SEO
  this.articleService.getArticle(this.articleId).subscribe(article => {
    this.seoService.setArticleSeo({
      title: article.title,
      description: article.description,
      keywords: article.keywords,
      author: article.author,
      image: article.image,
      url: window.location.href
    })
  })
}
```

### 3. 使用指令简化代码

```typescript
// 在模板中使用指令
<div [csSeo]="'home'">
  <!-- 首页内容 -->
</div>

<div [csSeo]="customSeoData">
  <!-- 自定义 SEO 内容 -->
</div>
```

### 4. 清理 meta 标签

```typescript
ngOnDestroy(): void {
  // 可选：清理自定义 meta 标签
  this.seoService.clearMetaTags()
}
```

## 注意事项

1. **SSR 兼容性**: 服务在服务器端渲染时也能正常工作
2. **性能考虑**: SEO 设置只在组件初始化时执行一次
3. **动态内容**: 对于动态内容，确保在数据加载完成后设置 SEO
4. **默认值**: 主布局组件会设置默认的 SEO 数据
5. **清理**: 通常不需要手动清理 meta 标签，新页面会自动覆盖

## 示例

### 文章详情页面

```typescript
@Component({
  selector: 'app-article-detail',
  template: `<div>文章内容</div>`
})
export class ArticleDetailComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const articleId = params['id']
      this.articleService.getArticle(articleId).subscribe((article) => {
        this.seoService.setArticleSeo({
          title: article.title,
          description: article.description,
          keywords: article.keywords,
          author: article.author,
          image: article.image,
          url: window.location.href
        })
      })
    })
  }
}
```

### 分类页面

```typescript
@Component({
  selector: 'app-category',
  template: `<div>分类内容</div>`
})
export class CategoryComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const categoryName = params['name']
      this.seoService.setCategorySeo({
        name: categoryName,
        description: `${categoryName} 分类下的文章`,
        count: this.getCategoryCount(categoryName)
      })
    })
  }
}
```
