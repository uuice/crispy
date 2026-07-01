import { cookies } from 'next/headers'

import type { User } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

export async function getOptionalMeUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null

  try {
    const res = await fetch(`${getServerSideURL()}/api/users/me`, {
      headers: { Authorization: `JWT ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) return null

    const data = (await res.json()) as { user?: User | null }
    return data.user ?? null
  } catch {
    return null
  }
}
