import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { TabsModule } from 'primeng/tabs'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'cs-doc-templates',
  standalone: true,
  imports: [CardModule, TabsModule, TableModule, ButtonModule],
  template: `
    <p-card header="Nunjucks 模版扩展" styleClass="system-card">
      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">自定义标签</p-tab>
          <p-tab value="1">过滤器</p-tab>
          <p-tab value="2">全局方法</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <p-table
              [value]="tags"
              styleClass="p-datatable-sm beautify-table"
              dataKey="name"
              [expandedRowKeys]="expandedRows"
              (onRowExpand)="onRowExpand($event)"
              (onRowCollapse)="onRowCollapse($event)"
              [scrollable]="true"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th style="width: 50px"></th>
                  <th>标签名</th>
                  <th>说明</th>
                  <th>用法</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row let-expanded="expanded">
                <tr>
                  <td>
                    <p-button
                      type="button"
                      pRipple
                      [pRowToggler]="row"
                      [text]="true"
                      severity="secondary"
                      [rounded]="true"
                      [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                    ></p-button>
                  </td>
                  <td>{{ row.name }}</td>
                  <td>{{ row.desc }}</td>
                  <td>
                    <code>{{ row.usage }}</code>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="expandedrow" let-row>
                <tr>
                  <td colspan="4">
                    <div class="expansion-content">
                      <div class="expansion-header">
                        <h3 class="tag-title">{{ row.name }} 标签详情</h3>
                        <p class="tag-description">{{ row.desc }}</p>
                      </div>

                      @if (row.parameters && row.parameters.length > 0) {
                        <div class="parameters-section">
                          <div class="section-header">
                            <i class="pi pi-cog"></i>
                            <h4>参数列表</h4>
                          </div>
                          <div class="parameters-table">
                            <table>
                              <thead>
                                <tr>
                                  <th>参数名</th>
                                  <th>类型</th>
                                  <th>必填</th>
                                  <th>默认值</th>
                                  <th>说明</th>
                                </tr>
                              </thead>
                              <tbody>
                                @for (param of row.parameters; track param.name) {
                                  <tr>
                                    <td>
                                      <span class="param-name">{{ param.name }}</span>
                                    </td>
                                    <td>
                                      <span class="param-type">{{ param.type }}</span>
                                    </td>
                                    <td>
                                      <span
                                        class="param-required"
                                        [class.required]="param.required"
                                      >
                                        {{ param.required ? '是' : '否' }}
                                      </span>
                                    </td>
                                    <td>
                                      <span class="param-default">{{ param.default || '-' }}</span>
                                    </td>
                                    <td>{{ param.description }}</td>
                                  </tr>
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      }

                      @if (row.examples && row.examples.length > 0) {
                        <div class="examples-section">
                          <div class="section-header">
                            <i class="pi pi-code"></i>
                            <h4>使用示例</h4>
                          </div>
                          <div class="examples-list">
                            @for (example of row.examples; track example.title) {
                              <div class="example-item">
                                <div class="example-header">
                                  <h5>{{ example.title }}</h5>
                                  <span class="example-badge">示例</span>
                                </div>
                                <div class="code-block">
                                  <pre><code>{{ example.code }}</code></pre>
                                </div>
                                <p class="example-description">{{ example.description }}</p>
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-tabpanel>
          <p-tabpanel value="1">
            <p-table [value]="filters" styleClass="p-datatable-sm beautify-table">
              <ng-template pTemplate="header">
                <tr>
                  <th>过滤器名</th>
                  <th>说明</th>
                  <th>用法</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td>{{ row.name }}</td>
                  <td>{{ row.desc }}</td>
                  <td>
                    <code>{{ row.usage }}</code>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-tabpanel>
          <p-tabpanel value="2">
            <p-table [value]="functions" styleClass="p-datatable-sm beautify-table">
              <ng-template pTemplate="header">
                <tr>
                  <th>方法名</th>
                  <th>说明</th>
                  <th>用法</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td>{{ row.name }}</td>
                  <td>{{ row.desc }}</td>
                  <td>
                    <code>{{ row.usage }}</code>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </p-card>
  `,
  styles: [
    `
      .system-card {
        flex: 1;
        background: var(--p-content-background) !important;
        color: var(--p-content-color) !important;
        border: 1px solid var(--p-content-border-color) !important;
        border-radius: 10px;
        box-shadow: none;
        padding: 1.2rem 1.2rem 1rem 1.2rem;
        transition: border-color 0.2s;
      }
      .system-card:hover {
        border-color: var(--p-primary-color) !important;
      }
      .beautify-table th,
      .beautify-table td {
        padding: 0.5rem 1rem;
        font-size: 1.05rem;
        background: var(--p-content-background);
        border-bottom: 1px solid var(--p-content-border-color);
      }
      .beautify-table tr:hover {
        background: var(--p-primary-color) !important;
        color: var(--p-text-color) !important;
      }
      .bg-gradient-to-br {
        background: var(--p-content-background) !important;
      }
      .expansion-content {
        padding: 1.5rem;
        background: linear-gradient(
          135deg,
          var(--p-surface-section) 0%,
          var(--p-surface-ground) 100%
        );
        border-top: 2px solid var(--p-primary-color);
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 100% !important;
        box-sizing: border-box;
        overflow-x: auto;
      }

      .expansion-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--p-primary-color);
      }

      .tag-title {
        margin: 0 0 0.5rem 0;
        color: var(--p-primary-color);
        font-size: 1.5rem;
        font-weight: 700;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .tag-description {
        margin: 0;
        color: var(--p-text-color-secondary);
        font-size: 1.1rem;
        line-height: 1.5;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding: 0.75rem 1rem;
        background: var(--p-primary-color);
        color: white;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .section-header i {
        font-size: 1.1rem;
      }

      .section-header h4 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .parameters-section,
      .examples-section {
        margin-bottom: 2rem;
      }
      .parameters-table table {
        width: 100%;
        border-collapse: collapse;
        background: var(--p-content-background);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--p-content-border-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .parameters-table th,
      .parameters-table td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid var(--p-content-border-color);
        font-size: 0.95rem;
      }

      .parameters-table th {
        font-weight: 600;
      }

      .parameters-table tr:hover {
        background: var(--p-surface-hover);
        transform: translateY(-1px);
        transition: all 0.2s ease;
      }

      .param-name {
        background: var(--p-primary-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .param-type {
        background: var(--p-success-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .param-required {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .param-required.required {
        background: var(--p-danger-color);
        color: white;
      }

      .param-required:not(.required) {
        background: var(--p-success-color);
        color: white;
      }

      .param-default {
        background: var(--p-warning-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.85rem;
      }
      .examples-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .example-item {
        background: var(--p-content-background);
        border: 1px solid var(--p-content-border-color);
        border-radius: 8px;
        padding: 1.5rem;
        transition: all 0.3s ease;
      }

      .example-item:hover {
        transform: translateY(-2px);
      }

      .example-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid var(--p-primary-color);
      }

      .example-header h5 {
        margin: 0;
        color: var(--p-primary-color);
        font-size: 1.1rem;
        font-weight: 600;
      }

      .example-badge {
        background: var(--p-primary-color);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .code-block {
        margin: 1rem 0;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .code-block pre {
        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        border: none;
        border-radius: 6px;
        padding: 1.25rem;
        margin: 0;
        overflow-x: auto;
        position: relative;
      }

      .code-block pre::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(
          90deg,
          var(--p-primary-color),
          var(--p-success-color),
          var(--p-warning-color)
        );
      }

      .code-block code {
        color: #e2e8f0;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      .example-description {
        margin: 1rem 0 0 0;
        color: var(--p-text-color-secondary);
        font-size: 0.95rem;
        line-height: 1.6;
        padding: 0.75rem;
        background: var(--p-surface-ground);
        border-radius: 4px;
        border-left: 4px solid var(--p-primary-color);
      }
    `
  ]
})
export class DocTemplatesPage {
  expandedRows: any = {}

  onRowExpand(event: any) {
    console.log('Row expanded:', event.data)
    console.log('Expanded rows:', this.expandedRows)
    console.log('Parameters:', event.data.parameters)
    console.log('Examples:', event.data.examples)
  }

  onRowCollapse(event: any) {
    console.log('Row collapsed:', event.data)
    console.log('Expanded rows:', this.expandedRows)
  }

