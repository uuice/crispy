export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam'

export type CommentTargetType = 'post' | 'page'

export type ResolvedCommentSettings = {
  enabled: boolean
  requireModeration: boolean
  allowGuestComments: boolean
  maxDepth: number
  allowOnPosts: boolean
  allowOnPages: boolean
}

export type CommentAuthorInfo = {
  name: string
  isGuest: boolean
}
