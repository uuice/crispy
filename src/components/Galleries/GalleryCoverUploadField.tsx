'use client'

import React from 'react'
import { UploadField, useFormFields } from '@payloadcms/ui'
import type { UploadFieldClientComponent } from 'payload'

/**
 * Remount upload after save so cover thumbnail reflects the persisted value
 * (form merge can leave Upload internal preview stale until full page reload).
 */
const GalleryCoverUploadField: UploadFieldClientComponent = (props) => {
  const updatedAt = useFormFields(([fields]) => fields.updatedAt?.value)
  return <UploadField key={String(updatedAt ?? 'new')} {...props} />
}

export default GalleryCoverUploadField
