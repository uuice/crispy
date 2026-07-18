import type { FrontendThemePages } from '@/themes/types'

import { categoryDetailPage } from './categoryDetail'
import { galleriesPage } from './galleries'
import { galleryDetailPage } from './galleryDetail'
import { gamesMathPage } from './gamesMath'
import { gamesPage } from './games'
import { homePage } from './home'
import { jobsPage } from './jobs'
import { linksPage } from './links'
import { navigationsPage } from './navigations'
import { novelChapterPage } from './novelChapter'
import { novelCategoryDetailPage } from './novelCategoryDetail'
import { novelDetailPage } from './novelDetail'
import { novelTagDetailPage } from './novelTagDetail'
import { novelsPage } from './novels'
import { notFoundPage } from './notFound'
import { pageDetailPage } from './pageDetail'
import { postDetailPage } from './postDetail'
import { postsPage } from './posts'
import { serverErrorPage } from './serverError'
import { tagDetailPage } from './tagDetail'
import { userDetailPage } from './userDetail'

export const blogPages = {
  home: homePage,
  posts: postsPage,
  postDetail: postDetailPage,
  pageDetail: pageDetailPage,
  categoryDetail: categoryDetailPage,
  tagDetail: tagDetailPage,
  userDetail: userDetailPage,
  links: linksPage,
  galleries: galleriesPage,
  galleryDetail: galleryDetailPage,
  jobs: jobsPage,
  navigations: navigationsPage,
  games: gamesPage,
  gamesMath: gamesMathPage,
  novels: novelsPage,
  novelDetail: novelDetailPage,
  novelChapter: novelChapterPage,
  novelCategoryDetail: novelCategoryDetailPage,
  novelTagDetail: novelTagDetailPage,
  notFound: notFoundPage,
  serverError: serverErrorPage,
} satisfies FrontendThemePages
