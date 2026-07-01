'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@payloadcms/ui'

export function StatsRefreshButton() {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    if (refreshing) return

    setRefreshing(true)
    router.refresh()
    window.setTimeout(() => setRefreshing(false), 800)
  }, [refreshing, router])

  return (
    <Button buttonStyle="secondary" disabled={refreshing} onClick={handleRefresh} size="small">
      {refreshing ? '刷新中…' : '刷新统计'}
    </Button>
  )
}
