import { NextFunction, Request, Response } from 'express'
import { handleError, success } from '../utils/response'
import { articleService } from '@src/server/services/articleService'
import { userService } from '@src/server/services/userService'
import { categoryService } from '@src/server/services/categoryService'

export const getDashboardOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalPosts = await articleService.countArticles()
    const totalUsers = await userService.countUsers()
    const totalViews = await articleService.sumArticleViews()

    const postsChange = 12
    const viewsChange = 8
    const usersChange = 5

    const visitorsTrend = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [1200, 1900, 1500, 2100, 1800, 2400]
    }

    const categories = await categoryService.getAllCategories()
    const categoryLabels = categories.map((c: any) => c.title)
    const categoryCounts = await Promise.all(
      categories.map((c: any) => articleService.countArticlesByCategoryId(c.id))
    )

    const recentPosts = await articleService.getRecentArticles(5)

    success(res, {
      stats: {
        totalPosts,
        totalViews,
        totalUsers,
        postsChange,
        viewsChange,
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
