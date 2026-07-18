import type { FrontendThemePages } from '@/themes/types'

import { categoryDetailPage } from './categoryDetail'
import { galleriesPage } from '../../blog/pages/galleries'
import { galleryDetailPage } from '../../blog/pages/galleryDetail'
import { gamesMathPage } from './gamesMath'
import { gamesPage } from './games'
import { homePage } from './home'
import { jobsPage } from './jobs'
import { linksPage } from './links'
import { navigationsPage } from './navigations'
import { novelChapterPage } from '../../blog/pages/novelChapter'
import { novelCategoryDetailPage } from '../../blog/pages/novelCategoryDetail'
import { novelDetailPage } from '../../blog/pages/novelDetail'
import { novelTagDetailPage } from '../../blog/pages/novelTagDetail'
import { novelsPage } from '../../blog/pages/novels'
import { notFoundPage } from './notFound'
import { pageDetailPage } from './pageDetail'
import { postDetailPage } from './postDetail'
import { postsPage } from './posts'
import { serverErrorPage } from './serverError'
import { tagDetailPage } from './tagDetail'
import { userDetailPage } from './userDetail'

export const kbPages = {
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
