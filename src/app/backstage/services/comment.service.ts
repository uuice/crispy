import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from './http.service'
import {
  CommentFilters,
  CommentWithAuthor,
  CreateComment,
  PaginatedResult,
  UpdateComment
} from '@src/types'

// Re-export for backward compatibility
export type Comment = CommentWithAuthor

export interface PaginatedCommentsResult {
  success: boolean
  message: string
  data: PaginatedResult<CommentWithAuthor>
}

export interface CommentStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

// Re-export types from index.ts for backward compatibility
export type CreateCommentData = CreateComment
export type UpdateCommentData = UpdateComment

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpService) {}

  // Get comments with pagination and filters
  getComments(
    pagination: { page: number; pageSize: number },
    filters: Partial<CommentFilters>
  ): Observable<PaginatedCommentsResult> {
    const params: any = {
      page: pagination.page.toString(),
      pageSize: pagination.pageSize.toString()
    }

    if (filters.content) params.content = filters.content
    if (filters.title) params.title = filters.title
    if (filters.user_id) params.user_id = filters.user_id.toString()
    if (filters.parent_id) {
      params.parent_id = filters.parent_id === null ? 'null' : filters.parent_id.toString()
    }
    if (filters.status) params.status = filters.status.toString()
    if (filters.create_time_start) params.start_time = filters.create_time_start.toString()
    if (filters.create_time_end) params.end_time = filters.create_time_end.toString()

    return this.http.get<PaginatedCommentsResult>('/api/admin/comments', params)
  }

  // Get single comment by ID
  getCommentById(id: number): Observable<CommentWithAuthor> {
    return this.http.get<CommentWithAuthor>(`/api/admin/comments/${id}`)
  }

  // Create new comment
  createComment(data: CreateComment): Observable<CommentWithAuthor> {
    return this.http.post<CommentWithAuthor>('/api/admin/comments', data)
  }

  // Update comment
  updateComment(id: number, data: UpdateComment): Observable<{ data: { updatedRows: number } }> {
    return this.http.put<{ data: { updatedRows: number } }>(`/api/admin/comments/${id}`, data)
  }

  // Delete comment
  deleteComment(id: number): Observable<{ data: { deletedRows: number } }> {
    return this.http.delete<{ data: { deletedRows: number } }>(`/api/admin/comments/${id}`)
  }

  // Batch update comment status
  batchUpdateStatus(ids: number[], status: number): Observable<{ data: { updatedCount: number } }> {
    return this.http.post<{ data: { updatedCount: number } }>(
      '/api/admin/comments/batch-update-status',
      {
        ids,
        status
      }
    )
  }

  // Batch delete comments
  batchDeleteComments(ids: number[]): Observable<{ data: { deletedCount: number } }> {
    return this.http.post<{ data: { deletedCount: number } }>('/api/admin/comments/batch-delete', {
      ids
    })
  }

  // Get comment statistics
  getCommentStats(): Observable<CommentStats> {
    return this.http.get<CommentStats>('/api/admin/comments/stats')
  }

  // Helper method to get status label
  getStatusLabel(status: number): string {
    switch (status) {
      case 10:
        return '待审核'
      case 20:
        return '已通过'
      case -10:
        return '已拒绝'
      case -20:
        return '垃圾评论'
      default:
        return '未知状态'
    }
  }

  // Helper method to get status severity for PrimeNG tag
  getStatusSeverity(status: number) {
    switch (status) {
      case 20:
        return 'success'
      case 10:
        return 'warn'
      case -10:
        return 'danger'
      case -20:
        return 'info'
      default:
        return 'info'
    }
  }

  // Helper method to format timestamp to Date
  formatTimestamp(timestamp: number): Date {
    return new Date(timestamp)
  }
}
