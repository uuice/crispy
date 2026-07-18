'use client'

import React from 'react'
import { JoinField, useFormFields } from '@payloadcms/ui'
import type { JoinFieldClientComponent } from 'payload'

/**
 * Join RelationshipTable only loads on mount. Bulk-create in afterChange does not
 * remount it, so remount when updatedAt changes after save.
 */
const GalleryItemsJoinField: JoinFieldClientComponent = (props) => {
  const updatedAt = useFormFields(([fields]) => fields.updatedAt?.value)
  return <JoinField key={String(updatedAt ?? 'new')} {...props} />
}

export default GalleryItemsJoinField
