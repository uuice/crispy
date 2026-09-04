import type { FrontendPages } from '@/frontend/types'

import { categoryDetailPage } from './categoryDetail'
import { galleriesPage } from './galleries'
import { galleryDetailPage } from './galleryDetail'
import { homePage } from './home'
import { linksPage } from './links'
import { navigationsPage } from './navigations'
import { notFoundPage } from './notFound'
import { pageDetailPage } from './pageDetail'
import { postDetailPage } from './postDetail'
import { postsPage } from './posts'
import { serverErrorPage } from './serverError'
import { tagDetailPage } from './tagDetail'
import { userDetailPage } from './userDetail'

export const pages = {
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
  navigations: navigationsPage,
  notFound: notFoundPage,
  serverError: serverErrorPage,
} satisfies FrontendPages
