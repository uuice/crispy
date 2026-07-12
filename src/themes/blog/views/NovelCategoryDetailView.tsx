import React from 'react'

import { getNovelCategoryPath } from '@/utilities/frontendPaths'

import type { NovelCategoryDetailPageData } from '../pages/novelCategoryDetail'
import { NovelTaxonomyDetailView } from './NovelTaxonomyDetailView'

type Props = {
  data: NovelCategoryDetailPageData
}

export function NovelCategoryDetailView({ data }: Props) {
  return (
    <NovelTaxonomyDetailView
      basePath={getNovelCategoryPath(data.category.slug || '')}
      emptyMessage="该分类下暂无小说"
      novels={data.novels}
      pagination={data.pagination}
      subtitle="小说分类归档"
      title={`小说分类: ${data.category.title}`}
    />
  )
}
