'use client'

import { DefaultListView } from '@payloadcms/ui'
import type { ListViewClientProps } from 'payload'
import React from 'react'

import { AdminListRefreshPill } from '@/components/AdminListRefreshButton/AdminListRefreshPill'

export default function AdminListView(props: ListViewClientProps) {
  const beforeActions = [
    ...(Array.isArray(props.beforeActions) ? props.beforeActions : []),
    <AdminListRefreshPill key="crispy-list-refresh" />,
  ]

  return <DefaultListView {...props} beforeActions={beforeActions} />
}
