import React from 'react'

import { getNovelTagPath } from '@/utilities/frontendPaths'

import type { NovelTagDetailPageData } from '../pages/novelTagDetail'
import { NovelTaxonomyDetailView } from './NovelTaxonomyDetailView'

type Props = {
  data: NovelTagDetailPageData
}

export function NovelTagDetailView({ data }: Props) {
  return (
    <NovelTaxonomyDetailView
      basePath={getNovelTagPath(data.tag.slug || '')}
      emptyMessage="该标签下暂无小说"
      novels={data.novels}
      pagination={data.pagination}
      subtitle={data.tag.description || '小说标签归档'}
      title={`小说标签: ${data.tag.title}`}
    />
  )
}
