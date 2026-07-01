'use client'

import { SetStepNav, useConfig } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

type AdminCustomViewStepNavProps = {
  label: string
  /** Admin-relative path, e.g. `/stats` */
  viewPath: `/${string}`
}

/** Sets AppHeader breadcrumbs for admin.components.views custom pages. */
export function AdminCustomViewStepNav({ label, viewPath }: AdminCustomViewStepNavProps) {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <SetStepNav
      nav={[
        {
          label,
          url: formatAdminURL({ adminRoute, path: viewPath }),
        },
      ]}
    />
  )
}
