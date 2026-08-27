import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { AuthzCache } from './collections/AuthzCache'
import { FrontendCacheEntries } from './collections/FrontendCacheEntries'
import { Roles } from './collections/Roles'
import { AppConfigs } from './collections/AppConfigs'
import { LlmProviders } from './collections/LlmProviders'
import { PromptTemplates } from './collections/PromptTemplates'
import { StorageTargets } from './collections/StorageTargets'
import { EmailTransports } from './collections/EmailTransports'
import { Comments } from './collections/Comments'
import { Galleries } from './collections/Galleries'
import { GalleryItems } from './collections/GalleryItems'
import { ApiAccessLogs } from './collections/ApiAccessLogs'
import { AiChatSessions } from './collections/AiChatSessions'
import { AdSlots } from './collections/AdSlots'
import { Ads } from './collections/Ads'
import { Categories } from './collections/Categories'
import { Jobs } from './collections/Jobs'
import { Links } from './collections/Links'
import { LinkGroups } from './collections/LinkGroups'
import { ShortLinks } from './collections/ShortLinks'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { createDatabaseAdapter } from './database/adapter'
import { Footer } from './globals/Footer/config'
import { Header } from './globals/Header/config'
import { SiteSettings } from './globals/SiteSettings/config'
import { AiSettings } from './globals/AiSettings/config'
import { CommentSettings } from './globals/CommentSettings/config'
import { StorageSettings } from './globals/StorageSettings/config'
import { EmailSettings } from './globals/EmailSettings/config'
import { NovelCategories } from './collections/NovelCategories'
import { NovelChapters } from './collections/NovelChapters'
import { Novels } from './collections/Novels'
import { NovelTags } from './collections/NovelTags'
import { CacheSettings } from './globals/CacheSettings/config'
import { requirePermission } from './access/can'
import { plugins } from './plugins'
import { i18nConfig } from './i18n'
import { adminLabels } from './i18n/admin-labels'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { purgeExpiredFrontendCacheTask } from './jobs/purgeExpiredFrontendCache'
import { createEmailAdapter } from './email/createEmailAdapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    meta: {
      titleSuffix: '- Crispy CMS',
    },
    // Uploadable user avatar; falls back to local SVG (Gravatar is blocked in CN).
    avatar: {
      Component: '@/components/AdminAvatar',
    },
    components: {
      graphics: {
        Logo: '@/components/AdminLogo',
        Icon: '@/components/AdminIcon',
      },
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      afterNavLinks: ['@/components/AdminAfterNavLinks'],
      providers: ['@/components/AdminThemeProvider', '@/components/AdminAiAgent/AdminAiAgentProvider'],
      views: {
        apiDocs: {
          Component: '@/app/(payload)/admin/api-docs/SwaggerView',
          path: '/api-docs',
          exact: true,
        },
        aiAgent: {
          Component: '@/app/(payload)/admin/ai-agent/AiAgentView',
          path: '/ai-agent',
          exact: true,
        },
        stats: {
          Component: '@/app/(payload)/admin/stats/StatsView',
          path: '/stats',
          exact: true,
        },
        cache: {
          Component: '@/app/(payload)/admin/cache/CacheView',
          path: '/cache',
          exact: true,
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: '手机',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: '平板',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: '桌面',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  i18n: i18nConfig,
  // Roles.permissions select values use ":" (e.g. posts:create), which are invalid GraphQL enum names.
  graphQL: {
    disable: true,
  },
  queryPresets: {
    access: {
      create: requirePermission('presets:manage'),
      read: requirePermission('presets:manage'),
      update: requirePermission('presets:manage'),
      delete: requirePermission('presets:manage'),
    },
    constraints: {},
    labels: {
      singular: '查询预设',
      plural: '查询预设',
    },
  },
  folders: {
    collectionOverrides: [
      ({ collection }) => ({
        ...collection,
        fields: collection.fields.map((field) => {
          if ('name' in field && field.name === 'folder') {
            return { ...field, label: adminLabels.folder }
          }
          if ('name' in field && field.name === 'name' && !field.label) {
            return { ...field, label: adminLabels.title }
          }
          return field
        }),
      }),
    ],
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: createDatabaseAdapter(),
  email: createEmailAdapter(),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Tags,
    Links,
    LinkGroups,
    ShortLinks,
    AdSlots,
    Ads,
    Jobs,
    Novels,
    NovelChapters,
    NovelCategories,
    NovelTags,
    Galleries,
    GalleryItems,
    AppConfigs,
    LlmProviders,
    PromptTemplates,
    StorageTargets,
    EmailTransports,
    Comments,
    ApiAccessLogs,
    FrontendCacheEntries,
    AuthzCache,
    Roles,
    AiChatSessions,
    Users,
  ],
  onInit: async (payload) => {
    try {
      const { ensureSystemRoles } = await import('./access/ensureSystemRoles')
      const { recomputeAllUserAuthzCaches } = await import('./access/authzCache')
      await ensureSystemRoles(payload)
      const updated = await recomputeAllUserAuthzCaches(payload)
      payload.logger.info(`Authz-cache warmed for ${updated} user(s)`)
    } catch (error) {
      payload.logger.error({ err: error }, 'Failed to ensure system roles / authz-cache')
    }
  },
  cors: [getServerSideURL()].filter(Boolean),
  globals: [
    Header,
    Footer,
    SiteSettings,
    AiSettings,
    CommentSettings,
    CacheSettings,
    StorageSettings,
    EmailSettings,
  ],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    autoRun: [
      {
        allQueues: true,
        cron: '*/5 * * * *',
      },
    ],
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [purgeExpiredFrontendCacheTask],
  },
})
