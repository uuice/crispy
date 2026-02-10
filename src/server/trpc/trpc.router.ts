import { initTRPC } from '@trpc/server'
import { createContext } from './context'
import { authRouter } from './routers/auth'
import { userRouter } from './routers/user'
import { categoryRouter } from './routers/category'
import { tagRouter } from './routers/tag'
import { articleRouter } from './routers/article'
import { commentRouter } from './routers/comment'
import { configRouter } from './routers/config'
import { linkRouter } from './routers/link'
import { menuRouter } from './routers/menu'
import { pageRouter } from './routers/page'
import { adRouter } from './routers/ad'
import { adItemRouter } from './routers/adItem'
import { roleRouter } from './routers/role'
import { ruleRouter } from './routers/rule'
import { userTypeRouter } from './routers/userType'
import { attrRouter } from './routers/attr'
import { cacheRouter } from './routers/cache'
import { enumRouter } from './routers/enum'
import { holidayRouter } from './routers/holiday'
import { jobRouter } from './routers/job'
import { keywordRouter } from './routers/keyword'
import { noticeRouter } from './routers/notice'
import { operateLogRouter } from './routers/operateLog'
import { apiLogRouter } from './routers/apiLog'
import { accessTokenRouter } from './routers/accessToken'
import { contentRouter } from './content.router'

const t = initTRPC.context<typeof createContext>().create()

// 包含所有模块的完整路由
export const appRouter = t.router({
  // 认证相关路由
  auth: authRouter,
  // 用户相关模块
  user: userRouter,
  // 分类相关模块
  category: categoryRouter,
  // 标签相关模块
  tag: tagRouter,
  // article相关模块
  article: articleRouter,
  // comment相关模块
  comment: commentRouter,
  // config相关模块
  config: configRouter,
  // link相关模块
  link: linkRouter,
  // menu相关模块
  menu: menuRouter,
  // page相关模块
  page: pageRouter,
  // ad相关模块
  ad: adRouter,
  // adItem相关模块
  adItem: adItemRouter,
  // role相关模块
  role: roleRouter,
  // rule相关模块
  rule: ruleRouter,
  // userType相关模块
  userType: userTypeRouter,
  // attr相关模块
  attr: attrRouter,
  // cache相关模块
  cache: cacheRouter,
  // enum相关模块
  enum: enumRouter,
  // holiday相关模块
  holiday: holidayRouter,
  // job相关模块
  job: jobRouter,
  // keyword相关模块
  keyword: keywordRouter,
  // notice相关模块
  notice: noticeRouter,
  // operateLog相关模块
  operateLog: operateLogRouter,
  // apiLog相关模块
  apiLog: apiLogRouter,
  // accessToken相关模块
  accessToken: accessTokenRouter,
  // content相关模块
  content: contentRouter
})

// Export type definition of API
export type AppRouter = typeof appRouter
