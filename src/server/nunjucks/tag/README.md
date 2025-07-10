# Nunjucks 标签使用指南

本项目为各种数据模型提供了 Nunjucks 自定义标签，用于在模板中方便地获取和显示数据。

## 标签列表

### 配置相关

- `Config` / `ConfigItem` - 系统配置
- `Enums` / `EnumItem` - 枚举数据

### 内容相关

- `Articles` / `ArticleItem` - 文章
- `Pages` / `PageItem` - 页面
- `Comments` / `CommentItem` - 评论
- `Categories` / `CategoryItem` - 分类
- `Tags` / `TagItem` - 标签
- `Keywords` / `KeywordItem` - 关键词

### 链接和广告

- `Links` / `LinkItem` - 友情链接
- `Ads` / `AdItem` - 广告
- `AdItems` / `AdItemSingle` - 广告项

### 系统功能

- `Menus` / `MenuItem` - 菜单
- `Notices` / `NoticeItem` - 通知
- `Jobs` / `JobItem` - 职位
- `Attrs` / `AttrItem` - 属性
- `Additions` / `AdditionItem` - 附加项
- `Holidays` / `HolidayItem` - 节假日

### 用户和权限

- `Users` / `UserItem` - 用户
- `UserTypes` / `UserTypeItem` - 用户类型
- `Roles` / `RoleItem` - 角色
- `Rules` / `RuleItem` - 权限规则

### 投票功能

- `Votes` / `VoteItem` - 投票
- `VoteItems` / `VoteItemSingle` - 投票项

## 使用方法

### 1. 列表标签使用

```njk
<!-- 获取文章列表 -->
{% Articles limit=5, status=20 %}
  {% for article in articles %}
    <h3>{{ article.title }}</h3>
    <p>{{ article.summary }}</p>
  {% endfor %}
{% endArticles %}

<!-- 获取指定分类的文章 -->
{% Articles type_id=1, limit=10 %}
  {% for article in articles %}
    <div class="article-item">
      <h2>{{ article.title }}</h2>
      <div class="content">{{ article.content | stripHtml | truncate(200) }}</div>
    </div>
  {% endfor %}
{% endArticles %}

<!-- 获取友情链接 -->
{% Links type_id=1 %}
  {% for link in links %}
    <a href="{{ link.url }}" target="_blank">{{ link.site_name }}</a>
  {% endfor %}
{% endLinks %}

<!-- 获取菜单树 -->
{% Menus tree=true %}
  {% for menu in menus %}
    <li>
      <a href="{{ menu.url }}">{{ menu.title }}</a>
      {% if menu.children %}
        <ul>
          {% for child in menu.children %}
            <li><a href="{{ child.url }}">{{ child.title }}</a></li>
          {% endfor %}
        </ul>
      {% endif %}
    </li>
  {% endfor %}
{% endMenus %}
```

### 2. 单项标签使用

```njk
<!-- 获取单个文章 -->
{% ArticleItem id=1 %}
<!-- 返回 JSON 字符串，需要解析 -->

<!-- 获取单个页面 -->
{% PageItem alias="about" %}
<!-- 通过别名获取页面 -->

<!-- 获取单个配置项 -->
{% ConfigItem alias="site_name" %}
<!-- 获取站点名称配置 -->
```

### 3. 常用参数说明

#### 通用参数

- `limit` - 限制返回数量，默认 10
- `status` - 状态筛选，通常 10=激活，0=禁用
- `id` - 获取指定 ID 的项目

#### 特定参数

- `type_id` - 按类型/分类筛选
- `alias` - 按别名获取
- `search` - 搜索关键词
- `tree` - 是否返回树形结构（菜单、分类）
- `active` - 是否只获取激活状态的项目
- `with_items` - 是否包含子项（如广告包含广告项）

### 4. 实际应用示例

```njk
<!-- 网站头部导航 -->
<nav>
  {% Menus tree=true %}
    {% for menu in menus %}
      <a href="{{ menu.url }}" class="nav-item">{{ menu.title }}</a>
    {% endfor %}
  {% endMenus %}
</nav>

<!-- 首页文章列表 -->
<div class="article-list">
  {% Articles status=20, limit=8 %}
    {% for article in articles %}
      <article class="article-card">
        <h2><a href="/article/{{ article.id }}">{{ article.title }}</a></h2>
        <div class="meta">
          <span>{{ article.create_time | dateFormat('YYYY-MM-DD') }}</span>
          <span>点击: {{ article.click }}</span>
        </div>
        <p>{{ article.summary | truncate(150) }}</p>
      </article>
    {% endfor %}
  {% endArticles %}
</div>

<!-- 侧边栏友情链接 -->
<div class="sidebar-links">
  <h3>友情链接</h3>
  {% Links status=10, limit=10 %}
    <ul>
      {% for link in links %}
        <li><a href="{{ link.url }}" target="_blank">{{ link.site_name }}</a></li>
      {% endfor %}
    </ul>
  {% endLinks %}
</div>

<!-- 网站公告 -->
<div class="notices">
  {% Notices status=10, limit=3 %}
    {% for notice in notices %}
      <div class="notice-item">
        <h4>{{ notice.title }}</h4>
        <p>{{ notice.content | stripHtml | truncate(100) }}</p>
        <small>{{ notice.create_time | dateFormat('MM-DD HH:mm') }}</small>
      </div>
    {% endfor %}
  {% endNotices %}
</div>

<!-- 分类列表 -->
<div class="categories">
  {% Categories tree=true %}
    {% for category in categories %}
      <div class="category">
        <h3>{{ category.title }}</h3>
        {% if category.children %}
          <ul>
            {% for child in category.children %}
              <li><a href="/category/{{ child.id }}">{{ child.title }}</a></li>
            {% endfor %}
          </ul>
        {% endif %}
      </div>
    {% endfor %}
  {% endCategories %}
</div>
```

## 注意事项

1. **数据上下文**: 列表标签会将数据设置到 `context.ctx` 中，变量名为标签名的小写复数形式
2. **单项标签**: 返回 JSON 字符串，如需在模板中使用需要先解析
3. **性能考虑**: 合理设置 `limit` 参数，避免一次性获取过多数据
4. **状态值**: 不同模型的状态值可能不同，请参考对应的服务文件
5. **错误处理**: 标签内部已处理错误情况，不存在的数据会返回空结果

## 扩展开发

如需添加新的标签，请参考现有标签的实现方式：

1. 在 `src/server/nunjucks/tag/` 目录下创建对应的标签文件
2. 实现标签的 `parse` 和 `run` 方法
3. 在 `src/server/config/nunjucks.ts` 中注册新标签
4. 更新本文档说明新标签的使用方法
