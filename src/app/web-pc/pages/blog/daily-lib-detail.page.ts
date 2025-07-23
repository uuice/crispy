import { Component, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { DAILY_LIBS, Article } from './daily-lib.page'
import { TagModule } from 'primeng/tag'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'cs-daily-lib-detail',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule],
  template: `
    <div class="lib-detail-flex">
      <!-- 左侧：文章详情 -->
      <div class="lib-detail-main">
        <div class="lib-logo-wrap">
          <img
            *ngIf="lib()?.image"
            [src]="lib()?.image"
            [alt]="lib()?.title"
            class="lib-logo"
            loading="lazy"
          />
        </div>
        <h1 class="lib-title">{{ lib()?.title }}</h1>
        <div class="lib-subtitle">{{ lib()?.sub_title }}</div>
        <div class="tags">
          <ng-container *ngIf="lib()?.tags">
            <p-tag *ngFor="let tag of lib()?.tags!.split(',')" [value]="tag.trim()"></p-tag>
          </ng-container>
        </div>
        <div class="btn-group">
          <a
            pButton
            pRipple
            class="p-button-text p-button-sm p-button-outlined"
            [href]="lib()?.redirect_url"
            target="_blank"
            >主页</a
          >
        </div>
        <div class="section" id="desc">
          <h2>简介</h2>
          <div>{{ lib()?.abstract }}</div>
        </div>
        <div class="section" id="content">
          <h2>内容</h2>
          <div>{{ lib()?.content }}</div>
        </div>
        <div class="section" id="seo">
          <h2>SEO 信息</h2>
          <div>SEO 标题: {{ lib()?.seo_title }}</div>
          <div>SEO 描述: {{ lib()?.seo_description }}</div>
          <div>SEO 关键词: {{ lib()?.seo_keywords }}</div>
        </div>
        <div class="section" id="meta">
          <h2>元信息</h2>
          <div>url: {{ lib()?.url }}</div>
          <div>sub_title: {{ lib()?.sub_title }}</div>
          <div>remark: {{ lib()?.remark }}</div>
          <div>type_id: {{ lib()?.type_id }}</div>
          <div>type_ids: {{ lib()?.type_ids }}</div>
          <div>status: {{ lib()?.status }}</div>
          <div>sort: {{ lib()?.sort }}</div>
          <div>click: {{ lib()?.click }}</div>
          <div>attrs: {{ lib()?.attrs }}</div>
          <div>is_review: {{ lib()?.is_review }}</div>
          <div>create_time: {{ lib()?.create_time }}</div>
          <div>update_time: {{ lib()?.update_time }}</div>
          <div>is_delete: {{ lib()?.is_delete }}</div>
        </div>
      </div>
      <!-- 右侧：TOC -->
      <div class="lib-detail-toc">
        <div class="toc-title">目录</div>
        <ul class="toc-list">
          <li><a href="#desc" (click)="scrollTo('desc', $event)">简介</a></li>
          <li><a href="#content" (click)="scrollTo('content', $event)">内容</a></li>
          <li><a href="#seo" (click)="scrollTo('seo', $event)">SEO 信息</a></li>
          <li><a href="#meta" (click)="scrollTo('meta', $event)">元信息</a></li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .lib-detail-flex {
        display: flex;
        gap: 32px;
        max-width: 1100px;
        margin: 32px auto;
        padding: 0 16px;
      }
      .lib-detail-main {
        flex: 1 1 0%;
        background: var(--p-content-background);
        color: var(--p-content-color);
        border-radius: 12px;
        box-shadow: 0 2px 16px 0 var(--p-content-border-color, rgba(0, 0, 0, 0.08));
        padding: 32px 28px 28px 28px;
        min-width: 0;
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
      .lib-title {
        font-size: 2rem;
        font-weight: bold;
        margin: 12px 0 4px 0;
        color: var(--p-text-color);
      }
      .lib-subtitle {
        color: var(--p-text-muted-color);
        font-size: 1.1rem;
        margin-bottom: 12px;
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
      .section {
        margin: 24px 0 0 0;
        padding: 0;
      }
      .section h2 {
        font-size: 18px;
        color: var(--p-text-color);
        margin-bottom: 8px;
      }
      .lib-detail-toc {
        flex: 0 0 180px;
        background: var(--p-content-background);
        border-radius: 12px;
        box-shadow: 0 2px 16px 0 var(--p-content-border-color, rgba(0, 0, 0, 0.08));
        padding: 24px 18px;
        height: fit-content;
        position: sticky;
        top: 120px;
        align-self: flex-start;
      }
      .toc-title {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 12px;
        color: var(--p-text-color);
      }
      .toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .toc-list li {
        margin-bottom: 10px;
      }
      .toc-list a {
        color: var(--p-text-muted-color);
        text-decoration: none;
        font-size: 15px;
        transition: color 0.2s;
      }
      .toc-list a:hover {
        color: var(--p-text-hover-color);
        text-decoration: underline;
      }
      @media (max-width: 900px) {
        .lib-detail-flex {
          flex-direction: column;
        }
        .lib-detail-toc {
          position: static;
          margin-top: 32px;
          width: 100%;
        }
      }
    `
  ]
})
export class DailyLibDetailPage {
  lib = signal<Article | undefined>(undefined)

  constructor(private route: ActivatedRoute) {
    // const url = this.route.snapshot.paramMap.get('url')
    this.lib.set(DAILY_LIBS[0])
  }

  scrollTo(id: string, event: Event) {
    event.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
