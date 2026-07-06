import { getPayload } from 'payload'
import config from '@payload-config'
import type { Link, LinkGroup } from '@/payload-types'

export type FriendLinkSection = {
  id: number | null
  title: string
  description?: string | null
  sort: number
  links: Link[]
}

function resolveGroupId(link: Link): number | null {
  const group = link.group
  if (group == null) return null
  if (typeof group === 'number') return group
  return group.id
}

export async function getFriendLinkSections(): Promise<FriendLinkSection[]> {
  const payload = await getPayload({ config })

  const [groupsResult, linksResult] = await Promise.all([
    payload.find({
      collection: 'link-groups',
      depth: 0,
      limit: 100,
      pagination: false,
      sort: 'sort',
      overrideAccess: false,
      where: {
        enabled: { equals: true },
      },
    }),
    payload.find({
      collection: 'links',
      depth: 1,
      limit: 200,
      pagination: false,
      sort: 'sort',
      overrideAccess: false,
      where: {
        enabled: { equals: true },
      },
    }),
  ])

  const groups = groupsResult.docs as LinkGroup[]
  const links = linksResult.docs

  if (groups.length === 0) {
    if (links.length === 0) return []
    return [
      {
        id: null,
        title: '友链列表',
        description: null,
        sort: 0,
        links,
      },
    ]
  }

  const linksByGroup = new Map<number, Link[]>()
  const ungrouped: Link[] = []

  for (const link of links) {
    const groupId = resolveGroupId(link)
    if (groupId == null) {
      ungrouped.push(link)
      continue
    }
    const bucket = linksByGroup.get(groupId) ?? []
    bucket.push(link)
    linksByGroup.set(groupId, bucket)
  }

  const sections: FriendLinkSection[] = groups
    .map((group) => ({
      id: group.id,
      title: group.title,
      description: group.description,
      sort: group.sort ?? 0,
      links: linksByGroup.get(group.id) ?? [],
    }))
    .filter((section) => section.links.length > 0)

  if (ungrouped.length > 0) {
    sections.push({
      id: null,
      title: '其他链接',
      description: null,
      sort: 9999,
      links: ungrouped,
    })
  }

  return sections.sort((a, b) => a.sort - b.sort)
}

export async function getFriendLinks(): Promise<Link[]> {
  const sections = await getFriendLinkSections()
  return sections.flatMap((section) => section.links)
}

export async function getEnabledFriendLinkGroups(): Promise<LinkGroup[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'link-groups',
    depth: 0,
    limit: 100,
    pagination: false,
    sort: 'sort',
    overrideAccess: false,
    where: {
      enabled: { equals: true },
    },
  })
  return result.docs
}

export const getCachedFriendLinkSections = getFriendLinkSections
export const getCachedFriendLinks = getFriendLinks
export const getCachedFriendLinkGroups = getEnabledFriendLinkGroups
