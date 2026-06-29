import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'

const defaultCollectionLabels = {
  posts: {
    plural: frontendLabels.posts.plural,
    singular: frontendLabels.posts.singular,
  },
}

export const PageRange: React.FC<{
  className?: string
  collection?: keyof typeof defaultCollectionLabels
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const { plural, singular } =
    collectionLabelsFromProps ||
    (collection ? defaultCollectionLabels[collection] : undefined) || {
      plural: frontendLabels.posts.plural,
      singular: frontendLabels.posts.singular,
    }

  const unit = totalDocs > 1 ? plural : singular

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && frontendLabels.pagination.empty}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        frontendLabels.pagination.range(indexStart, indexEnd, totalDocs, unit)}
    </div>
  )
}
