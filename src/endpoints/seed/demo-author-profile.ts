import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

function textNode(text: string) {
  return {
    type: 'text' as const,
    detail: 0,
    format: 0,
    mode: 'normal' as const,
    style: '',
    text,
    version: 1,
  }
}

function headingNode(tag: 'h2' | 'h3', text: string) {
  return {
    type: 'heading' as const,
    children: [textNode(text)],
    direction: 'ltr' as const,
    format: '',
    indent: 0,
    tag,
    version: 1,
  }
}

function paragraphNode(text: string) {
  return {
    type: 'paragraph' as const,
    children: [textNode(text)],
    direction: 'ltr' as const,
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

function listItemNode(text: string) {
  return {
    type: 'listitem' as const,
    children: [textNode(text)],
    direction: 'ltr' as const,
    format: '',
    indent: 0,
    value: 1,
    version: 1,
  }
}

function listNode(items: string[]) {
  return {
    type: 'list' as const,
    children: items.map(listItemNode),
    direction: 'ltr' as const,
    format: '',
    indent: 0,
    listType: 'bullet' as const,
    start: 1,
    tag: 'ul' as const,
    version: 1,
  }
}

export const demoAuthorBio =
  'Vue · Angular · Node.js · 前端开发；习惯把工作中的问题与解决方案记录下来，方便复盘与分享。'

export const demoAuthorBioDetail = {
  root: {
    type: 'root',
    children: [
      headingNode('h2', '关于我'),
      listNode([
        '专注前端开发，习惯把工作中遇到的问题和解决方案记录下来，方便日后复盘与分享。',
        '会整理学习笔记，包括重点、难点和解决思路，这些沉淀对个人成长很有帮助。',
      ]),
      headingNode('h2', '技术栈'),
      headingNode('h3', '前端'),
      listNode([
        'Vue、Vue Router、Vuex、Axios、ES6、Sass/Less — 用于构建现代、响应式的 Web 应用',
        'Angular、RxJS — 当前主要在工作项目中使用',
      ]),
      headingNode('h3', '服务端与运行时'),
      listNode([
        'Node.js，熟悉 Express、Koa、Nest.js 等，用于开发服务端应用',
        'MySQL、Redis — 数据存储与缓存',
      ]),
      headingNode('h2', '联系'),
      paragraphNode('有问题或想法欢迎在文章下留言，或通过关于页的链接找到我。'),
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
} as DefaultTypedEditorState
