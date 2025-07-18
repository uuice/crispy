import { Component, signal, computed } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { PaginatorModule } from 'primeng/paginator'
import { TagModule } from 'primeng/tag'

// Article-like structure for npm libraries
export interface Article {
  id: number
  title: string
  url: string
  sub_title?: string
  abstract?: string
  content?: string
  image?: string
  image_list?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  remark?: string
  user_id?: number
  tags?: string
  type_id?: number
  type_ids?: string
  status?: number
  sort?: number
  click?: number
  attrs?: string
  is_review?: number
  redirect_url?: string
  create_time?: number
  update_time?: number
  is_delete?: number
}

// Export mock data for detail page reuse
export const DAILY_LIBS: Article[] = [
  {
    id: 1,
    title: 'lodash',
    url: '/daily-lib/1',
    abstract: '一个现代 JavaScript 工具库，提供丰富的函数式编程工具。',
    tags: '工具库,函数式',
    redirect_url: 'https://lodash.com/',
    image: 'https://raw.githubusercontent.com/lodash/lodash/master/lodash.svg',
    content: 'Lodash 让 JavaScript 更简单，极大提升了数组、对象、字符串等数据的处理效率。',
    seo_title: 'Lodash - 现代 JS 工具库',
    seo_description: 'Lodash 是一个现代 JavaScript 工具库，提供模块化、高性能的函数式工具。',
    seo_keywords: 'lodash,工具库,javascript',
    create_time: 1710000000000,
    update_time: 1710000000000,
    is_delete: 0
  },
  {
    id: 2,
    title: 'axios',
    url: '/daily-lib/2',
    abstract: '基于 Promise 的 HTTP 客户端，支持浏览器和 Node.js。',
    tags: 'HTTP,客户端,Ajax',
    redirect_url: 'https://axios-http.com/',
    image: 'https://avatars.githubusercontent.com/u/32372333?s=200&v=4',
    content: 'Axios 是一个基于 Promise 的 HTTP 客户端，支持拦截器、取消请求等高级功能。',
    seo_title: 'Axios - HTTP 客户端',
    seo_description: 'Axios 是一个支持浏览器和 Node.js 的 HTTP 客户端。',
    seo_keywords: 'axios,http,ajax',
    create_time: 1710000001000,
    update_time: 1710000001000,
    is_delete: 0
  },
  {
    id: 3,
    title: 'moment',
    url: '/daily-lib/3',
    abstract: '强大的日期处理库，支持解析、校验、格式化和显示日期。',
    tags: '日期,时间,格式化',
    redirect_url: 'https://momentjs.com/',
    image: 'https://avatars.githubusercontent.com/u/4129662?s=200&v=4',
    content: 'Moment.js 是一个功能强大的日期处理库，支持多种日期格式的解析和转换。',
    seo_title: 'Moment.js - 日期库',
    seo_description: '解析、校验、格式化和显示日期和时间的 JavaScript 库。',
    seo_keywords: 'moment,日期,时间',
    create_time: 1710000002000,
    update_time: 1710000002000,
    is_delete: 0
  },
  {
    id: 4,
    title: 'chalk',
    url: '/daily-lib/4',
    abstract: '终端字符串样式美化工具，让命令行输出更丰富多彩。',
    tags: '终端,样式,颜色',
    redirect_url: 'https://github.com/chalk/chalk',
    image: 'https://raw.githubusercontent.com/chalk/chalk/main/media/logo.svg',
    content: 'Chalk 可以让你在 Node.js 终端输出彩色字符串，提升可读性和美观度。',
    seo_title: 'Chalk - 终端字符串美化',
    seo_description: '在 Node.js 终端输出彩色字符串的工具库。',
    seo_keywords: 'chalk,终端,颜色',
    create_time: 1710000003000,
    update_time: 1710000003000,
    is_delete: 0
  },
  {
    id: 5,
    title: 'express',
    url: '/daily-lib/5',
    abstract: '极简且灵活的 Node.js Web 框架，快速构建服务端应用。',
    tags: 'Web,框架,Node',
    redirect_url: 'https://expressjs.com/',
    image:
      'https://raw.githubusercontent.com/expressjs/expressjs.com/gh-pages/images/express-facebook-share.png',
    content: 'Express 是一个极简且灵活的 Node.js Web 应用框架，拥有丰富的中间件生态。',
    seo_title: 'Express - Web 框架',
    seo_description: '极简、灵活、功能强大的 Node.js Web 框架。',
    seo_keywords: 'express,web,框架',
    create_time: 1710000004000,
    update_time: 1710000004000,
    is_delete: 0
  }
]

