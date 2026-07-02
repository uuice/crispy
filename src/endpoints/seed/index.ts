import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'
import crypto from 'crypto'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const collections: CollectionSlug[] = [
  'categories',
  'tags',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const globals = ['header', 'footer', 'site-settings'] as const satisfies readonly GlobalSlug[]

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

const tags = ['Payload', 'Next.js', 'CMS', 'TypeScript', 'Open Source']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  const seedContext = { disableRevalidate: true }

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) => {
      if (global === 'site-settings') {
        return payload.updateGlobal({
          slug: global,
          data: {
            siteName: 'Crispy',
            siteDescription: '基于 Payload 的通用内容管理系统',
            enableRss: true,
            adminThemeHue: 41.116,
          },
          depth: 0,
          context: seedContext,
        })
      }

      return payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: seedContext,
      })
    }),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo users...`)

  const demoUsers = [
    { name: 'Demo Author', email: 'demo-author@example.com', roles: ['author'] as const },
    { name: 'Editor', email: 'editor@example.com', roles: ['editor'] as const },
    { name: 'Author', email: 'author@example.com', roles: ['author'] as const },
    { name: 'Agent', email: 'agent@example.com', roles: ['editor'] as const },
  ]

  await payload.delete({
    collection: 'payload-mcp-api-keys',
    overrideAccess: true,
    where: { label: { equals: '开发 Agent' } },
  })

  for (const user of demoUsers) {
    await payload.delete({
      collection: 'users',
      depth: 0,
      overrideAccess: true,
      where: { email: { equals: user.email } },
    })
  }

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        name: demoUsers[0].name,
        email: demoUsers[0].email,
        password: 'password',
        roles: [...demoUsers[0].roles],
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
  ])

  await Promise.all(
    demoUsers.slice(1).map((user) =>
      payload.create({
        collection: 'users',
        overrideAccess: true,
        data: {
          name: user.name,
          email: user.email,
          password: 'password',
          roles: [...user.roles],
        },
      }),
    ),
  )

  await Promise.all([
    ...categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
    ...tags.map((tag) =>
      payload.create({
        collection: 'tags',
        data: {
          title: tag,
          slug: tag.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-'),
        },
      }),
    ),
  ])

  const tagDocs = await payload.find({
    collection: 'tags',
    limit: 10,
    pagination: false,
  })

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: seedContext,
    data: {
      ...post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
      tags: tagDocs.docs.slice(0, 2).map((tag) => tag.id),
    },
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: seedContext,
    data: {
      ...post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
      tags: tagDocs.docs.slice(2, 4).map((tag) => tag.id),
    },
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: seedContext,
    data: {
      ...post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
      tags: tagDocs.docs.slice(4, 5).map((tag) => tag.id),
    },
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    context: seedContext,
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    context: seedContext,
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    context: seedContext,
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    context: seedContext,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: seedContext,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: seedContext,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      context: seedContext,
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: '首页',
              url: '/',
            },
          },
          {
            link: {
              type: 'custom',
              label: '归档',
              url: '/archives',
            },
          },
          {
            link: {
              type: 'custom',
              label: '友链',
              url: '/links',
            },
          },
          {
            link: {
              type: 'custom',
              label: '关于',
              url: '/about',
            },
          },
          {
            link: {
              type: 'custom',
              label: '导航',
              url: '/navigations',
            },
          },
          {
            link: {
              type: 'custom',
              label: '小游戏',
              url: '/games',
            },
          },
          {
            link: {
              type: 'reference',
              label: '联系我们',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      context: seedContext,
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: '管理后台',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: '归档',
              url: '/archives',
            },
          },
          {
            link: {
              type: 'custom',
              label: '友链',
              url: '/links',
            },
          },
          {
            link: {
              type: 'custom',
              label: '关于',
              url: '/about',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'RSS 订阅',
              url: '/rss.xml',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'GitHub',
              newTab: true,
              url: 'https://github.com/uuice/crispy',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info(`— Seeding ad slots...`)

  await Promise.all([
    payload.delete({ collection: 'ads', overrideAccess: true, where: {}, context: seedContext }),
    payload.delete({
      collection: 'ad-slots',
      overrideAccess: true,
      where: {},
      context: seedContext,
    }),
    payload.delete({ collection: 'jobs', overrideAccess: true, where: {}, context: seedContext }),
    payload.delete({
      collection: 'gallery-items',
      overrideAccess: true,
      where: {},
      context: seedContext,
    }),
  ])

  await Promise.all([
    payload.create({
      collection: 'ad-slots',
      context: seedContext,
      overrideAccess: true,
      data: {
        title: '首页横幅',
        slug: 'home-banner',
        description: '首页 Hero 下方',
        recommendedWidth: 728,
        recommendedHeight: 90,
        enabled: true,
      },
    }),
    payload.create({
      collection: 'ad-slots',
      context: seedContext,
      overrideAccess: true,
      data: {
        title: '文章列表顶部',
        slug: 'post-list-top',
        description: '/posts 列表页标题下方',
        recommendedWidth: 728,
        recommendedHeight: 90,
        enabled: true,
      },
    }),
    payload.create({
      collection: 'ad-slots',
      context: seedContext,
      overrideAccess: true,
      data: {
        title: '文章正文下方',
        slug: 'post-content-bottom',
        description: '文章详情页正文与相关文章之间',
        recommendedWidth: 728,
        recommendedHeight: 90,
        enabled: true,
      },
    }),
  ])

  payload.logger.info(`— Seeding jobs...`)

  await Promise.all([
    payload.create({
      collection: 'jobs',
      context: { ...seedContext, skipAuditLog: true },
      overrideAccess: true,
      data: {
        title: '全栈工程师',
        slug: 'full-stack-engineer',
        department: '研发',
        location: '上海 / 远程',
        employmentType: 'full-time',
        salary: '25k–40k',
        enabled: true,
        publishedAt: new Date().toISOString(),
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: '负责 Crispy CMS 前后台功能开发与维护，参与架构设计与代码评审。',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        requirements: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: '熟悉 TypeScript、React、Next.js；有 Payload 或 Headless CMS 经验者优先。',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    }),
    payload.create({
      collection: 'jobs',
      context: { ...seedContext, skipAuditLog: true },
      overrideAccess: true,
      data: {
        title: '内容运营',
        slug: 'content-operator',
        department: '运营',
        location: '北京',
        employmentType: 'full-time',
        salary: '12k–18k',
        enabled: true,
        publishedAt: new Date().toISOString(),
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: '负责站点内容策划、编辑与发布，维护分类标签与友情链接。',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    }),
  ])

  payload.logger.info(`— Seeding gallery items...`)

  await Promise.all([
    payload.create({
      collection: 'gallery-items',
      context: { ...seedContext, skipAuditLog: true },
      overrideAccess: true,
      data: {
        title: '示例图片一',
        image: image1Doc.id,
        description: '图库精选展示示例',
        sort: 0,
        enabled: true,
      },
    }),
    payload.create({
      collection: 'gallery-items',
      context: { ...seedContext, skipAuditLog: true },
      overrideAccess: true,
      data: {
        title: '示例图片二',
        image: image2Doc.id,
        description: '图库精选展示示例',
        sort: 1,
        enabled: true,
      },
    }),
    payload.create({
      collection: 'gallery-items',
      context: { ...seedContext, skipAuditLog: true },
      overrideAccess: true,
      data: {
        title: '示例图片三',
        image: image3Doc.id,
        sort: 2,
        enabled: true,
      },
    }),
  ])

  payload.logger.info(`— Seeding MCP API key for agent...`)

  const agentResult = await payload.find({
    collection: 'users',
    limit: 1,
    where: { email: { equals: 'agent@example.com' } },
  })

  const agent = agentResult.docs[0]

  if (agent) {
    await payload.delete({
      collection: 'payload-mcp-api-keys',
      where: { label: { equals: '开发 Agent' } },
    })

    const mcpApiKey = crypto.randomBytes(32).toString('hex')

    const mcpKeyDoc = await payload.create({
      collection: 'payload-mcp-api-keys',
      data: {
        label: '开发 Agent',
        description: '本地开发 / MCP 验证用',
        user: agent.id,
        enableAPIKey: true,
        apiKey: mcpApiKey,
        posts: { find: true, create: true, update: true, delete: true },
        pages: { find: true, create: true, update: true, delete: true },
        categories: { find: true, create: true, update: true, delete: true },
        tags: { find: true, create: true, update: true, delete: true },
        links: { find: true, create: true, update: true, delete: true },
        adSlots: { find: true, create: true, update: true, delete: true },
        ads: { find: true, create: true, update: true, delete: true },
        jobs: { find: true, create: true, update: true, delete: true },
        galleryItems: { find: true, create: true, update: true, delete: true },
        media: { find: true, create: true, update: true },
      },
      overrideAccess: true,
    })

    if (mcpKeyDoc) {
      payload.logger.info(`— MCP API Key（写入 MCP_API_KEY 环境变量）: ${mcpApiKey}`)
    }
  }

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
