import config from '@payload-config'
import { getPayload } from 'payload'

export async function getSiteExploreData() {
  const payload = await getPayload({ config })

  const [posts, categories, tags, jobs, gallery, pages] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 6,
      overrideAccess: false,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      select: { title: true, slug: true, publishedAt: true },
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      sort: 'title',
      select: { title: true, slug: true },
    }),
    payload.find({
      collection: 'tags',
      depth: 0,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      sort: 'title',
      select: { title: true, slug: true },
    }),
    payload.find({
      collection: 'jobs',
      depth: 0,
      limit: 6,
      overrideAccess: false,
      sort: '-publishedAt',
      where: { enabled: { equals: true } },
      select: { title: true, slug: true, location: true, employmentType: true },
    }),
    payload.find({
      collection: 'galleries',
      depth: 1,
      limit: 8,
      overrideAccess: false,
      pagination: false,
      sort: 'sort',
      where: { enabled: { equals: true } },
      select: { title: true, slug: true, cover: true, description: true },
    }),
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 20,
      overrideAccess: false,
      pagination: false,
      sort: 'title',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { slug: { not_equals: 'home' } },
        ],
      },
      select: { title: true, slug: true },
    }),
  ])

  return {
    posts: posts.docs,
    categories: categories.docs,
    tags: tags.docs,
    jobs: jobs.docs,
    gallery: gallery.docs,
    pages: pages.docs,
  }
}

export const getCachedSiteExploreData = getSiteExploreData
