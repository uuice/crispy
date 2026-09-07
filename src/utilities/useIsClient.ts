'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => undefined

/** True after hydration on the client; false during SSR. */
export function useIsClient(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}
