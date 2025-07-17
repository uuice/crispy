import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from './http.service'

export interface Comment {
  id: number
  title: string
  content: string
  user_id: number
  parent_id?: number
  status: number
  good_article: number
  bad_article: number
  not_article: number
  create_time: number
  update_time: number
  is_delete: number
  // Joined fields
  author_name?: string
  author_email?: string
  author_avatar?: string
  parent_content?: string
}

export interface CommentFilters {
  content?: string
  title?: string
  user_id?: number
  parent_id?: number
  status?: number
  start_time?: number
  end_time?: number
}

export interface CreateCommentData {
  title: string
  content: string
  user_id: number
  parent_id?: number
  status?: number
  good_article?: number
  bad_article?: number
  not_article?: number
}

export interface UpdateCommentData {
  title?: string
  content?: string
  status?: number
  good_article?: number
  bad_article?: number
  not_article?: number
}

export interface PaginatedCommentsResult {
  success: boolean
  message: string
  data: {
    dataList: Comment[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
}

export interface CommentStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpService) {}

  // Get comments with pagination and filters
  getComments(
    pagination: { page: number; pageSize: number },
    filters: CommentFilters
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
    if (filters.start_time) params.start_time = filters.start_time.toString()
    if (filters.end_time) params.end_time = filters.end_time.toString()

    return this.http.get<PaginatedCommentsResult>('/api/admin/comments', params)
  }

  // Get single comment by ID
  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`/api/admin/comments/${id}`)
  }

  // Create new comment
  createComment(data: CreateCommentData): Observable<Comment> {
    return this.http.post<Comment>('/api/admin/comments', data)
  }

  // Update comment
  updateComment(
    id: number,
    data: UpdateCommentData
  ): Observable<{ data: { updatedRows: number } }> {
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
  getStatusSeverity(status: number): string {
    switch (status) {
      case 20:
        return 'success'
      case 10:
        return 'warning'
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