  tags = [
    {
      name: 'Articles',
      desc: '获取文章列表，支持多种查询条件',
      usage:
        '{% Articles limit=10 page=1 page_size=20 title="search" type_id=1 user_id=1 status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endArticles %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '10', description: '限制返回数量，默认10' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '20', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'title', type: 'string', required: false, default: '-', description: '按标题搜索' },
        { name: 'sub_title', type: 'string', required: false, default: '-', description: '按副标题搜索' },
        { name: 'url', type: 'string', required: false, default: '-', description: '按URL搜索' },
        { name: 'content', type: 'string', required: false, default: '-', description: '按内容搜索' },
        { name: 'markdown_content', type: 'string', required: false, default: '-', description: '按Markdown内容搜索' },
        { name: 'is_markdown', type: 'number', required: false, default: '-', description: '是否为Markdown格式' },
        { name: 'abstract', type: 'string', required: false, default: '-', description: '按摘要搜索' },
        { name: 'image', type: 'string', required: false, default: '-', description: '按图片搜索' },
        { name: 'image_list', type: 'string', required: false, default: '-', description: '按图片列表搜索' },
        { name: 'seo_title', type: 'string', required: false, default: '-', description: '按SEO标题搜索' },
        { name: 'seo_description', type: 'string', required: false, default: '-', description: '按SEO描述搜索' },
        { name: 'seo_keywords', type: 'string', required: false, default: '-', description: '按SEO关键词搜索' },
        { name: 'remark', type: 'string', required: false, default: '-', description: '按备注搜索' },
        { name: 'user_id', type: 'number', required: false, default: '-', description: '按用户ID过滤' },
        { name: 'tags', type: 'string', required: false, default: '-', description: '按标签搜索' },
        { name: 'attrs', type: 'string', required: false, default: '-', description: '按属性搜索' },
        { name: 'type_id', type: 'number', required: false, default: '-', description: '按栏目ID过滤' },
        { name: 'type_ids', type: 'string', required: false, default: '-', description: '按栏目IDs搜索' },
        { name: 'author_id', type: 'number', required: false, default: '-', description: '按作者ID过滤' },
        { name: 'redirect_url', type: 'string', required: false, default: '-', description: '按重定向URL搜索' },
        { name: 'is_review', type: 'number', required: false, default: '-', description: '是否需要审核' },
        { name: 'click', type: 'number', required: false, default: '-', description: '按点击数过滤' },
        { name: 'sort', type: 'number', required: false, default: '-', description: '按排序值过滤' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '基础用法',
          code: `{% Articles limit=10 %}
  {% for article in articles %}
    <h2>{{ article.title }}</h2>
  {% endfor %}
{% endArticles %}`,
          description: '获取前10篇文章'
        },
        {
          title: '按栏目获取文章',
          code: `{% Articles type_id=2 limit=5 %}
  {% for article in articles %}
    <h2>{{ article.title }}</h2>
  {% endfor %}
{% endArticles %}`,
          description: '获取栏目ID为2的前5篇文章'
        },
        {
          title: '按时间范围获取文章',
          code: `{% Articles create_time_start=1704067200000 create_time_end=1706745600000 %}
  {% for article in articles %}
    <h2>{{ article.title }}</h2>
    <span>{{ article.create_time | date('YYYY-MM-DD') }}</span>
  {% endfor %}
{% endArticles %}`,
          description: '获取指定时间段内发布的文章'
        },
        {
          title: '分页获取文章并显示分页信息',
          code: `{% Articles page=2 page_size=3 %}
  {% for article in articles %}
    <h2>{{ article.title }}</h2>
  {% endfor %}
  <p>Current page: {{ articles_pagination.page }}</p>
{% endArticles %}`,
          description: '获取第2页，每页3条，并显示分页'
        },
        {
          title: '按标题模糊搜索',
          code: `{% Articles title="AI" %}
  {% for article in articles %}
    <h2>{{ article.title }}</h2>
  {% endfor %}
{% endArticles %}`,
          description: '按标题模糊搜索包含"AI"的文章'
        },
        {
          title: '按用户获取文章',
          code: `{% Articles user_id=3 limit=5 %}
  {% for article in articles %}
    <h2>{{ article.title }}</h2>
    <span>By: {{ article.user_name }}</span>
  {% endfor %}
{% endArticles %}`,
          description: '获取用户ID为3的前5篇文章'
        },
        {
          title: '多条件组合筛选',
          code: `{% Articles type_id=1 user_id=2 status=10 %}
  {% for article in articles %}
    <h2>{{ article.title }}</h2>
  {% endfor %}
{% endArticles %}`,
          description: '按栏目、用户、状态组合筛选'
        }
      ]
    },
    {
      name: 'ArticleItem',
      desc: '获取单个文章',
      usage: '{% ArticleItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '文章ID' },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '文章标题'
        }
      ],
      examples: [
        {
          title: '通过ID获取',
          code: `{% ArticleItem id=1 %}
  <h1>{{ article.title }}</h1>
  <div>{{ article.content }}</div>
{% endArticleItem %}`,
          description: '通过文章ID获取单篇文章'
        },
        {
          title: '获取并显示文章摘要',
          code: `{% ArticleItem id=2 %}
  <h1>{{ article.title }}</h1>
  <p>{{ article.summary }}</p>
{% endArticleItem %}`,
          description: '获取指定ID的文章并显示摘要'
        },
        {
          title: '通过标题获取',
          code: `{% ArticleItem title="AI" %}
  <h1>{{ article.title }}</h1>
  <div>{{ article.content }}</div>
{% endArticleItem %}`,
          description: '通过标题模糊搜索获取文章'
        }
      ]
    },
    {
      name: 'Categories',
      desc: '获取分类列表，支持多种查询条件',
      usage:
        '{% Categories limit=20 page=1 page_size=10 title="search" parent_id=0 status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endCategories %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '20', description: '限制返回数量，默认20' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '10', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'title', type: 'string', required: false, default: '-', description: '按标题搜索' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '按别名搜索' },
        { name: 'des', type: 'string', required: false, default: '-', description: '按描述搜索' },
        { name: 'parent_id', type: 'number', required: false, default: '0', description: '父分类ID，0表示顶级分类' },
        { name: 'sort', type: 'number', required: false, default: '-', description: '按排序值过滤' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '获取全部分类',
          code: `{% Categories limit=20 %}
  {% for category in categories %}
    <h3>{{ category.title }}</h3>
  {% endfor %}
{% endCategories %}`,
          description: '获取前20个分类的全部内容。'
        },
        {
          title: '按别名筛选分类',
          code: `{% Categories alias="about" %}
  {% for category in categories %}
    <div class="category">
      <h2>{{ category.title }}</h2>
    </div>
  {% endfor %}
{% endCategories %}`,
          description: '只获取别名为 about 的分类。'
        },
        {
          title: '分页获取分类',
          code: `{% Categories page=2 page_size=5 %}
  {% for category in categories %}
    <div class="category">
      <h2>{{ category.title }}</h2>
    </div>
  {% endfor %}
  <p>当前页: {{ categories_pagination.page }}</p>
{% endCategories %}`,
          description: '获取第2页，每页5条，并显示分页信息。'
        },
        {
          title: '按标题模糊搜索分类',
          code: `{% Categories title="帮助" %}
  {% for category in categories %}
    <div class="category">
      <h2>{{ category.title }}</h2>
    </div>
  {% endfor %}
{% endCategories %}`,
          description: '按标题模糊搜索包含"帮助"的页面。'
        },
        {
          title: '多条件组合筛选页面',
          code: `{% Categories title="服务" alias="service" status=10 %}
  {% for category in categories %}
    <div class="category">
      <h2>{{ category.title }}</h2>
    </div>
  {% endfor %}
{% endCategories %}`,
          description: '按标题、别名和状态组合筛选页面。'
        }
      ]
    },
    {
      name: 'CategoryItem',
      desc: '获取单个分类',
      usage: '{% CategoryItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '分类ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '分类标题' }
      ],
      examples: [
        {
          title: '通过ID获取分类',
          code: `{% CategoryItem id=1 %}
  <h2>{{ category.title }}</h2>
  <p>{{ category.des }}</p>
{% endCategoryItem %}`,
          description: '通过分类ID获取分类详细信息（des 为备注描述）'
        },
        {
          title: '通过标题获取分类',
          code: `{% CategoryItem title="技术" %}
  <h2>{{ category.title }}</h2>
  <p>{{ category.des }}</p>
{% endCategoryItem %}`,
          description: '通过标题模糊搜索获取分类'
        }
      ]
    },
    {
      name: 'Pages',
      desc: '获取页面列表，支持多种查询条件',
      usage:
        '{% Pages limit=20 page=1 page_size=10 title="search" alias=search status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endPages %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '20',
          description: '限制返回数量，默认20'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'id',
          type: 'number',
          required: false,
          default: '-',
          description: '按ID过滤'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'url',
          type: 'string',
          required: false,
          default: '-',
          description: '按URL搜索'
        },
        {
          name: 'alias',
          type: 'string',
          required: false,
          default: '-',
          description: '按别名搜索'
        },
        {
          name: 'content',
          type: 'string',
          required: false,
          default: '-',
          description: '按内容搜索'
        },
        {
          name: 'markdown_content',
          type: 'string',
          required: false,
          default: '-',
          description: '按Markdown内容搜索'
        },
        {
          name: 'is_markdown',
          type: 'number',
          required: false,
          default: '-',
          description: '是否为Markdown格式'
        },
        {
          name: 'abstract',
          type: 'string',
          required: false,
          default: '-',
          description: '按摘要搜索'
        },
        {
          name: 'sub_title',
          type: 'string',
          required: false,
          default: '-',
          description: '按副标题搜索'
        },
        {
          name: 'seo_title',
          type: 'string',
          required: false,
          default: '-',
          description: '按SEO标题搜索'
        },
        {
          name: 'seo_keywords',
          type: 'string',
          required: false,
          default: '-',
          description: '按SEO关键词搜索'
        },
        {
          name: 'seo_description',
          type: 'string',
          required: false,
          default: '-',
          description: '按SEO描述搜索'
        },
        {
          name: 'image_list',
          type: 'string',
          required: false,
          default: '-',
          description: '按图片列表搜索'
        },
        {
          name: 'tags',
          type: 'string',
          required: false,
          default: '-',
          description: '按标签搜索'
        },
        {
          name: 'author_id',
          type: 'number',
          required: false,
          default: '-',
          description: '按作者ID过滤'
        },
        {
          name: 'user_id',
          type: 'number',
          required: false,
          default: '-',
          description: '按用户ID过滤'
        },
        {
          name: 'type_id',
          type: 'number',
          required: false,
          default: '-',
          description: '按类型ID过滤'
        },
        {
          name: 'click',
          type: 'number',
          required: false,
          default: '-',
          description: '按点击数过滤'
        },
        {
          name: 'remark',
          type: 'string',
          required: false,
          default: '-',
          description: '按备注搜索'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取全部页面',
          code: `{% Pages limit=20 %}
  {% for page in pages %}
    <div class="page">
      <h2>{{ page.title }}</h2>
      <p>{{ page.content }}</p>
    </div>
  {% endfor %}
{% endPages %}`,
          description: '获取前20个页面的全部内容'
        },
        {
          title: '按别名筛选页面',
          code: `{% Pages alias="about" %}
  {% for page in pages %}
    <div class="page">
      <h2>{{ page.title }}</h2>
    </div>
  {% endfor %}
{% endPages %}`,
          description: '只获取别名为 about 的页面'
        },
        {
          title: '分页获取页面',
          code: `{% Pages page=2 page_size=5 %}
  {% for page in pages %}
    <div class="page">
      <h2>{{ page.title }}</h2>
    </div>
  {% endfor %}
  <p>当前页: {{ pages_pagination.page }}</p>
{% endPages %}`,
          description: '获取第2页，每页5条，并显示分页信息'
        }
      ]
    },
    {
      name: 'PageItem',
      desc: '获取单个页面',
      usage: '{% PageItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '页面ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '页面标题' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '页面别名' }
      ],
      examples: [
        {
          title: '获取页面信息',
          code: `{% PageItem id=1 %}
  <div class="page">
    <h2>{{ page.title }}</h2>
    <div>{{ page.content }}</div>
  </div>
{% endPageItem %}`,
          description: '获取指定页面的详细信息'
        },
        {
          title: '通过别名获取页面',
          code: `{% PageItem alias="about" %}
  <div class="page">
    <h2>{{ page.title }}</h2>
    <div>{{ page.content }}</div>
  </div>
{% endPageItem %}`,
          description: '通过别名获取页面内容'
        }
      ]
    },
    {
      name: 'Roles',
      desc: '获取角色列表，支持多种查询条件',
      usage:
        '{% Roles limit=20 page=1 page_size=10 title="search" status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endRoles %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '20', description: '限制返回数量，默认20' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '10', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'title', type: 'string', required: false, default: '-', description: '按标题搜索' },
        { name: 'des', type: 'string', required: false, default: '-', description: '按描述搜索' },
        { name: 'module_id', type: 'number', required: false, default: '-', description: '按模块ID过滤' },
        { name: 'rule_ids', type: 'string', required: false, default: '-', description: '按规则IDs搜索' },
        { name: 'sort', type: 'number', required: false, default: '-', description: '按排序值过滤' },
        { name: 'type_id', type: 'number', required: false, default: '-', description: '按类型ID过滤' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '获取全部角色',
          code: `{% Roles limit=20 %}
  {% for role in roles %}
    <div class="role">
      <h3>{{ role.title }}</h3>
      <p>{{ role.des }}</p>
    </div>
  {% endfor %}
{% endRoles %}`,
          description: '获取前20个角色（des 为数据库描述字段）'
        },
        {
          title: '按标题模糊搜索角色',
          code: `{% Roles title="管理员" %}
  {% for role in roles %}
    <div class="role">
      <h3>{{ role.title }}</h3>
    </div>
  {% endfor %}
{% endRoles %}`,
          description: '按标题模糊搜索包含"管理员"的角色'
        },
        {
          title: '分页获取角色',
          code: `{% Roles page=2 page_size=5 %}
  {% for role in roles %}
    <div class="role">
      <h3>{{ role.title }}</h3>
    </div>
  {% endfor %}
  <p>当前页: {{ roles_pagination.page }}</p>
{% endRoles %}`,
          description: '获取第2页，每页5条，并显示分页信息。'
        }
      ]
    },
    {
      name: 'RoleItem',
      desc: '获取单个角色',
      usage: '{% RoleItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '角色ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '角色标题' }
      ],
      examples: [
        {
          title: '获取角色信息',
          code: `{% RoleItem id=1 %}
  <div class="role">
    <h3>{{ role.title }}</h3>
    <p>{{ role.des }}</p>
  </div>
{% endRoleItem %}`,
          description: '获取指定角色的详细信息（des 为描述字段）'
        },
        {
          title: '通过标题获取角色',
          code: `{% RoleItem title="管理员" %}
  <div class="role">
    <h3>{{ role.title }}</h3>
  </div>
{% endRoleItem %}`,
          description: '通过标题模糊搜索获取角色'
        }
      ]
    },
    {
      name: 'Config',
      desc: '获取配置列表，支持多种查询条件',
      usage:
        '{% Config limit=1000 page=1 page_size=50 title="search" alias="search" type_id=1 status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endConfig %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '1000', description: '限制返回数量，默认1000' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '50', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'title', type: 'string', required: false, default: '-', description: '按标题搜索' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '按别名搜索' },
        { name: 'value', type: 'string', required: false, default: '-', description: '按值搜索' },
        { name: 'type_id', type: 'number', required: false, default: '-', description: '按类型ID过滤' },
        { name: 'type_ids', type: 'string', required: false, default: '-', description: '按类型IDs搜索' },
        { name: 'sort', type: 'number', required: false, default: '-', description: '按排序值过滤' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '获取配置列表',
          code: `{% Config limit=1000 page=1 page_size=50 title="search" alias="search" type_id=1 status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}
  {% for config in configs %}
    <div class="config">
      <strong>{{ config.title }}:</strong> {{ config.value }}
    </div>
  {% endfor %}
{% endConfig %}`,
          description: '获取配置列表'
        }
      ]
    },
    {
      name: 'ConfigItem',
      desc: '获取单个配置项',
      usage: '{% ConfigItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '配置ID' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '配置别名' }
      ],
      examples: [
        {
          title: '获取配置信息',
          code: `{% ConfigItem id=1 %}
  <div class="config">
    <strong>{{ config.title }}:</strong> {{ config.value }}
  </div>
{% endConfigItem %}`,
          description: '获取指定配置项的详细信息'
        },
        {
          title: '通过别名获取配置',
          code: `{% ConfigItem alias="site_name" %}
  <div class="config">
    <strong>{{ config.title }}:</strong> {{ config.value }}
  </div>
{% endConfigItem %}`,
          description: '通过别名获取配置项'
        }
      ]
    },
    {
      name: 'Enums',
      desc: '获取枚举列表，支持多种查询条件',
      usage:
        '{% Enums limit=10 page=1 page_size=10 title="search" alias="search" code="user_status" status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endEnums %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '10', description: '限制返回数量，默认10' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '10', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'title', type: 'string', required: false, default: '-', description: '按标题搜索' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '按别名搜索' },
        { name: 'code', type: 'string', required: false, default: '-', description: '按代码搜索' },
        { name: 'value', type: 'string', required: false, default: '-', description: '按值搜索' },
        { name: 'sort', type: 'number', required: false, default: '-', description: '按排序值过滤' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '获取全部枚举',
          code: `{% Enums limit=10 %}
  {% for enum in enums %}
    <option value="{{ enum.value }}">{{ enum.title }}</option>
  {% endfor %}
{% endEnums %}`,
          description: '获取前10个枚举。'
        },
        {
          title: '按代码筛选枚举',
          code: `{% Enums code="user_status" %}
  {% for enum in enums %}
    <option value="{{ enum.value }}">{{ enum.title }}</option>
  {% endfor %}
{% endEnums %}`,
          description: '只获取代码为 user_status 的枚举。'
        },
        {
          title: '分页获取枚举',
          code: `{% Enums page=2 page_size=5 %}
  {% for enum in enums %}
    <option value="{{ enum.value }}">{{ enum.title }}</option>
  {% endfor %}
  <p>当前页: {{ enums_pagination.page }}</p>
{% endEnums %}`,
          description: '获取第2页，每页5条，并显示分页信息。'
        }
      ]
    },
    {
      name: 'EnumItem',
      desc: '获取单个枚举项',
      usage: '{% EnumItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '枚举ID' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '枚举别名' },
        { name: 'code', type: 'string', required: false, default: '-', description: '枚举代码' },
        { name: 'value', type: 'string', required: false, default: '-', description: '枚举值' }
      ],
      examples: [
        {
          title: '通过ID获取枚举',
          code: `{% EnumItem id=1 %}
  <option value="{{ enum.value }}">{{ enum.title }}</option>
{% endEnumItem %}`,
          description: '通过ID获取枚举详细信息。'
        },
        {
          title: '通过代码获取枚举',
          code: `{% EnumItem code="user_status" %}
  <option value="{{ enum.value }}">{{ enum.title }}</option>
{% endEnumItem %}`,
          description: '通过代码获取枚举信息。'
        }
      ]
    },
    {
      name: 'Keywords',
      desc: '获取关键词列表，支持多种查询条件',
      usage:
        '{% Keywords limit=10 page=1 page_size=10 title="search" alias="search" status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endKeywords %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '10', description: '限制返回数量，默认10' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '10', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'title', type: 'string', required: false, default: '-', description: '按标题搜索' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '按别名搜索' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '获取关键词列表',
          code: `{% Keywords limit=10 page=1 page_size=10 title="search" alias="search" status=10 %}
  {% for keyword in keywords %}
    <span class="keyword">{{ keyword.title }}</span>
  {% endfor %}
{% endKeywords %}`,
          description: '获取关键词列表'
        }
      ]
    },
    {
      name: 'KeywordItem',
      desc: '获取单个关键词',
      usage: '{% KeywordItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '关键词ID' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '关键词别名' },
        { name: 'title', type: 'string', required: false, default: '-', description: '关键词标题' }
      ],
      examples: [
        {
          title: '获取关键词信息',
          code: `{% KeywordItem id=1 %}
  <span class="keyword">{{ keyword.title }}</span>
{% endKeywordItem %}`,
          description: '获取指定关键词的详细信息'
        },
        {
          title: '通过别名获取关键词',
          code: `{% KeywordItem alias="seo" %}
  <span class="keyword">{{ keyword.title }}</span>
{% endKeywordItem %}`,
          description: '通过别名获取关键词信息'
        }
      ]
    },
    {
      name: 'Ads',
      desc: '获取广告列表，支持多种查询条件',
      usage:
        '{% Ads limit=10 page=1 page_size=10 title="search" alias="search" content="search" type_id=1 status=10 sort_min=0 sort_max=100 create_time_start=1640995200000 create_time_end=1640995200000 has_image=true has_url=true %}...{% endAds %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '10',
          description: '限制返回数量，默认10'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'id',
          type: 'number',
          required: false,
          default: '-',
          description: '按ID过滤'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'alias',
          type: 'string',
          required: false,
          default: '-',
          description: '按别名搜索'
        },
        {
          name: 'content',
          type: 'string',
          required: false,
          default: '-',
          description: '按内容搜索'
        },
        {
          name: 'type_id',
          type: 'number',
          required: false,
          default: '-',
          description: '按类型ID过滤'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'sort',
          type: 'number',
          required: false,
          default: '-',
          description: '按排序值过滤'
        },
        {
          name: 'sort_min',
          type: 'number',
          required: false,
          default: '-',
          description: '最小排序值'
        },
        {
          name: 'sort_max',
          type: 'number',
          required: false,
          default: '-',
          description: '最大排序值'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        },
        {
          name: 'has_image',
          type: 'boolean',
          required: false,
          default: '-',
          description: '是否有图片'
        },
        {
          name: 'has_url',
          type: 'boolean',
          required: false,
          default: '-',
          description: '是否有链接'
        }
      ],
      examples: [
        {
          title: '获取全部广告',
          code: `{% Ads limit=10 %}
  {% for ad in ads %}
    <div class="ad">
      <h3>{{ ad.title }}</h3>
      {% if ad.image_url %}
        <img src="{{ ad.image_url }}" alt="{{ ad.title }}">
      {% endif %}
    </div>
  {% endfor %}
{% endAds %}`,
          description: '获取前10个广告。'
        },
        {
          title: '按标题模糊搜索广告',
          code: `{% Ads title="新品" %}
  {% for ad in ads %}
    <div class="ad">
      <h3>{{ ad.title }}</h3>
    </div>
  {% endfor %}
{% endAds %}`,
          description: '按标题模糊搜索包含"新品"的广告。'
        },
        {
          title: '分页获取广告',
          code: `{% Ads page=2 page_size=3 %}
  {% for ad in ads %}
    <div class="ad">
      <h3>{{ ad.title }}</h3>
    </div>
  {% endfor %}
  <p>当前页: {{ ads_pagination.page }}</p>
{% endAds %}`,
          description: '获取第2页，每页3条，并显示分页信息。'
        }
      ]
    },
    {
      name: 'AdItem',
      desc: '获取单个广告',
      usage: '{% AdItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '广告ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '广告标题' }
      ],
      examples: [
        {
          title: '获取广告信息',
          code: `{% AdItem id=1 %}
  <div class="ad">
    <h3>{{ ad.title }}</h3>
    {% if ad.image_url %}
      <img src="{{ ad.image_url }}" alt="{{ ad.title }}">
    {% endif %}
  </div>
{% endAdItem %}`,
          description: '获取指定广告的详细信息'
        },
        {
          title: '通过标题获取广告',
          code: `{% AdItem title="新品推荐" %}
  <div class="ad">
    <h3>{{ ad.title }}</h3>
  </div>
{% endAdItem %}`,
          description: '通过标题模糊搜索获取广告'
        }
      ]
    },
    {
      name: 'AdItems',
      desc: '获取广告项列表，支持多种查询条件',
      usage:
        '{% AdItems limit=10 page=1 page_size=10 ad_id=1 title="search" content="search" image_url="search" url="search" method="GET" status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endAdItems %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '10', description: '限制返回数量，默认10' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '10', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        {
          name: 'ad_id',
          type: 'number',
          required: false,
          default: '-',
          description: '按广告ID过滤'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'content',
          type: 'string',
          required: false,
          default: '-',
          description: '按内容搜索'
        },
        {
          name: 'image_url',
          type: 'string',
          required: false,
          default: '-',
          description: '按图片URL搜索'
        },
        {
          name: 'url',
          type: 'string',
          required: false,
          default: '-',
          description: '按链接URL搜索'
        },
        {
          name: 'method',
          type: 'string',
          required: false,
          default: '-',
          description: '按请求方法过滤'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取广告项列表',
          code: `{% AdItems limit=10 page=1 page_size=10 ad_id=1 title="search" content="search" image_url="search" url="search" method="GET" status=10 %}
  {% for adItem in adItems %}
    <div class="ad-item">
      <h4>{{ adItem.title }}</h4>
      {% if adItem.image_url %}
        <img src="{{ adItem.image_url }}" alt="{{ adItem.title }}">
      {% endif %}
    </div>
  {% endfor %}
{% endAdItems %}`,
          description: '获取广告项列表'
        }
      ]
    },
    {
      name: 'AdItemSingle',
      desc: '获取单个广告项',
      usage: '{% AdItemSingle id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '广告项ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '广告项标题' },
        { name: 'ad_id', type: 'number', required: false, default: '-', description: '所属广告ID' }
      ],
      examples: [
        {
          title: '获取广告项信息',
          code: `{% AdItemSingle id=1 %}
  <div class="ad-item">
    <h4>{{ adItem.title }}</h4>
    {% if adItem.image_url %}
      <img src="{{ adItem.image_url }}" alt="{{ adItem.title }}">
    {% endif %}
  </div>
{% endAdItemSingle %}`,
          description: '获取指定广告项的详细信息'
        },
        {
          title: '通过标题获取广告项',
          code: `{% AdItemSingle title="主推" %}
  <div class="ad-item">
    <h4>{{ adItem.title }}</h4>
  </div>
{% endAdItemSingle %}`,
          description: '通过标题模糊搜索获取广告项'
        }
      ]
    },
    {
      name: 'Votes',
      desc: '获取投票列表，支持多种查询条件',
      usage:
        '{% Votes limit=10 page=1 page_size=10 title="search" is_multiple=1 status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endVotes %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '10', description: '限制返回数量，默认10' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '10', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'is_multiple',
          type: 'number',
          required: false,
          default: '-',
          description: '是否多选（1=是，0=否）'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取投票列表',
          code: `{% Votes limit=10 page=1 page_size=10 title="search" is_multiple=1 status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}
  {% for vote in votes %}
    <div class="vote">
      <h3>{{ vote.title }}</h3>
      <p>Multiple choice: {{ vote.is_multiple ? 'Yes' : 'No' }}</p>
    </div>
  {% endfor %}
{% endVotes %}`,
          description: '获取投票列表'
        }
      ]
    },
    {
      name: 'VoteItem',
      desc: '获取单个投票',
      usage: '{% VoteItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '投票ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '投票标题' }
      ],
      examples: [
        {
          title: '获取投票信息',
          code: `{% VoteItem id=1 %}
  <div class="vote">
    <h3>{{ vote.title }}</h3>
    <p>Multiple choice: {{ vote.is_multiple ? 'Yes' : 'No' }}</p>
  </div>
{% endVoteItem %}`,
          description: '获取指定投票的详细信息'
        },
        {
          title: '通过标题获取投票',
          code: `{% VoteItem title="年度评选" %}
  <div class="vote">
    <h3>{{ vote.title }}</h3>
  </div>
{% endVoteItem %}`,
          description: '通过标题模糊搜索获取投票'
        }
      ]
    },
    {
      name: 'VoteItems',
      desc: '获取投票项列表，支持多种查询条件',
      usage:
        '{% VoteItems limit=10 page=1 page_size=10 vote_id=1 title="search" status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endVoteItems %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '10', description: '限制返回数量，默认10' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '10', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'vote_id', type: 'number', required: false, default: '-', description: '按投票ID过滤' },
        { name: 'title', type: 'string', required: false, default: '-', description: '按标题搜索' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '获取投票项列表',
          code: `{% VoteItems limit=10 page=1 page_size=10 vote_id=1 title="search" status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}
  {% for voteItem in voteItems %}
    <div class="vote-item">
      <label>
        <input type="radio" name="vote" value="{{ voteItem.id }}">
        {{ voteItem.title }}
      </label>
    </div>
  {% endfor %}
{% endVoteItems %}`,
          description: '获取投票项列表'
        }
      ]
    },
    {
      name: 'VoteItemSingle',
      desc: '获取单个投票项',
      usage: '{% VoteItemSingle id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '投票项ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '投票项标题' },
        {
          name: 'vote_id',
          type: 'number',
          required: false,
          default: '-',
          description: '所属投票ID'
        }
      ],
      examples: [
        {
          title: '获取投票项信息',
          code: `{% VoteItemSingle id=1 %}
  <div class="vote-item">
    <label>
      <input type="radio" name="vote" value="{{ voteItem.id }}">
      {{ voteItem.title }}
    </label>
  </div>
{% endVoteItemSingle %}`,
          description: '获取指定投票项的详细信息'
        },
        {
          title: '通过标题获取投票项',
          code: `{% VoteItemSingle title="选项A" %}
  <div class="vote-item">
    <label>
      <input type="radio" name="vote" value="{{ voteItem.id }}">
      {{ voteItem.title }}
    </label>
  </div>
{% endVoteItemSingle %}`,
          description: '通过标题模糊搜索获取投票项'
        }
      ]
    },
    {
      name: 'Attrs',
      desc: '获取属性列表，支持多种查询条件',
      usage:
        '{% Attrs limit=10 page=1 page_size=10 title="search" status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endAttrs %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '10',
          description: '限制返回数量，默认10'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'id',
          type: 'number',
          required: false,
          default: '-',
          description: '按ID过滤'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'alias',
          type: 'string',
          required: false,
          default: '-',
          description: '按别名搜索'
        },
        {
          name: 'sort',
          type: 'number',
          required: false,
          default: '-',
          description: '按排序值过滤'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取全部属性',
          code: `{% Attrs limit=10 %}
  {% for attr in attrs %}
    <div class="attr">
      <strong>{{ attr.title }}</strong>
    </div>
  {% endfor %}
{% endAttrs %}`,
          description: '获取前10个属性。'
        },
        {
          title: '按标题筛选属性',
          code: `{% Attrs title="颜色" %}
  {% for attr in attrs %}
    <div class="attr">
      <strong>{{ attr.title }}</strong>
    </div>
  {% endfor %}
{% endAttrs %}`,
          description: '只获取标题为"颜色"的属性。'
        }
      ]
    },
    {
      name: 'AttrItem',
      desc: '获取单个属性',
      usage: '{% AttrItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '属性ID' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '属性别名' },
        { name: 'title', type: 'string', required: false, default: '-', description: '属性标题' }
      ],
      examples: [
        {
          title: '通过ID获取属性',
          code: `{% AttrItem id=1 %}
  <div class="attr">
    <strong>{{ attr.title }}</strong>
    <span>{{ attr.value }}</span>
  </div>
{% endAttrItem %}`,
          description: '通过ID获取属性详细信息。'
        },
        {
          title: '通过标题获取属性',
          code: `{% AttrItem title="颜色" %}
  <div class="attr">
    <strong>{{ attr.title }}</strong>
  </div>
{% endAttrItem %}`,
          description: '通过标题获取属性信息。'
        }
      ]
    },
    {
      name: 'Additions',
      desc: '获取附加项列表，支持多种查询条件',
      usage: '{% Additions limit=10 page=1 page_size=10 type=1 status=10 %}...{% endAdditions %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '10',
          description: '限制返回数量，默认10'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'type',
          type: 'number',
          required: false,
          default: '-',
          description: '按类型过滤（1=必选，2=可选）'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        }
      ],
      examples: [
        {
          title: '获取全部附加项',
          code: `{% Additions limit=10 %}
  {% for addition in additions %}
    <div class="addition">
      <h4>{{ addition.name }}</h4>
      <p>{{ addition.description }}</p>
      <span>Price: {{ addition.content }}</span>
    </div>
  {% endfor %}
{% endAdditions %}`,
          description: '获取前10个附加项。'
        },
        {
          title: '按类型筛选附加项',
          code: `{% Additions type=1 %}
  {% for addition in additions %}
    <div class="addition">
      <h4>{{ addition.name }}</h4>
    </div>
  {% endfor %}
{% endAdditions %}`,
          description: '只获取类型为1的附加项。'
        }
      ]
    },
    {
      name: 'AdditionItem',
      desc: '获取单个附加项',
      usage: '{% AdditionItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '附加项ID' },
        { name: 'name', type: 'string', required: false, default: '-', description: '附加项名称' }
      ],
      examples: [
        {
          title: '通过ID获取附加项',
          code: `{% AdditionItem id=1 %}
  <div class="addition">
    <h4>{{ addition.name }}</h4>
    <p>{{ addition.description }}</p>
    <span>Price: {{ addition.content }}</span>
  </div>
{% endAdditionItem %}`,
          description: '通过ID获取附加项详细信息。'
        },
        {
          title: '通过名称获取附加项',
          code: `{% AdditionItem name="加急" %}
  <div class="addition">
    <h4>{{ addition.name }}</h4>
  </div>
{% endAdditionItem %}`,
          description: '通过名称获取附加项信息。'
        }
      ]
    },
    {
      name: 'Jobs',
      desc: '获取职位列表，支持多种查询条件',
      usage:
        '{% Jobs limit=10 page=1 page_size=10 title="search" type_name="full-time" nature="permanent" branch="HQ" address="New York" email="hr@company.com" num_min=1 num_max=10 sort_min=0 sort_max=100 create_time_start=1640995200000 create_time_end=1640995200000 has_email=true has_address=true %}...{% endJobs %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '10',
          description: '限制返回数量，默认10'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'type_name',
          type: 'string',
          required: false,
          default: '-',
          description: '按职位类型搜索'
        },
        {
          name: 'nature',
          type: 'string',
          required: false,
          default: '-',
          description: '按工作性质搜索'
        },
        {
          name: 'branch',
          type: 'string',
          required: false,
          default: '-',
          description: '按部门搜索'
        },
        {
          name: 'address',
          type: 'string',
          required: false,
          default: '-',
          description: '按地址搜索'
        },
        {
          name: 'email',
          type: 'string',
          required: false,
          default: '-',
          description: '按邮箱搜索'
        },
        {
          name: 'num_min',
          type: 'number',
          required: false,
          default: '1',
          description: '最小招聘人数'
        },
        {
          name: 'num_max',
          type: 'number',
          required: false,
          default: '10',
          description: '最大招聘人数'
        },
        {
          name: 'sort_min',
          type: 'number',
          required: false,
          default: '0',
          description: '最小排序值'
        },
        {
          name: 'sort_max',
          type: 'number',
          required: false,
          default: '100',
          description: '最大排序值'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        },
        {
          name: 'has_email',
          type: 'boolean',
          required: false,
          default: '-',
          description: '是否有邮箱'
        },
        {
          name: 'has_address',
          type: 'boolean',
          required: false,
          default: '-',
          description: '是否有地址'
        }
      ],
      examples: [
        {
          title: '获取全部职位',
          code: `{% Jobs limit=10 %}
  {% for job in jobs %}
    <div class="job">
      <h3>{{ job.title }}</h3>
      <p>{{ job.content }}</p>
      <p>Location: {{ job.address }}</p>
      <p>Openings: {{ job.num }}</p>
    </div>
  {% endfor %}
{% endJobs %}`,
          description: '获取前10个职位。'
        },
        {
          title: '按标题模糊搜索职位',
          code: `{% Jobs title="工程师" %}
  {% for job in jobs %}
    <div class="job">
      <h3>{{ job.title }}</h3>
    </div>
  {% endfor %}
{% endJobs %}`,
          description: '按标题模糊搜索包含"工程师"的职位。'
        },
        {
          title: '分页获取职位',
          code: `{% Jobs page=2 page_size=5 %}
  {% for job in jobs %}
    <div class="job">
      <h3>{{ job.title }}</h3>
    </div>
  {% endfor %}
  <p>当前页: {{ jobs_pagination.page }}</p>
{% endJobs %}`,
          description: '获取第2页，每页5条，并显示分页信息。'
        }
      ]
    },
    {
      name: 'JobItem',
      desc: '获取单个职位',
      usage: '{% JobItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '职位ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '职位标题' }
      ],
      examples: [
        {
          title: '获取职位信息',
          code: `{% JobItem id=1 %}
  <div class="job">
    <h3>{{ job.title }}</h3>
    <p>{{ job.content }}</p>
    <p>Location: {{ job.address }}</p>
    <p>Openings: {{ job.num }}</p>
  </div>
{% endJobItem %}`,
          description: '获取指定职位的详细信息'
        }
      ]
    },
    {
      name: 'Holidays',
      desc: '获取节假日列表，支持多种查询条件',
      usage:
        '{% Holidays limit=10 page=1 page_size=10 title="search" value="2024-01-01" create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endHolidays %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '10',
          description: '限制返回数量，默认10'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'value',
          type: 'string',
          required: false,
          default: '-',
          description: '按日期值搜索'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取全部节假日',
          code: `{% Holidays limit=10 %}
  {% for holiday in holidays %}
    <div class="holiday">
      <span>{{ holiday.title }}</span>
      <span>{{ holiday.value }}</span>
    </div>
  {% endfor %}
{% endHolidays %}`,
          description: '获取前10个节假日。'
        },
        {
          title: '按标题筛选节假日',
          code: `{% Holidays title="国庆" %}
  {% for holiday in holidays %}
    <div class="holiday">
      <span>{{ holiday.title }}</span>
    </div>
  {% endfor %}
{% endHolidays %}`,
          description: '只获取标题为"国庆"的节假日。'
        }
      ]
    },
    {
      name: 'HolidayItem',
      desc: '获取单个节假日',
      usage: '{% HolidayItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '节假日ID' },
        { name: 'name', type: 'string', required: false, default: '-', description: '节假日名称' },
        {
          name: 'value',
          type: 'string',
          required: false,
          default: '-',
          description: '节假日日期值'
        }
      ],
      examples: [
        {
          title: '通过ID获取节假日',
          code: `{% HolidayItem id=1 %}
  <div class="holiday">
    <span>{{ holiday.title }}</span>
    <span>{{ holiday.value }}</span>
  </div>
{% endHolidayItem %}`,
          description: '通过ID获取节假日详细信息。'
        },
        {
          title: '通过名称获取节假日',
          code: `{% HolidayItem name="国庆节" %}
  <div class="holiday">
    <span>{{ holiday.title }}</span>
  </div>
{% endHolidayItem %}`,
          description: '通过名称获取节假日信息。'
        }
      ]
    },
    {
      name: 'UserTypes',
      desc: '获取用户类型列表，支持多种查询条件',
      usage:
        '{% UserTypes limit=10 page=1 page_size=10 type_name="search" alias="search" status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endUserTypes %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '10',
          description: '限制返回数量，默认10'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'type_name',
          type: 'string',
          required: false,
          default: '-',
          description: '按类型名称搜索'
        },
        {
          name: 'alias',
          type: 'string',
          required: false,
          default: '-',
          description: '按别名搜索'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取全部用户类型',
          code: `{% UserTypes limit=10 %}
  {% for userType in userTypes %}
    <div class="user-type">
      <h4>{{ userType.type_name }}</h4>
      <p>{{ userType.remark }}</p>
    </div>
  {% endfor %}
{% endUserTypes %}`,
          description: '获取前10个用户类型。'
        }
      ]
    },
    {
      name: 'UserTypeItem',
      desc: '获取单个用户类型',
      usage: '{% UserTypeItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '用户类型ID' },
        {
          name: 'type_name',
          type: 'string',
          required: false,
          default: '-',
          description: '类型名称'
        },
        { name: 'alias', type: 'string', required: false, default: '-', description: '类型别名' }
      ],
      examples: [
        {
          title: '通过ID获取用户类型',
          code: `{% UserTypeItem id=1 %}
  <div class="user-type">
    <h4>{{ userType.type_name }}</h4>
    <p>{{ userType.remark }}</p>
  </div>
{% endUserTypeItem %}`,
          description: '通过ID获取用户类型详细信息。'
        },
        {
          title: '通过类型名称获取用户类型',
          code: `{% UserTypeItem type_name="管理员" %}
  <div class="user-type">
    <h4>{{ userType.type_name }}</h4>
  </div>
{% endUserTypeItem %}`,
          description: '通过类型名称获取用户类型信息。'
        }
      ]
    },
    {
      name: 'Rules',
      desc: '获取规则列表，支持多种查询条件；tree=true 时返回树形结构',
      usage:
        '{% Rules limit=10 page=1 page_size=10 title="search" alias="search" module_id=1 parent_id=0 type_id=1 status=10 tree=false %}...{% endRules %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '10', description: '限制返回数量，默认10' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '10', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'title', type: 'string', required: false, default: '-', description: '按标题搜索' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '按别名搜索' },
        { name: 'condition', type: 'string', required: false, default: '-', description: '按条件搜索' },
        { name: 'des', type: 'string', required: false, default: '-', description: '按描述搜索' },
        { name: 'icon', type: 'string', required: false, default: '-', description: '按图标搜索' },
        { name: 'module_id', type: 'number', required: false, default: '-', description: '按模块ID过滤' },
        { name: 'parent_id', type: 'number', required: false, default: '0', description: '按父规则ID过滤' },
        { name: 'sort', type: 'number', required: false, default: '-', description: '按排序值过滤' },
        { name: 'type_id', type: 'number', required: false, default: '-', description: '按类型ID过滤' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'tree', type: 'boolean', required: false, default: 'false', description: '是否返回树形结构' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '获取全部规则',
          code: `{% Rules limit=10 %}
  {% for rule in rules %}
    <div class="rule">
      <h4>{{ rule.title }}</h4>
      <p>{{ rule.des }}</p>
    </div>
  {% endfor %}
{% endRules %}`,
          description: '获取前10个规则。'
        },
        {
          title: '获取树形规则结构',
          code: `{% Rules tree=true %}
  {% for rule in rules %}
    <div class="rule-tree">
      <h4>{{ rule.title }}</h4>
      {% if rule.children %}
        {% for child in rule.children %}
          <div class="rule-child">{{ child.title }}</div>
        {% endfor %}
      {% endif %}
    </div>
  {% endfor %}
{% endRules %}`,
          description: '获取树形结构的规则列表。'
        }
      ]
    },
    {
      name: 'RuleItem',
      desc: '获取单个规则',
      usage: '{% RuleItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '规则ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '规则标题' },
        { name: 'alias', type: 'string', required: false, default: '-', description: '规则别名' }
      ],
      examples: [
        {
          title: '通过ID获取规则',
          code: `{% RuleItem id=1 %}
  <div class="rule">
    <h4>{{ rule.title }}</h4>
    <p>{{ rule.des }}</p>
  </div>
{% endRuleItem %}`,
          description: '通过ID获取规则详细信息。'
        },
        {
          title: '通过别名获取规则',
          code: `{% RuleItem alias="user_manage" %}
  <div class="rule">
    <h4>{{ rule.title }}</h4>
  </div>
{% endRuleItem %}`,
          description: '通过别名获取规则信息。'
        }
      ]
    },
    {
      name: 'Users',
      desc: '获取用户列表，支持多种查询条件',
      usage:
        '{% Users limit=20 page=1 page_size=10 user_name="search" email="search" type_id=1 status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endUsers %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '20', description: '限制返回数量，默认20' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '10', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'user_name', type: 'string', required: false, default: '-', description: '按用户名搜索' },
        { name: 'email', type: 'string', required: false, default: '-', description: '按邮箱搜索' },
        { name: 'phone', type: 'string', required: false, default: '-', description: '按手机号搜索' },
        { name: 'real_name', type: 'string', required: false, default: '-', description: '按真实姓名搜索' },
        { name: 'nick_name', type: 'string', required: false, default: '-', description: '按昵称搜索' },
        { name: 'avatar_url', type: 'string', required: false, default: '-', description: '按头像URL搜索' },
        { name: 'role_id', type: 'number', required: false, default: '-', description: '按角色ID过滤' },
        { name: 'type_id', type: 'number', required: false, default: '-', description: '按用户类型过滤' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'is_admin', type: 'number', required: false, default: '-', description: '是否为管理员' },
        { name: 'is_super_admin', type: 'number', required: false, default: '-', description: '是否为超级管理员' },
        { name: 'is_black', type: 'number', required: false, default: '-', description: '是否被拉黑' },
        { name: 'last_login_ip', type: 'string', required: false, default: '-', description: '按最后登录IP搜索' },
        { name: 'last_login_time', type: 'number', required: false, default: '-', description: '按最后登录时间过滤' },
        { name: 'last_login_start', type: 'number', required: false, default: '-', description: '最后登录时间开始时间戳' },
        { name: 'last_login_end', type: 'number', required: false, default: '-', description: '最后登录时间结束时间戳' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '获取全部用户',
          code: `{% Users limit=20 %}
  {% for user in users %}
    <div class="user">
      <h4>{{ user.user_name }}</h4>
      <p>{{ user.email }}</p>
    </div>
  {% endfor %}
{% endUsers %}`,
          description: '获取前20个用户（user_name 为数据库字段）'
        },
        {
          title: '按用户名搜索',
          code: `{% Users user_name="admin" %}
  {% for user in users %}
    <div class="user">
      <h4>{{ user.user_name }}</h4>
      <p>{{ user.email }}</p>
    </div>
  {% endfor %}
{% endUsers %}`,
          description: '按用户名模糊搜索用户'
        },
        {
          title: '按邮箱搜索',
          code: `{% Users email="example.com" %}
  {% for user in users %}
    <div class="user">
      <h4>{{ user.user_name }}</h4>
      <p>{{ user.email }}</p>
    </div>
  {% endfor %}
{% endUsers %}`,
          description: '按邮箱模糊搜索用户'
        },
        {
          title: '按用户类型筛选',
          code: `{% Users type_id=1 limit=10 %}
  {% for user in users %}
    <div class="user">
      <h4>{{ user.user_name }}</h4>
      <p>Type: {{ user.type_name }}</p>
    </div>
  {% endfor %}
{% endUsers %}`,
          description: '获取指定类型的用户'
        },
        {
          title: '分页获取用户',
          code: `{% Users page=2 page_size=5 %}
  {% for user in users %}
    <div class="user">
      <h4>{{ user.user_name }}</h4>
    </div>
  {% endfor %}
  <p>当前页: {{ users_pagination.page }}</p>
{% endUsers %}`,
          description: '获取第2页，每页5条，并显示分页信息'
        },
        {
          title: '按时间范围筛选',
          code: `{% Users create_time_start=1704067200000 create_time_end=1706745600000 %}
  {% for user in users %}
    <div class="user">
      <h4>{{ user.user_name }}</h4>
      <p>注册时间: {{ user.create_time | date('YYYY-MM-DD') }}</p>
    </div>
  {% endfor %}
{% endUsers %}`,
          description: '获取指定时间段内注册的用户'
        }
      ]
    },
    {
      name: 'UserItem',
      desc: '获取单个用户',
      usage: '{% UserItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '用户ID' },
        { name: 'user_name', type: 'string', required: false, default: '-', description: '用户名' },
        { name: 'email', type: 'string', required: false, default: '-', description: '邮箱' }
      ],
      examples: [
        {
          title: '通过ID获取用户',
          code: `{% UserItem id=1 %}
  <div class="user">
    <h4>{{ user.user_name }}</h4>
    <p>{{ user.email }}</p>
  </div>
{% endUserItem %}`,
          description: '通过用户ID获取用户详细信息（user_name 为数据库字段）'
        },
        {
          title: '通过用户名获取用户',
          code: `{% UserItem user_name="admin" %}
  <div class="user">
    <h4>{{ user.user_name }}</h4>
    <p>{{ user.email }}</p>
  </div>
{% endUserItem %}`,
          description: '通过用户名获取用户信息'
        },
        {
          title: '通过邮箱获取用户',
          code: `{% UserItem email="admin@example.com" %}
  <div class="user">
    <h4>{{ user.user_name }}</h4>
    <p>{{ user.email }}</p>
  </div>
{% endUserItem %}`,
          description: '通过邮箱获取用户信息'
        }
      ]
    },
    {
      name: 'Tags',
      desc: '获取标签列表，支持多种查询条件',
      usage:
        '{% Tags limit=50 page=1 page_size=20 title="search" type_id=0 value="slug" status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endTags %}',
      parameters: [
        { name: 'limit', type: 'number', required: false, default: '50', description: '限制返回数量，默认50' },
        { name: 'page', type: 'number', required: false, default: '1', description: '页码，默认1' },
        { name: 'page_size', type: 'number', required: false, default: '20', description: '每页数量，默认等于limit' },
        { name: 'id', type: 'number', required: false, default: '-', description: '按ID过滤' },
        { name: 'title', type: 'string', required: false, default: '-', description: '按标题搜索' },
        { name: 'des', type: 'string', required: false, default: '-', description: '按描述搜索' },
        { name: 'sort', type: 'number', required: false, default: '-', description: '按排序值过滤' },
        { name: 'type_id', type: 'number', required: false, default: '-', description: '按类型ID过滤' },
        { name: 'value', type: 'string', required: false, default: '-', description: '按值搜索' },
        { name: 'status', type: 'number', required: false, default: '10', description: '按状态过滤' },
        { name: 'create_time_start', type: 'number', required: false, default: '-', description: '创建时间开始时间戳' },
        { name: 'create_time_end', type: 'number', required: false, default: '-', description: '创建时间结束时间戳' },
        { name: 'update_time_start', type: 'number', required: false, default: '-', description: '更新时间开始时间戳' },
        { name: 'update_time_end', type: 'number', required: false, default: '-', description: '更新时间结束时间戳' }
      ],
      examples: [
        {
          title: '获取全部标签',
          code: `{% Tags limit=50 %}
  {% for tag in tags %}
    <span class="tag">{{ tag.title }}</span>
  {% endfor %}
{% endTags %}`,
          description: '获取前50个标签。'
        },
        {
          title: '按标题搜索标签',
          code: `{% Tags title="技术" %}
  {% for tag in tags %}
    <span class="tag">{{ tag.title }}</span>
  {% endfor %}
{% endTags %}`,
          description: '按标题模糊搜索标签'
        },
        {
          title: '分页获取标签',
          code: `{% Tags page=2 page_size=10 %}
  {% for tag in tags %}
    <span class="tag">{{ tag.title }}</span>
  {% endfor %}
  <p>当前页: {{ tags_pagination.page }}</p>
{% endTags %}`,
          description: '获取第2页，每页10条，并显示分页信息。'
        }
      ]
    },
    {
      name: 'TagItem',
      desc: '获取单个标签',
      usage: '{% TagItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '标签ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '标签标题' },
        { name: 'value', type: 'string', required: false, default: '-', description: '标签值（用于 URL 等）' }
      ],
      examples: [
        {
          title: '通过ID获取标签',
          code: `{% TagItem id=1 %}
  <span class="tag">{{ tag.title }}</span>
  <p>{{ tag.des }}</p>
{% endTagItem %}`,
          description: '通过标签ID获取标签详细信息（des 为描述）'
        },
        {
          title: '通过标题获取标签',
          code: `{% TagItem title="技术" %}
  <span class="tag">{{ tag.title }}</span>
{% endTagItem %}`,
          description: '通过标题获取标签信息'
        }
      ]
    },
    {
      name: 'Comments',
      desc: '获取评论列表，支持多种查询条件',
      usage:
        '{% Comments limit=20 page=1 page_size=10 content="search" article_id=1 user_id=1 status=10 create_time_start=1640995200000 create_time_end=1640995200000 %}...{% endComments %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '20',
          description: '限制返回数量，默认20'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'id',
          type: 'number',
          required: false,
          default: '-',
          description: '按ID过滤'
        },
        {
          name: 'content',
          type: 'string',
          required: false,
          default: '-',
          description: '按内容搜索'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按评论标题搜索'
        },
        {
          name: 'article_id',
          type: 'number',
          required: false,
          default: '-',
          description: '按文章ID过滤'
        },
        {
          name: 'user_id',
          type: 'number',
          required: false,
          default: '-',
          description: '按用户ID过滤'
        },
        {
          name: 'good_article',
          type: 'number',
          required: false,
          default: '-',
          description: '按好评过滤'
        },
        {
          name: 'bad_article',
          type: 'number',
          required: false,
          default: '-',
          description: '按差评过滤'
        },
        {
          name: 'not_article',
          type: 'number',
          required: false,
          default: '-',
          description: '按不相关过滤'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取全部评论',
          code: `{% Comments limit=20 %}
  {% for comment in comments %}
    <div class="comment">
      <p>{{ comment.content }}</p>
      <small>By: {{ comment.user_name }}</small>
    </div>
  {% endfor %}
{% endComments %}`,
          description: '获取前20条评论'
        },
        {
          title: '按文章获取评论',
          code: `{% Comments article_id=1 limit=10 %}
  {% for comment in comments %}
    <div class="comment">
      <p>{{ comment.content }}</p>
      <small>By: {{ comment.user_name }}</small>
    </div>
  {% endfor %}
{% endComments %}`,
          description: '获取指定文章的评论'
        },
        {
          title: '按用户获取评论',
          code: `{% Comments user_id=1 limit=10 %}
  {% for comment in comments %}
    <div class="comment">
      <p>{{ comment.content }}</p>
      <small>On: {{ comment.article_title }}</small>
    </div>
  {% endfor %}
{% endComments %}`,
          description: '获取指定用户的评论'
        }
      ]
    },
    {
      name: 'CommentItem',
      desc: '获取单个评论',
      usage: '{% CommentItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '评论ID' }
      ],
      examples: [
        {
          title: '通过ID获取评论',
          code: `{% CommentItem id=1 %}
  <div class="comment">
    <p>{{ comment.content }}</p>
    <small>By: {{ comment.user_name }}</small>
  </div>
{% endCommentItem %}`,
          description: '通过评论ID获取评论详细信息'
        }
      ]
    },
    {
      name: 'Links',
      desc: '获取链接列表，支持多种查询条件',
      usage:
        '{% Links limit=20 page=1 page_size=10 title="search" url="search" status=10 create_time_start=1640995200000 create_time_end=1649952000000 %}...{% endLinks %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '20',
          description: '限制返回数量，默认20'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'id',
          type: 'number',
          required: false,
          default: '-',
          description: '按ID过滤'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'url',
          type: 'string',
          required: false,
          default: '-',
          description: '按URL搜索'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取全部链接',
          code: `{% Links limit=20 %}
  {% for link in links %}
    <a href="{{ link.url }}">{{ link.title }}</a>
  {% endfor %}
{% endLinks %}`,
          description: '获取前20个链接'
        },
        {
          title: '按标题搜索链接',
          code: `{% Links title="友情链接" %}
  {% for link in links %}
    <a href="{{ link.url }}">{{ link.title }}</a>
  {% endfor %}
{% endLinks %}`,
          description: '按标题模糊搜索链接'
        }
      ]
    },
    {
      name: 'LinkItem',
      desc: '获取单个链接',
      usage: '{% LinkItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '链接ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '链接标题' },
        { name: 'url', type: 'string', required: false, default: '-', description: '链接URL' }
      ],
      examples: [
        {
          title: '通过ID获取链接',
          code: `{% LinkItem id=1 %}
  <a href="{{ link.url }}">{{ link.title }}</a>
  <p>{{ link.description }}</p>
{% endLinkItem %}`,
          description: '通过链接ID获取链接详细信息'
        },
        {
          title: '通过标题获取链接',
          code: `{% LinkItem title="首页" %}
  <a href="{{ link.url }}">{{ link.title }}</a>
{% endLinkItem %}`,
          description: '通过标题获取链接信息'
        }
      ]
    },
    {
      name: 'Menus',
      desc: '获取菜单列表，支持多种查询条件',
      usage:
        '{% Menus limit=20 page=1 page_size=10 title="search" parent_id=0 status=10 create_time_start=1640995200000 create_time_end=1649952000000 %}...{% endMenus %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '20',
          description: '限制返回数量，默认20'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '10',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'id',
          type: 'number',
          required: false,
          default: '-',
          description: '按ID过滤'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'alias',
          type: 'string',
          required: false,
          default: '-',
          description: '按别名搜索'
        },
        {
          name: 'parent_id',
          type: 'number',
          required: false,
          default: '0',
          description: '父菜单ID，0表示顶级菜单'
        },
        {
          name: 'icon',
          type: 'string',
          required: false,
          default: '-',
          description: '按图标搜索'
        },
        {
          name: 'url',
          type: 'string',
          required: false,
          default: '-',
          description: '按URL搜索'
        },
        {
          name: 'image_url',
          type: 'string',
          required: false,
          default: '-',
          description: '按图片URL搜索'
        },
        {
          name: 'method',
          type: 'string',
          required: false,
          default: '-',
          description: '按请求方法搜索'
        },
        {
          name: 'sort',
          type: 'number',
          required: false,
          default: '-',
          description: '按排序值过滤'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取全部菜单',
          code: `{% Menus limit=20 %}
  {% for menu in menus %}
    <li><a href="{{ menu.url }}">{{ menu.title }}</a></li>
  {% endfor %}
{% endMenus %}`,
          description: '获取前20个菜单项'
        },
        {
          title: '获取顶级菜单',
          code: `{% Menus parent_id=0 %}
  {% for menu in menus %}
    <li><a href="{{ menu.url }}">{{ menu.title }}</a></li>
  {% endfor %}
{% endMenus %}`,
          description: '获取顶级菜单项'
        }
      ]
    },
    {
      name: 'MenuItem',
      desc: '获取单个菜单',
      usage: '{% MenuItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '菜单ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '菜单标题' }
      ],
      examples: [
        {
          title: '通过ID获取菜单',
          code: `{% MenuItem id=1 %}
  <li><a href="{{ menu.url }}">{{ menu.title }}</a></li>
{% endMenuItem %}`,
          description: '通过菜单ID获取菜单详细信息'
        },
        {
          title: '通过标题获取菜单',
          code: `{% MenuItem title="首页" %}
  <li><a href="{{ menu.url }}">{{ menu.title }}</a></li>
{% endMenuItem %}`,
          description: '通过标题获取菜单信息'
        }
      ]
    },
    {
      name: 'Notices',
      desc: '获取公告列表，支持多种查询条件',
      usage:
        '{% Notices limit=10 page=1 page_size=5 title="search" content="search" status=10 create_time_start=1640995200000 create_time_end=1649952000000 %}...{% endNotices %}',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          default: '10',
          description: '限制返回数量，默认10'
        },
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码，默认1'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          default: '5',
          description: '每页数量，默认等于limit'
        },
        {
          name: 'id',
          type: 'number',
          required: false,
          default: '-',
          description: '按ID过滤'
        },
        {
          name: 'title',
          type: 'string',
          required: false,
          default: '-',
          description: '按标题搜索'
        },
        {
          name: 'content',
          type: 'string',
          required: false,
          default: '-',
          description: '按内容搜索'
        },
        {
          name: 'from_user_id',
          type: 'number',
          required: false,
          default: '-',
          description: '按发送用户ID过滤'
        },
        {
          name: 'publish_time',
          type: 'number',
          required: false,
          default: '-',
          description: '按发布时间过滤'
        },
        {
          name: 'tolds',
          type: 'string',
          required: false,
          default: '-',
          description: '按接收者搜索'
        },
        {
          name: 'status',
          type: 'number',
          required: false,
          default: '10',
          description: '按状态过滤'
        },
        {
          name: 'create_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间开始时间戳'
        },
        {
          name: 'create_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '创建时间结束时间戳'
        },
        {
          name: 'update_time_start',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间开始时间戳'
        },
        {
          name: 'update_time_end',
          type: 'number',
          required: false,
          default: '-',
          description: '更新时间结束时间戳'
        }
      ],
      examples: [
        {
          title: '获取全部公告',
          code: `{% Notices limit=10 %}
  {% for notice in notices %}
    <div class="notice">
      <h3>{{ notice.title }}</h3>
      <p>{{ notice.content }}</p>
    </div>
  {% endfor %}
{% endNotices %}`,
          description: '获取前10个公告'
        },
        {
          title: '按标题搜索公告',
          code: `{% Notices title="重要" %}
  {% for notice in notices %}
    <div class="notice">
      <h3>{{ notice.title }}</h3>
    </div>
  {% endfor %}
{% endNotices %}`,
          description: '按标题模糊搜索公告'
        }
      ]
    },
    {
      name: 'NoticeItem',
      desc: '获取单个公告',
      usage: '{% NoticeItem id=1 %}',
      parameters: [
        { name: 'id', type: 'number', required: true, default: '-', description: '公告ID' },
        { name: 'title', type: 'string', required: false, default: '-', description: '公告标题' }
      ],
      examples: [
        {
          title: '通过ID获取公告',
          code: `{% NoticeItem id=1 %}
  <div class="notice">
    <h3>{{ notice.title }}</h3>
    <p>{{ notice.content }}</p>
  </div>
{% endNoticeItem %}`,
          description: '通过公告ID获取公告详细信息'
        },
        {
          title: '通过标题获取公告',
          code: `{% NoticeItem title="系统维护" %}
  <div class="notice">
    <h3>{{ notice.title }}</h3>
  </div>
{% endNoticeItem %}`,
          description: '通过标题获取公告信息'
        }
      ]
    }
  ]
  filters = [
    { name: 'date', desc: '日期格式化', usage: `{{ value | date('YYYY-MM-DD') }}` },
    { name: 'shorten', desc: '字符串截断', usage: `{{ value | shorten(10) }}` },
    { name: 'stripHtml', desc: '去除HTML标签', usage: `{{ value | stripHtml }}` },
    { name: 'truncate', desc: '字符串省略', usage: `{{ value | truncate(100) }}` },
    { name: 'symbolsCount', desc: '统计字符数', usage: `{{ value | symbolsCount }}` },
    { name: 'titleToUrl', desc: '标题转URL', usage: `{{ value | titleToUrl }}` },
    { name: 'console', desc: '控制台输出', usage: `{{ value | console('name') }}` }
  ]
  functions = [
    { name: 'dateFormat', desc: '日期格式化函数', usage: `{{ dateFormat(value, 'YYYY-MM-DD') }}` },
    { name: 'getColor', desc: '获取颜色', usage: `{{ getColor(l, c, h) }}` }
  ]
}
