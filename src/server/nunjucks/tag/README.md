# Nunjucks Template Tags

This document describes all available Nunjucks template tags for the CMS system.

## Table of Contents

- [Articles](#articles)
- [Categories](#categories)
- [Tags](#tags)
- [Comments](#comments)
- [Users](#users)
- [Links](#links)
- [Menus](#menus)
- [Notices](#notices)
- [Pages](#pages)
- [Roles](#roles)
- [Configs](#configs)
- [Enums](#enums)
- [Keywords](#keywords)
- [Ads](#ads)
- [AdItems](#aditems)
- [Votes](#votes)
- [VoteItems](#voteitems)
- [Attrs](#attrs)
- [Additions](#additions)
- [Jobs](#jobs)
- [Holidays](#holidays)
- [UserTypes](#usertypes)
- [Rules](#rules)

## Articles

### Articles Tag

获取文章列表，支持多种查询条件。

**Usage:**

```njk
{% Articles limit=10 page=1 page_size=20 title="search" category_id=1 user_id=1 status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for article in articles %}
    <h2>{{ article.title }}</h2>
    <p>{{ article.content }}</p>
  {% endfor %}

  <!-- Pagination info -->
  <p>Total: {{ articles_pagination.total }}, Page: {{ articles_pagination.page }}/{{ articles_pagination.totalPages }}</p>
{% endArticles %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `category_id` (number): 按分类ID过滤
- `user_id` (number): 按用户ID过滤
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### ArticleItem Tag

获取单个文章。

**Usage:**

```njk
{% ArticleItem id=1 %}
  <h1>{{ article.title }}</h1>
  <div>{{ article.content }}</div>
{% endArticleItem %}
```

**Context:**

- 返回单个对象：`article`

**Parameters:**

- `id` (number): 文章ID
- `title` (string): 文章标题

## Categories

### Categories Tag

获取分类列表，支持多种查询条件。

**Usage:**

```njk
{% Categories limit=20 page=1 page_size=10 title="search" parent_id=0 status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for category in categories %}
    <h3>{{ category.title }}</h3>
  {% endfor %}
{% endCategories %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认20
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `parent_id` (number): 父分类ID，0表示顶级分类
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### CategoryItem Tag

获取单个分类。

**Usage:**

```njk
{% CategoryItem id=1 %}
  <h2>{{ category.title }}</h2>
  <p>{{ category.description }}</p>
{% endCategoryItem %}
```

**Context:**

- 返回单个对象：`category`

**Parameters:**

- `id` (number): 分类ID
- `title` (string): 分类标题

## Tags

### Tags Tag

获取标签列表，支持多种查询条件。

**Usage:**

```njk
{% Tags limit=50 page=1 page_size=20 title="search" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for tag in tags %}
    <span class="tag">{{ tag.title }}</span>
  {% endfor %}
{% endTags %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认50
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### TagItem Tag

获取单个标签。

**Usage:**

```njk
{% TagItem id=1 %}
  <span class="tag">{{ tag.title }}</span>
  <p>{{ tag.description }}</p>
{% endTagItem %}
```

**Context:**

- 返回单个对象：`tag`

**Parameters:**

- `id` (number): 标签ID
- `title` (string): 标签标题

## Comments

### Comments Tag

获取评论列表，支持多种查询条件。

**Usage:**

```njk
{% Comments limit=20 page=1 page_size=10 content="search" article_id=1 user_id=1 status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for comment in comments %}
    <div class="comment">
      <p>{{ comment.content }}</p>
      <small>By: {{ comment.user_name }}</small>
    </div>
  {% endfor %}
{% endComments %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认20
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `content` (string): 按内容搜索
- `article_id` (number): 按文章ID过滤
- `user_id` (number): 按用户ID过滤
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### CommentItem Tag

获取单个评论。

**Usage:**

```njk
{% CommentItem id=1 %}
  <div class="comment">
    <p>{{ comment.content }}</p>
    <small>By: {{ comment.user_name }}</small>
  </div>
{% endCommentItem %}
```

**Context:**

- 返回单个对象：`comment`

**Parameters:**

- `id` (number): 评论ID

## Users

### Users Tag

获取用户列表，支持多种查询条件。

**Usage:**

```njk
{% Users limit=20 page=1 page_size=10 username="search" email="search" type_id=1 status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for user in users %}
    <div class="user">
      <h4>{{ user.username }}</h4>
      <p>{{ user.email }}</p>
    </div>
  {% endfor %}
{% endUsers %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认20
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `username` (string): 按用户名搜索
- `email` (string): 按邮箱搜索
- `type_id` (number): 按用户类型过滤
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### UserItem Tag

获取单个用户。

**Usage:**

```njk
{% UserItem id=1 %}
  <div class="user">
    <h4>{{ user.username }}</h4>
    <p>{{ user.email }}</p>
  </div>
{% endUserItem %}
```

**Context:**

- 返回单个对象：`user`

**Parameters:**

- `id` (number): 用户ID
- `username` (string): 用户名
- `email` (string): 邮箱

## Links

### Links Tag

获取链接列表，支持多种查询条件。

**Usage:**

```njk
{% Links limit=20 page=1 page_size=10 title="search" url="search" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for link in links %}
    <a href="{{ link.url }}">{{ link.title }}</a>
  {% endfor %}
{% endLinks %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认20
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `url` (string): 按URL搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### LinkItem Tag

获取单个链接。

**Usage:**

```njk
{% LinkItem id=1 %}
  <a href="{{ link.url }}">{{ link.title }}</a>
  <p>{{ link.description }}</p>
{% endLinkItem %}
```

**Context:**

- 返回单个对象：`link`

**Parameters:**

- `id` (number): 链接ID
- `title` (string): 链接标题
- `url` (string): 链接URL

## Menus

### Menus Tag

获取菜单列表，支持多种查询条件。

**Usage:**

```njk
{% Menus limit=20 page=1 page_size=10 title="search" parent_id=0 status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for menu in menus %}
    <li><a href="{{ menu.url }}">{{ menu.title }}</a></li>
  {% endfor %}
{% endMenus %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认20
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `parent_id` (number): 父菜单ID，0表示顶级菜单
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### MenuItem Tag

获取单个菜单。

**Usage:**

```njk
{% MenuItem id=1 %}
  <li><a href="{{ menu.url }}">{{ menu.title }}</a></li>
{% endMenuItem %}
```

**Context:**

- 返回单个对象：`menu`

**Parameters:**

- `id` (number): 菜单ID
- `title` (string): 菜单标题

## Notices

### Notices Tag

获取公告列表，支持多种查询条件。

**Usage:**

```njk
{% Notices limit=10 page=1 page_size=5 title="search" content="search" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for notice in notices %}
    <div class="notice">
      <h3>{{ notice.title }}</h3>
      <p>{{ notice.content }}</p>
    </div>
  {% endfor %}
{% endNotices %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `content` (string): 按内容搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### NoticeItem Tag

获取单个公告。

**Usage:**

```njk
{% NoticeItem id=1 %}
  <div class="notice">
    <h3>{{ notice.title }}</h3>
    <p>{{ notice.content }}</p>
  </div>
{% endNoticeItem %}
```

**Context:**

- 返回单个对象：`notice`

**Parameters:**

- `id` (number): 公告ID
- `title` (string): 公告标题

## Pages

### Pages Tag

获取页面列表，支持多种查询条件。

**Usage:**

```njk
{% Pages limit=20 page=1 page_size=10 title="search" alias="search" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for page in pages %}
    <div class="page">
      <h2>{{ page.title }}</h2>
      <p>{{ page.content }}</p>
    </div>
  {% endfor %}
{% endPages %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认20
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `alias` (string): 按别名搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### PageItem Tag

获取单个页面。

**Usage:**

```njk
{% PageItem id=1 %}
  <div class="page">
    <h2>{{ page.title }}</h2>
    <div>{{ page.content }}</div>
  </div>
{% endPageItem %}
```

**Context:**

- 返回单个对象：`page`

**Parameters:**

- `id` (number): 页面ID
- `title` (string): 页面标题
- `alias` (string): 页面别名

## Roles

### Roles Tag

获取角色列表，支持多种查询条件。

**Usage:**

```njk
{% Roles limit=20 page=1 page_size=10 title="search" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for role in roles %}
    <div class="role">
      <h3>{{ role.title }}</h3>
      <p>{{ role.description }}</p>
    </div>
  {% endfor %}
{% endRoles %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认20
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### RoleItem Tag

获取单个角色。

**Usage:**

```njk
{% RoleItem id=1 %}
  <div class="role">
    <h3>{{ role.title }}</h3>
    <p>{{ role.description }}</p>
  </div>
{% endRoleItem %}
```

**Context:**

- 返回单个对象：`role`

**Parameters:**

- `id` (number): 角色ID
- `title` (string): 角色标题

## Configs

### Config Tag

获取配置列表，支持多种查询条件。

**Usage:**

```njk
{% Config limit=1000 page=1 page_size=50 title="search" alias="search" type_id=1 status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for config in configs %}
    <div class="config">
      <strong>{{ config.title }}:</strong> {{ config.value }}
    </div>
  {% endfor %}
{% endConfig %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认1000
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `alias` (string): 按别名搜索
- `type_id` (number): 按类型ID过滤
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### ConfigItem Tag

获取单个配置项。

**Usage:**

```njk
{% ConfigItem id=1 %}
  <div class="config">
    <strong>{{ config.title }}:</strong> {{ config.value }}
  </div>
{% endConfigItem %}
```

**Context:**

- 返回单个对象：`config`

**Parameters:**

- `id` (number): 配置ID
- `alias` (string): 配置别名

## Enums

### Enums Tag

获取枚举列表，支持多种查询条件。

**Usage:**

```njk
{% Enums limit=10 page=1 page_size=10 title="search" alias="search" code="user_status" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for enum in enums %}
    <option value="{{ enum.value }}">{{ enum.title }}</option>
  {% endfor %}
{% endEnums %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `alias` (string): 按别名搜索
- `code` (string): 按代码搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### EnumItem Tag

获取单个枚举项。

**Usage:**

```njk
{% EnumItem id=1 %}
  <option value="{{ enum.value }}">{{ enum.title }}</option>
{% endEnumItem %}
```

**Context:**

- 返回单个对象：`enum`

**Parameters:**

- `id` (number): 枚举ID
- `alias` (string): 枚举别名
- `code` (string): 枚举代码
- `value` (string): 枚举值

## Keywords

### Keywords Tag

获取关键词列表，支持多种查询条件。

**Usage:**

```njk
{% Keywords limit=10 page=1 page_size=10 title="search" alias="search" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for keyword in keywords %}
    <span class="keyword">{{ keyword.title }}</span>
  {% endfor %}
{% endKeywords %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `alias` (string): 按别名搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### KeywordItem Tag

获取单个关键词。

**Usage:**

```njk
{% KeywordItem id=1 %}
  <span class="keyword">{{ keyword.title }}</span>
{% endKeywordItem %}
```

**Context:**

- 返回单个对象：`keyword`

**Parameters:**

- `id` (number): 关键词ID
- `alias` (string): 关键词别名
- `title` (string): 关键词标题

## Ads

### Ads Tag

获取广告列表，支持多种查询条件。

**Usage:**

```njk
{% Ads limit=10 page=1 page_size=10 title="search" alias="search" content="search" type_id=1 status=10 sort_min=0 sort_max=100 start_time=1640995200000 end_time=1640995200000 has_image=true has_url=true %}
  {% for ad in ads %}
    <div class="ad">
      <h3>{{ ad.title }}</h3>
      {% if ad.image_url %}
        <img src="{{ ad.image_url }}" alt="{{ ad.title }}">
      {% endif %}
    </div>
  {% endfor %}
{% endAds %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `alias` (string): 按别名搜索
- `content` (string): 按内容搜索
- `type_id` (number): 按类型ID过滤
- `status` (number): 按状态过滤
- `sort_min` (number): 最小排序值
- `sort_max` (number): 最大排序值
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳
- `has_image` (boolean): 是否有图片
- `has_url` (boolean): 是否有链接

### AdItem Tag

获取单个广告。

**Usage:**

```njk
{% AdItem id=1 %}
  <div class="ad">
    <h3>{{ ad.title }}</h3>
    {% if ad.image_url %}
      <img src="{{ ad.image_url }}" alt="{{ ad.title }}">
    {% endif %}
  </div>
{% endAdItem %}
```

**Context:**

- 返回单个对象：`ad`

**Parameters:**

- `id` (number): 广告ID
- `title` (string): 广告标题

## AdItems

### AdItems Tag

获取广告项列表，支持多种查询条件。

**Usage:**

```njk
{% AdItems limit=10 page=1 page_size=10 ad_id=1 title="search" content="search" image_url="search" url="search" method="GET" status=10 %}
  {% for adItem in adItems %}
    <div class="ad-item">
      <h4>{{ adItem.title }}</h4>
      {% if adItem.image_url %}
        <img src="{{ adItem.image_url }}" alt="{{ adItem.title }}">
      {% endif %}
    </div>
  {% endfor %}
{% endAdItems %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `ad_id` (number): 按广告ID过滤
- `title` (string): 按标题搜索
- `content` (string): 按内容搜索
- `image_url` (string): 按图片URL搜索
- `url` (string): 按链接URL搜索
- `method` (string): 按请求方法过滤
- `status` (number): 按状态过滤

### AdItemSingle Tag

获取单个广告项。

**Usage:**

```njk
{% AdItemSingle id=1 %}
  <div class="ad-item">
    <h4>{{ adItem.title }}</h4>
    {% if adItem.image_url %}
      <img src="{{ adItem.image_url }}" alt="{{ adItem.title }}">
    {% endif %}
  </div>
{% endAdItemSingle %}
```

**Context:**

- 返回单个对象：`adItem`

**Parameters:**

- `id` (number): 广告项ID
- `title` (string): 广告项标题
- `ad_id` (number): 所属广告ID

## Votes

### Votes Tag

获取投票列表，支持多种查询条件。

**Usage:**

```njk
{% Votes limit=10 page=1 page_size=10 title="search" is_multiple=1 status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for vote in votes %}
    <div class="vote">
      <h3>{{ vote.title }}</h3>
      <p>Multiple choice: {{ vote.is_multiple ? 'Yes' : 'No' }}</p>
    </div>
  {% endfor %}
{% endVotes %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `is_multiple` (number): 是否多选（1=是，0=否）
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### VoteItem Tag

获取单个投票。

**Usage:**

```njk
{% VoteItem id=1 %}
  <div class="vote">
    <h3>{{ vote.title }}</h3>
    <p>Multiple choice: {{ vote.is_multiple ? 'Yes' : 'No' }}</p>
  </div>
{% endVoteItem %}
```

**Context:**

- 返回单个对象：`vote`

**Parameters:**

- `id` (number): 投票ID
- `title` (string): 投票标题

## VoteItems

### VoteItems Tag

获取投票项列表，支持多种查询条件。

**Usage:**

```njk
{% VoteItems limit=10 page=1 page_size=10 vote_id=1 title="search" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for voteItem in voteItems %}
    <div class="vote-item">
      <label>
        <input type="radio" name="vote" value="{{ voteItem.id }}">
        {{ voteItem.title }}
      </label>
    </div>
  {% endfor %}
{% endVoteItems %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `vote_id` (number): 按投票ID过滤
- `title` (string): 按标题搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### VoteItemSingle Tag

获取单个投票项。

**Usage:**

```njk
{% VoteItemSingle id=1 %}
  <div class="vote-item">
    <label>
      <input type="radio" name="vote" value="{{ voteItem.id }}">
      {{ voteItem.title }}
    </label>
  </div>
{% endVoteItemSingle %}
```

**Context:**

- 返回单个对象：`voteItem`

**Parameters:**

- `id` (number): 投票项ID
- `title` (string): 投票项标题
- `vote_id` (number): 所属投票ID

## Attrs

### Attrs Tag

获取属性列表，支持多种查询条件。

**Usage:**

```njk
{% Attrs limit=10 page=1 page_size=10 title="search" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for attr in attrs %}
    <div class="attr">
      <strong>{{ attr.title }}</strong>
    </div>
  {% endfor %}
{% endAttrs %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### AttrItem Tag

获取单个属性。

**Usage:**

```njk
{% AttrItem id=1 %}
  <div class="attr">
    <strong>{{ attr.title }}</strong>
    <span>{{ attr.value }}</span>
  </div>
{% endAttrItem %}
```

**Context:**

- 返回单个对象：`attr`

**Parameters:**

- `id` (number): 属性ID
- `alias` (string): 属性别名
- `title` (string): 属性标题

## Additions

### Additions Tag

获取附加项列表，支持多种查询条件。

**Usage:**

```njk
{% Additions limit=10 page=1 page_size=10 type=1 status=10 %}
  {% for addition in additions %}
    <div class="addition">
      <h4>{{ addition.name }}</h4>
      <p>{{ addition.description }}</p>
      <span>Price: ${{ addition.price }}</span>
    </div>
  {% endfor %}
{% endAdditions %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `type` (number): 按类型过滤（1=必选，2=可选）
- `status` (number): 按状态过滤

### AdditionItem Tag

获取单个附加项。

**Usage:**

```njk
{% AdditionItem id=1 %}
  <div class="addition">
    <h4>{{ addition.name }}</h4>
    <p>{{ addition.description }}</p>
    <span>Price: ${{ addition.price }}</span>
  </div>
{% endAdditionItem %}
```

**Context:**

- 返回单个对象：`addition`

**Parameters:**

- `id` (number): 附加项ID
- `name` (string): 附加项名称

## Jobs

### Jobs Tag

获取职位列表，支持多种查询条件。

**Usage:**

```njk
{% Jobs limit=10 page=1 page_size=10 title="search" type_name="full-time" nature="permanent" branch="HQ" address="New York" email="hr@company.com" num_min=1 num_max=10 sort_min=0 sort_max=100 start_time=1640995200000 end_time=1640995200000 has_email=true has_address=true %}
  {% for job in jobs %}
    <div class="job">
      <h3>{{ job.title }}</h3>
      <p>{{ job.content }}</p>
      <p>Location: {{ job.address }}</p>
      <p>Openings: {{ job.num }}</p>
    </div>
  {% endfor %}
{% endJobs %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `type_name` (string): 按职位类型搜索
- `nature` (string): 按工作性质搜索
- `branch` (string): 按部门搜索
- `address` (string): 按地址搜索
- `email` (string): 按邮箱搜索
- `num_min` (number): 最小招聘人数
- `num_max` (number): 最大招聘人数
- `sort_min` (number): 最小排序值
- `sort_max` (number): 最大排序值
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳
- `has_email` (boolean): 是否有邮箱
- `has_address` (boolean): 是否有地址

### JobItem Tag

获取单个职位。

**Usage:**

```njk
{% JobItem id=1 %}
  <div class="job">
    <h3>{{ job.title }}</h3>
    <p>{{ job.content }}</p>
    <p>Location: {{ job.address }}</p>
    <p>Openings: {{ job.num }}</p>
  </div>
{% endJobItem %}
```

**Context:**

- 返回单个对象：`job`

**Parameters:**

- `id` (number): 职位ID
- `title` (string): 职位标题

## Holidays

### Holidays Tag

获取节假日列表，支持多种查询条件。

**Usage:**

```njk
{% Holidays limit=10 page=1 page_size=10 title="search" value="2024-01-01" start_time=1640995200000 end_time=1640995200000 %}
  {% for holiday in holidays %}
    <div class="holiday">
      <span>{{ holiday.title }}</span>
      <span>{{ holiday.value }}</span>
    </div>
  {% endfor %}
{% endHolidays %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `value` (string): 按日期值搜索
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### HolidayItem Tag

获取单个节假日。

**Usage:**

```njk
{% HolidayItem id=1 %}
  <div class="holiday">
    <span>{{ holiday.title }}</span>
    <span>{{ holiday.value }}</span>
  </div>
{% endHolidayItem %}
```

**Context:**

- 返回单个对象：`holiday`

**Parameters:**

- `id` (number): 节假日ID
- `name` (string): 节假日名称
- `value` (string): 节假日日期值

## UserTypes

### UserTypes Tag

获取用户类型列表，支持多种查询条件。

**Usage:**

```njk
{% UserTypes limit=10 page=1 page_size=10 type_name="search" alias="search" status=10 start_time=1640995200000 end_time=1640995200000 %}
  {% for userType in userTypes %}
    <div class="user-type">
      <h4>{{ userType.type_name }}</h4>
      <p>{{ userType.remark }}</p>
    </div>
  {% endfor %}
{% endUserTypes %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `type_name` (string): 按类型名称搜索
- `alias` (string): 按别名搜索
- `status` (number): 按状态过滤
- `start_time` (number): 开始时间戳
- `end_time` (number): 结束时间戳

### UserTypeItem Tag

获取单个用户类型。

**Usage:**

```njk
{% UserTypeItem id=1 %}
  <div class="user-type">
    <h4>{{ userType.type_name }}</h4>
    <p>{{ userType.remark }}</p>
  </div>
{% endUserTypeItem %}
```

**Context:**

- 返回单个对象：`userType`

**Parameters:**

- `id` (number): 用户类型ID
- `type_name` (string): 类型名称
- `alias` (string): 类型别名

## Rules

### Rules Tag

获取规则列表，支持多种查询条件。

**Usage:**

```njk
{% Rules limit=10 page=1 page_size=10 title="search" alias="search" module_id=1 parent_id=0 type_id=1 status=10 %}
  {% for rule in rules %}
    <div class="rule">
      <h4>{{ rule.title }}</h4>
      <p>{{ rule.des }}</p>
    </div>
  {% endfor %}
{% endRules %}
```

**Special Tree Mode:**

```njk
{% Rules tree=true %}
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
{% endRules %}
```

**Parameters:**

- `limit` (number): 限制返回数量，默认10
- `page` (number): 页码，默认1
- `page_size` (number): 每页数量，默认等于limit
- `title` (string): 按标题搜索
- `alias` (string): 按别名搜索
- `module_id` (number): 按模块ID过滤
- `parent_id` (number): 按父规则ID过滤
- `type_id` (number): 按类型ID过滤
- `status` (number): 按状态过滤
- `tree` (boolean): 是否返回树形结构

### RuleItem Tag

获取单个规则。

**Usage:**

```njk
{% RuleItem id=1 %}
  <div class="rule">
    <h4>{{ rule.title }}</h4>
    <p>{{ rule.des }}</p>
  </div>
{% endRuleItem %}
```

**Context:**

- 返回单个对象：`rule`

**Parameters:**

- `id` (number): 规则ID
- `title` (string): 规则标题
- `alias` (string): 规则别名

## Real-world Examples

### Blog Homepage with Featured Articles

```njk
<!-- Get latest 5 published articles -->
{% Articles limit=5 status=10 %}
  <div class="featured-articles">
    {% for article in articles %}
      <article class="article-card">
        <h2><a href="/article/{{ article.id }}">{{ article.title }}</a></h2>
        <p>{{ article.summary }}</p>
        <div class="meta">
          <span>By {{ article.author_name }}</span>
          <span>{{ article.create_time | date }}</span>
        </div>
      </article>
    {% endfor %}
  </div>
{% endArticles %}

<!-- Get all active categories -->
{% Categories status=10 %}
  <nav class="category-nav">
    {% for category in categories %}
      <a href="/category/{{ category.id }}" class="category-link">
        {{ category.title }}
      </a>
    {% endfor %}
  </nav>
{% endCategories %}
```

### User Dashboard with Recent Activity

```njk
<!-- Get user's recent comments -->
{% Comments limit=10 user_id=current_user.id %}
  <div class="recent-comments">
    <h3>Your Recent Comments</h3>
    {% for comment in comments %}
      <div class="comment-item">
        <p>{{ comment.content }}</p>
        <small>On: {{ comment.article_title }}</small>
        <small>{{ comment.create_time | date }}</small>
      </div>
    {% endfor %}
  </div>
{% endComments %}

<!-- Get active notices -->
{% Notices limit=3 status=10 %}
  <div class="notices">
    {% for notice in notices %}
      <div class="notice-item">
        <h4>{{ notice.title }}</h4>
        <p>{{ notice.content }}</p>
      </div>
    {% endfor %}
  </div>
{% endNotices %}
```

### E-commerce Product Page

```njk
<!-- Get product attributes -->
{% Attrs limit=20 %}
  <div class="product-attributes">
    {% for attr in attrs %}
      <div class="attr-item">
        <label>{{ attr.title }}:</label>
        <span>{{ attr.value }}</span>
      </div>
    {% endfor %}
  </div>
{% endAttrs %}

<!-- Get product additions -->
{% Additions type=2 %}
  <div class="product-additions">
    <h4>Optional Add-ons</h4>
    {% for addition in additions %}
      <div class="addition-item">
        <input type="checkbox" id="add_{{ addition.id }}" value="{{ addition.id }}">
        <label for="add_{{ addition.id }}">
          {{ addition.name }} - ${{ addition.price }}
        </label>
      </div>
    {% endfor %}
  </div>
{% endAdditions %}
```

### Admin Panel with Statistics

```njk
<!-- Get user statistics -->
{% Users limit=100 page=1 page_size=20 %}
  <div class="user-stats">
    <h3>User Management</h3>
    <p>Total Users: {{ users_pagination.total }}</p>
    <p>Current Page: {{ users_pagination.page }} of {{ users_pagination.totalPages }}</p>

    <table class="user-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Type</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {% for user in users %}
          <tr>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.type_name }}</td>
            <td>{{ user.status == 10 ? 'Active' : 'Inactive' }}</td>
          </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
{% endUsers %}

<!-- Get system configuration -->
{% Config limit=50 %}
  <div class="system-config">
    <h3>System Configuration</h3>
    {% for config in configs %}
      <div class="config-item">
        <strong>{{ config.title }}:</strong>
        <span>{{ config.value }}</span>
      </div>
    {% endfor %}
  </div>
{% endConfig %}
```

## Notes

1. **Pagination**: All list tags support pagination with `page` and `page_size` parameters
2. **Search**: Most tags support text search via title, content, or other relevant fields
3. **Filtering**: Tags support various filters like status, date ranges, and relationship IDs
4. **Performance**: Use appropriate `limit` values to avoid loading too much data
5. **Error Handling**: Tags gracefully handle missing data and return empty results
6. **Context Variables**: All list tags provide both the data list and pagination information in the template context

## Best Practices

1. **Use Specific Filters**: Always use specific filters when possible to improve performance
2. **Limit Data**: Use reasonable `limit` values to avoid memory issues
3. **Cache Results**: Consider caching frequently used tag results
4. **Error Handling**: Always check if data exists before using it in templates
5. **Pagination**: Implement proper pagination controls using the pagination context variables
