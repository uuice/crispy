import type { FrontendThemePages } from '@/themes/types'

import { categoryDetailPage } from './categoryDetail'
import { galleryItemsPage } from './galleryItems'
import { gamesMathPage } from './gamesMath'
import { gamesPage } from './games'
import { homePage } from './home'
import { jobsPage } from './jobs'
import { linksPage } from './links'
import { navigationsPage } from './navigations'
import { notFoundPage } from './notFound'
import { pageDetailPage } from './pageDetail'
import { postDetailPage } from './postDetail'
import { postsPage } from './posts'
import { serverErrorPage } from './serverError'
import { tagDetailPage } from './tagDetail'
import { userDetailPage } from './userDetail'

export const cmsPages = {
  home: homePage,
  posts: postsPage,
  postDetail: postDetailPage,
  pageDetail: pageDetailPage,
  categoryDetail: categoryDetailPage,
  tagDetail: tagDetailPage,
  userDetail: userDetailPage,
  links: linksPage,
  galleryItems: galleryItemsPage,
  jobs: jobsPage,
  navigations: navigationsPage,
  games: gamesPage,
  gamesMath: gamesMathPage,
  notFound: notFoundPage,
  serverError: serverErrorPage,
} satisfies FrontendThemePages
