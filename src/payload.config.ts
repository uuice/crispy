import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

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
import { plugins } from './plugins'
import { i18nConfig } from './i18n'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

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
      afterNavLinks: [
        '@/app/(payload)/admin/dev-docs/DevDocsNavLink',
        '@/app/(payload)/admin/api-docs/SwaggerNavLink',
        '@/app/(payload)/admin/ai-agent/AiAgentNavLink',
      ],
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
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: createDatabaseAdapter(),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Tags,
    Links,
    AdSlots,
    Ads,
    Jobs,
    GalleryItems,
    AppConfigs,
    Comments,
    ApiAccessLogs,
    AiChatSessions,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings, AiSettings, CommentSettings],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
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
    tasks: [],
  },
})
