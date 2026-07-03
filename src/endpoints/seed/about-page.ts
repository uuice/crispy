import type { RequiredDataFromCollectionSlug } from 'payload'

export const about: () => RequiredDataFromCollectionSlug<'pages'> = () => {
  return {
    slug: 'about',
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: '关于本站',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    tag: 'h2',
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Crispy 是基于 Payload CMS 与 Next.js 构建的内容站点示例。你可以在后台编辑页面、文章、导航与主题。',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
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
        ],
      },
    ],
    title: '关于',
    meta: {
      description: '关于 Crispy 内容站点',
    },
  }
}
