import type { CollectionConfig } from 'payload'

import { novelsReadAccess, novelsWriteAccess } from '@/access/novels'
import { adminLabels } from '@/i18n/admin-labels'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { aiSuggestAssistField, withAiTextField } from '@/fields/ai'

export const Novels: CollectionConfig<'novels'> = {
  slug: 'novels',
  labels: adminLabels.novels,
  trash: true,
  versions: false,
  access: {
    create: novelsWriteAccess,
    delete: novelsWriteAccess,
    read: novelsReadAccess,
    update: novelsWriteAccess,
  },
  admin: {
    group: adminLabels.contentGroup,
    defaultColumns: ['title', 'genre', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    description: '长篇小说项目设定，一本一条记录；章节通过 posts.novel 关联。',
  },
  fields: [
    withAiTextField(
      {
        name: 'title',
        type: 'text',
        label: adminLabels.novelTitle,
        required: true,
      },
      {
        contentFieldPaths: ['synopsis', 'genre', 'plotOutline', 'writingStyle'],
      },
    ),
    aiSuggestAssistField({
      contentFieldPaths: ['synopsis', 'writingStyle', 'worldBuilding', 'plotOutline'],
    }),
    chineseSlugField(),
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.novelSettingsEnabled,
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: '关闭后 AI Agent 写章时可忽略本书设定。',
      },
    },
    {
      name: 'genre',
      type: 'text',
      label: adminLabels.novelGenre,
      admin: { description: '如玄幻、科幻、言情、悬疑' },
    },
    {
      name: 'synopsis',
      type: 'textarea',
      label: adminLabels.novelSynopsis,
      admin: { description: '全书梗概，一两段即可。' },
    },
    {
      name: 'writingStyle',
      type: 'textarea',
      label: adminLabels.novelWritingStyle,
      admin: { description: '人称、文风、参考作品、对话风格等。' },
    },
    {
      name: 'worldBuilding',
      type: 'textarea',
      label: adminLabels.novelWorldBuilding,
    },
    {
      name: 'constraints',
      type: 'textarea',
      label: adminLabels.novelConstraints,
      admin: { description: '不可违反的硬设定、禁忌、避讳。' },
    },
    {
      name: 'characters',
      type: 'array',
      label: adminLabels.novelCharacters,
      labels: { singular: adminLabels.novelCharacter, plural: adminLabels.novelCharacters },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: adminLabels.name,
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          label: adminLabels.novelCharacterRole,
        },
        {
          name: 'personality',
          type: 'textarea',
          label: adminLabels.novelCharacterPersonality,
        },
        {
          name: 'notes',
          type: 'textarea',
          label: adminLabels.novelCharacterNotes,
        },
      ],
    },
    {
      name: 'plotOutline',
      type: 'textarea',
      label: adminLabels.novelPlotOutline,
      admin: { description: '卷/章级别大纲，可随创作更新。' },
    },
    {
      name: 'currentProgress',
      type: 'textarea',
      label: adminLabels.novelCurrentProgress,
      admin: {
        description: '当前写到第几章、上章结尾、下一章要点。写章后由人工或 Agent 更新。',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'chapterTargetWords',
          type: 'number',
          label: adminLabels.novelChapterTargetWords,
          defaultValue: 4000,
          min: 500,
          max: 10000,
          admin: { width: '50%', step: 100 },
        },
        {
          name: 'chapterCategory',
          type: 'relationship',
          relationTo: 'categories',
          label: adminLabels.novelChapterCategory,
          admin: {
            width: '50%',
            description: '新章节 post 默认归入的分类（可选）。',
          },
        },
      ],
    },
    {
      name: 'chapterTag',
      type: 'relationship',
      relationTo: 'tags',
      label: adminLabels.novelChapterTag,
      admin: { description: '新章节 post 默认标签（可选），如卷名。' },
    },
  ],
}
