import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { TabViewModule } from 'primeng/tabview'
import { TableModule } from 'primeng/table'

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CardModule, TabViewModule, TableModule],
  template: `
    <div
      class="grid gap-8 bg-gradient-to-br from-[var(--p-surface-ground)] to-[var(--p-surface-section)] min-h-[80vh]"
    >
      <p-card header="Nunjucks 模版扩展" styleClass="system-card">
        <p-tabView>
          <p-tabPanel header="自定义标签">
            <p-table [value]="tags" styleClass="p-datatable-sm beautify-table">
              <ng-template pTemplate="header">
                <tr>
                  <th>标签名</th>
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
          </p-tabPanel>
          <p-tabPanel header="过滤器">
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
          </p-tabPanel>
          <p-tabPanel header="全局方法">
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
          </p-tabPanel>
        </p-tabView>
      </p-card>
    </div>
  `,
  styles: [
    `
      .system-card {
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
        color: #fff;
      }
      .bg-gradient-to-br {
        background: var(--p-content-background) !important;
      }
    `
  ]
})
export class TemplatesPage {
  tags = [
    { name: 'Articles', desc: '文章列表', usage: '{% Articles limit=10 %}...{% endArticles %}' },
    { name: 'ArticleItem', desc: '单个文章', usage: '{% ArticleItem id=1 %}' },
    {
      name: 'Categories',
      desc: '分类列表',
      usage: '{% Categories limit=10 %}...{% endCategories %}'
    },
    { name: 'CategoryItem', desc: '单个分类', usage: '{% CategoryItem id=1 %}' },
    { name: 'Tags', desc: '标签列表', usage: '{% Tags limit=10 %}...{% endTags %}' },
    { name: 'TagItem', desc: '单个标签', usage: '{% TagItem id=1 %}' },
    { name: 'Users', desc: '用户列表', usage: '{% Users limit=10 %}...{% endUsers %}' },
    { name: 'UserItem', desc: '单个用户', usage: '{% UserItem id=1 %}' },
    { name: 'Pages', desc: '页面列表', usage: '{% Pages limit=10 %}...{% endPages %}' },
    { name: 'PageItem', desc: '单个页面', usage: '{% PageItem id=1 %}' },
    { name: 'Roles', desc: '角色列表', usage: '{% Roles limit=10 %}...{% endRoles %}' },
    { name: 'RoleItem', desc: '单个角色', usage: '{% RoleItem id=1 %}' },
    { name: 'Enums', desc: '枚举列表', usage: '{% Enums limit=10 %}...{% endEnums %}' },
    { name: 'EnumItem', desc: '单个枚举', usage: '{% EnumItem id=1 %}' },
    { name: 'Notices', desc: '通知列表', usage: '{% Notices limit=10 %}...{% endNotices %}' },
    { name: 'NoticeItem', desc: '单个通知', usage: '{% NoticeItem id=1 %}' },
    { name: 'Comments', desc: '评论列表', usage: '{% Comments limit=10 %}...{% endComments %}' },
    { name: 'CommentItem', desc: '单个评论', usage: '{% CommentItem id=1 %}' },
    { name: 'Links', desc: '友链列表', usage: '{% Links limit=10 %}...{% endLinks %}' },
    { name: 'LinkItem', desc: '单个友链', usage: '{% LinkItem id=1 %}' },
    { name: 'Jobs', desc: '职位列表', usage: '{% Jobs limit=10 %}...{% endJobs %}' },
    { name: 'JobItem', desc: '单个职位', usage: '{% JobItem id=1 %}' },
    { name: 'Votes', desc: '投票列表', usage: '{% Votes limit=10 %}...{% endVotes %}' },
    { name: 'VoteItem', desc: '单个投票', usage: '{% VoteItem id=1 %}' },
    {
      name: 'VoteItems',
      desc: '投票项列表',
      usage: '{% VoteItems limit=10 %}...{% endVoteItems %}'
    },
    { name: 'VoteItemSingle', desc: '单个投票项', usage: '{% VoteItemSingle id=1 %}' },
    {
      name: 'Additions',
      desc: '附加信息列表',
      usage: '{% Additions limit=10 %}...{% endAdditions %}'
    },
    { name: 'AdditionItem', desc: '单个附加信息', usage: '{% AdditionItem id=1 %}' },
    { name: 'Attrs', desc: '属性列表', usage: '{% Attrs limit=10 %}...{% endAttrs %}' },
    { name: 'AttrItem', desc: '单个属性', usage: '{% AttrItem id=1 %}' },
    {
      name: 'UserTypes',
      desc: '用户类型列表',
      usage: '{% UserTypes limit=10 %}...{% endUserTypes %}'
    },
    { name: 'UserTypeItem', desc: '单个用户类型', usage: '{% UserTypeItem id=1 %}' },
    { name: 'Menus', desc: '菜单列表', usage: '{% Menus limit=10 %}...{% endMenus %}' },
    { name: 'Configs', desc: '配置列表', usage: '{% Config limit=10 %}...{% endConfig %}' },
    { name: 'ConfigItem', desc: '单个配置项', usage: '{% ConfigItem id=1 %}' },
    { name: 'Ads', desc: '广告列表', usage: '{% Ads limit=10 %}...{% endAds %}' },
    { name: 'AdItem', desc: '单个广告', usage: '{% AdItem id=1 %}' },
    { name: 'AdItems', desc: '广告项列表', usage: '{% AdItems limit=10 %}...{% endAdItems %}' },
    { name: 'AdItemSingle', desc: '单个广告项', usage: '{% AdItemSingle id=1 %}' },
    { name: 'Rules', desc: '规则列表', usage: '{% Rules limit=10 %}...{% endRules %}' },
    { name: 'RuleItem', desc: '单个规则', usage: '{% RuleItem id=1 %}' },
    { name: 'Holidays', desc: '节假日列表', usage: '{% Holidays limit=10 %}...{% endHolidays %}' },
    { name: 'HolidayItem', desc: '单个节假日', usage: '{% HolidayItem id=1 %}' },
    { name: 'Keywords', desc: '关键词列表', usage: '{% Keywords limit=10 %}...{% endKeywords %}' },
    { name: 'KeywordItem', desc: '单个关键词', usage: '{% KeywordItem id=1 %}' }
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
