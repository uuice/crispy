import { NextFunction, Request, Response } from 'express'
import { handleError, success } from '../utils/response'
import { articleService } from '@src/server/services/articleService'
import { userService } from '@src/server/services/userService'
import { commentService } from '@src/server/services/commentService'
import { categoryService } from '@src/server/services/categoryService'

export const getDashboardOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 统计数据
    const totalPosts = await articleService.countArticles()
    const totalUsers = await userService.countUsers()
    const totalComments = await commentService.countCommentsByStatus()
    const totalViews = await articleService.sumArticleViews()

    // 环比变化（演示数据）
    const postsChange = 12
    const viewsChange = 8
    const commentsChange = -3
    const usersChange = 5

    // 访问趋势（演示数据）
    const visitorsTrend = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [1200, 1900, 1500, 2100, 1800, 2400]
    }

    // 分类分布
    const categories = await categoryService.getAllCategories()
    const categoryLabels = categories.map((c: any) => c.title)
    const categoryCounts = await Promise.all(
      categories.map((c: any) => articleService.countArticlesByCategoryId(c.id))
    )

    // 最新文章
    const recentPosts = await articleService.getRecentArticles(5)

    success(res, {
      stats: {
        totalPosts,
        totalViews,
        totalComments,
        totalUsers,
        postsChange,
        viewsChange,
        commentsChange,
        usersChange
      },
      visitorsTrend,
      categoryDistribution: {
        labels: categoryLabels,
        data: categoryCounts
      },
      recentPosts: recentPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        author: post.author || post.author_name || '未知',
        date: post.create_time ? new Date(post.create_time).toISOString().slice(0, 10) : '',
        status: post.status || '未知',
        click: post.click || 0
      }))
    })
  } catch (err: unknown) {
    handleError(res, err, 'getDashboardOverview')
  }
}

export const dashboardController = {
  getDashboardOverview
}
