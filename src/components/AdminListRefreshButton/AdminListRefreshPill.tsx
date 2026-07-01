'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pill } from '@payloadcms/ui'

import './index.scss'

export function AdminListRefreshPill() {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    if (refreshing) return

    setRefreshing(true)
    router.refresh()
    window.setTimeout(() => setRefreshing(false), 800)
  }, [refreshing, router])

  return (
    <Pill
      aria-label="刷新列表"
      className={refreshing ? 'admin-list-refresh__pill is-refreshing' : 'admin-list-refresh__pill'}
      onClick={handleRefresh}
      pillStyle="light"
      size="small"
    >
      {refreshing ? '刷新中…' : '刷新'}
    </Pill>
  )
}
