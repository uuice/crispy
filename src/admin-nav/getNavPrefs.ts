import type { NavPreferences, PayloadRequest } from 'payload'
import { PREFERENCE_KEYS } from 'payload/shared'
import { cache } from 'react'

export const getNavPrefs = cache(async (req: PayloadRequest): Promise<NavPreferences | null> => {
  if (!req?.user?.collection) {
    return null
  }

  const prefs = await req.payload.find({
    collection: 'payload-preferences',
    depth: 0,
    limit: 1,
    pagination: false,
    req,
    where: {
      and: [
        {
          key: {
            equals: PREFERENCE_KEYS.NAV,
          },
        },
        {
          'user.relationTo': {
            equals: req.user.collection,
          },
        },
        {
          'user.value': {
            equals: req.user.id,
          },
        },
      ],
    },
  })

  return (prefs?.docs?.[0]?.value as NavPreferences | undefined) ?? null
})
