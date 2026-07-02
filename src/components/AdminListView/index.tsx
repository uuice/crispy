'use client'

import { DefaultListView } from '@payloadcms/ui'
import type { ListViewClientProps } from 'payload'
import React from 'react'

import { AdminListRefreshPill } from '@/components/AdminListRefreshButton/AdminListRefreshPill'
import { UnsplashImportPill } from '@/unsplash/client/UnsplashImportPill'

export default function AdminListView(props: ListViewClientProps) {
  const beforeActions = [
    ...(Array.isArray(props.beforeActions) ? props.beforeActions : []),
    <AdminListRefreshPill key="crispy-list-refresh" />,
    <UnsplashImportPill key="crispy-unsplash-import" />,
  ]

  return <DefaultListView {...props} beforeActions={beforeActions} />
}
