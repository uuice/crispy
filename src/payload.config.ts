import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { FrontendCacheEntries } from './collections/FrontendCacheEntries'
import { AppConfigs } from './collections/AppConfigs'
import { Comments } from './collections/Comments'
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
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './SiteSettings/config'
import { AiSettings } from './AiSettings/config'
import { CommentSettings } from './CommentSettings/config'
import { Novels } from './collections/Novels'
import { CacheSettings } from './CacheSettings/config'
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
    components: {
      graphics: {
        Logo: '@/components/AdminLogo',
        Icon: '@/components/AdminIcon',
      },
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      Nav: '@/components/AdminNav',
      providers: ['@/components/AdminThemeProvider', '@/components/AdminAiAgent/AdminAiAgentProvider'],
      views: {
        devDocs: {
          Component: '@/app/(payload)/admin/dev-docs/DevDocsView',
          path: '/dev-docs',
          exact: true,
        },
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
    dashboard: {
      widgets: [
        {
          slug: 'collections',
          Component: '@/components/AdminCollectionCards',
          minWidth: 'full',
        },
      ],
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
  queryPresets: {
    access: {},
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
    GalleryItems,
    AppConfigs,
    Comments,
    ApiAccessLogs,
    FrontendCacheEntries,
    AiChatSessions,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings, AiSettings, CommentSettings, CacheSettings],
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
