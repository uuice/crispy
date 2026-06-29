import { createServerFeature } from '@payloadcms/richtext-lexical'

export const AiRewriteFeature = createServerFeature({
  key: 'aiRewrite',
  feature: {
    ClientFeature: '@/components/AdminAi/lexical/AiRewriteFeature/client#AiRewriteFeatureClient',
  },
})
