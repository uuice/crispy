export type CollectionStatRow = {
  slug: string
  label: string
  adminGroup?: string
  trashEnabled: boolean
  draftsEnabled: boolean
  activeCount: number | null
  trashedCount: number | null
  totalCount: number | null
  draftCount: number | null
  publishedCount: number | null
  accessDenied: boolean
  error?: string
}

export type CollectionStatsSummary = {
  rows: CollectionStatRow[]
  generatedAt: string
  accessibleCollections: number
  deniedCollections: number
}
