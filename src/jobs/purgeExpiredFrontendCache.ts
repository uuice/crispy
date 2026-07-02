import type { TaskConfig } from 'payload'

import { purgeExpiredCacheEntries } from '@/frontend-cache/dbCache'

export const purgeExpiredFrontendCacheTask: TaskConfig<'purgeExpiredFrontendCache'> = {
  slug: 'purgeExpiredFrontendCache',
  label: 'Purge expired frontend cache entries',
  schedule: [
    {
      cron: '0 * * * *',
      queue: 'default',
    },
  ],
  outputSchema: [
    {
      name: 'deleted',
      type: 'number',
      required: true,
    },
  ],
  handler: async () => {
    const deleted = await purgeExpiredCacheEntries()
    return {
      output: {
        deleted,
      },
    }
  },
}
