import type { Comment } from '@/payload-types'

export type CommentTreeNode = Comment & {
  replies: CommentTreeNode[]
}

export function buildCommentTree(comments: Comment[], maxDepth: number): CommentTreeNode[] {
  const byId = new Map<number, CommentTreeNode>()

  for (const comment of comments) {
    byId.set(comment.id, { ...comment, replies: [] })
  }

  const roots: CommentTreeNode[] = []

  for (const comment of comments) {
    const node = byId.get(comment.id)
    if (!node) continue

    const parentId =
      typeof comment.parent === 'object' ? comment.parent?.id : comment.parent ?? null

    if (parentId && byId.has(parentId)) {
      const parent = byId.get(parentId)!
      const parentDepth = getDepth(parent, byId)
      if (parentDepth < maxDepth) {
        parent.replies.push(node)
        continue
      }
    }

    if (!parentId) {
      roots.push(node)
    }
  }

  const sortByDate = (a: CommentTreeNode, b: CommentTreeNode) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

  const sortTree = (nodes: CommentTreeNode[]) => {
    nodes.sort(sortByDate)
    for (const node of nodes) {
      sortTree(node.replies)
    }
  }

  sortTree(roots)
  return roots
}

function getDepth(node: CommentTreeNode, byId: Map<number, CommentTreeNode>): number {
  let depth = 1
  let current = node

  while (true) {
    const parentId =
      typeof current.parent === 'object' ? current.parent?.id : current.parent ?? null
    if (!parentId || !byId.has(parentId)) break
    depth += 1
    current = byId.get(parentId)!
  }

  return depth
}

export function getCommentAuthorName(comment: Comment): string {
  if (comment.author && typeof comment.author === 'object') {
    return comment.author.name?.trim() || comment.author.email || '用户'
  }
  return comment.guestName?.trim() || '访客'
}