@Component({
  selector: 'app-daily-lib',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    TagModule
  ],
  template: `
    <div class="lib-page-root">
      <div class="search-bar">
        <input
          pInputText
          [ngModel]="search()"
          (ngModelChange)="search.set($event)"
          placeholder="搜索库名称"
        />
        <button
          pButton
          type="button"
          label="搜索"
          icon="pi pi-search"
          (click)="onSearch()"
        ></button>
      </div>
      <div class="card-list">
        <div *ngFor="let lib of pagedList()" class="card-item">
          <p-card
            [header]="lib.title"
            [subheader]="lib.seo_title"
            [ngClass]="{ 'custom-card': true }"
          >
            <ng-template pTemplate="header">
              <div class="lib-logo-wrap">
                <img
                  *ngIf="lib.image"
                  [src]="lib.image"
                  [alt]="lib.title"
                  class="lib-logo"
                  loading="lazy"
                />
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="desc">{{ lib.abstract }}</div>
              <div class="tags">
                <ng-container *ngIf="lib.tags">
                  <p-tag *ngFor="let tag of lib.tags.split(',')" [value]="tag.trim()"></p-tag>
                </ng-container>
              </div>
              <div class="btn-group">
                <a
                  pButton
                  pRipple
                  class="p-button-sm p-button-outlined"
                  [href]="lib.redirect_url"
                  target="_blank"
                  >主页</a
                >
                <button
                  pButton
                  type="button"
                  label="详情"
                  icon="pi pi-info-circle"
                  class="p-button-sm p-button-outlined"
                  (click)="gotoDetail(lib.url)"
                ></button>
              </div>
              <div class="seo-desc">{{ lib.seo_description }}</div>
            </ng-template>
          </p-card>
        </div>
      </div>
      <div class="paginator-wrap">
        <p-paginator
          [rows]="pageSize()"
          [totalRecords]="filteredList().length"
          [first]="(page() - 1) * pageSize()"
          [rowsPerPageOptions]="[5, 10, 20, 50, 100]"
          (onPageChange)="onPageChange($event)"
          styleClass="p-paginator-sm"
        ></p-paginator>
      </div>
    </div>
  `,
  styles: [
    `
      .lib-page-root {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 16px;
        background: var(--p-content-background);
      }
      .search-bar {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 32px;
      }
      .card-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .card-item {
        flex: 1 1 100%;
        max-width: 100%;
        margin-bottom: 32px;
        display: flex;
      }
      @media (min-width: 768px) {
        .card-item {
          flex: 1 1 48%;
          max-width: 48%;
        }
      }
      @media (min-width: 1200px) {
        .card-item {
          flex: 1 1 31%;
          max-width: 31%;
        }
      }
      :host ::ng-deep .custom-card {
        background: var(--p-content-background);
        color: var(--p-content-color);
        border: 1px solid var(--p-content-border-color);
        border-radius: 12px;
        min-height: 220px;
        margin-bottom: 0;
        display: flex;
        flex: 1;
      }
      :host ::ng-deep .p-card {
        flex: 1 !important;
      }
      :host ::ng-deep .p-card-content,
      :host ::ng-deep .p-card-header,
      :host ::ng-deep .p-card-subtitle {
        text-align: left;
      }
      :host ::ng-deep .p-card-header {
        color: var(--p-text-color);
      }
      :host ::ng-deep .p-card-subtitle {
        color: var(--p-text-muted-color);
      }
      .desc {
        color: var(--p-text-muted-color);
        font-size: 15px;
        min-height: 40px;
        margin-bottom: 8px;
      }
      .tags {
        margin-bottom: 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .btn-group {
        display: flex;
        gap: 12px;
        margin: 16px 0 8px 0;
      }
      .btn-group a,
      .btn-group button {
        color: var(--p-content-color);
      }
      .seo-desc {
        color: var(--p-text-hover-muted-color);
        font-size: 13px;
        margin-top: 8px;
      }
      .paginator-wrap {
        display: flex;
        justify-content: center;
        margin-top: 24px;
      }
      .lib-logo-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 72px;
        margin-bottom: 8px;
      }
      .lib-logo {
        width: 56px;
        height: 56px;
        object-fit: contain;
        border-radius: 12px;
        background: var(--p-content-hover-background, #222);
        box-shadow: 0 1px 4px 0 var(--p-content-border-color, rgba(0, 0, 0, 0.08));
        display: block;
      }
    `
  ]
})
export class DailyLibPage {
  libs = signal(DAILY_LIBS)
  search = signal('')
  page = signal(1)
  pageSize = signal(3)

  filteredList = computed(() => {
    const q = this.search().toLowerCase()
    return this.libs().filter((lib) => lib.title.toLowerCase().includes(q))
  })

  pagedList = computed(() => {
    const start = (this.page() - 1) * this.pageSize()
    return this.filteredList().slice(start, start + this.pageSize())
  })

  totalPages = computed(() => Math.ceil(this.filteredList().length / this.pageSize()) || 1)

  constructor(private router: Router) {}

  onSearch() {
    this.page.set(1)
  }

  onPageChange(event: any) {
    this.page.set(Math.floor(event.first / event.rows) + 1)
    this.pageSize.set(event.rows)
  }

  gotoDetail(url: string) {
    this.router.navigate(['/daily-lib', url])
  }
}
