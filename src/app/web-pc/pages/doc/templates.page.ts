import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { TabsModule } from 'primeng/tabs'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { DividerModule } from 'primeng/divider'
import { PanelModule } from 'primeng/panel'
import { AccordionModule } from 'primeng/accordion'
import { TagModule } from 'primeng/tag'
import { BadgeModule } from 'primeng/badge'
import { RippleModule } from 'primeng/ripple'
import { ChipModule } from 'primeng/chip'
import { ScrollPanelModule } from 'primeng/scrollpanel'
import { StyleClassModule } from 'primeng/styleclass'
import { MessageModule } from 'primeng/message'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'cs-doc-templates',
  standalone: true,
  imports: [
    CardModule,
    TabsModule,
    TableModule,
    ButtonModule,
    DividerModule,
    PanelModule,
    AccordionModule,
    TagModule,
    BadgeModule,
    RippleModule,
    ChipModule,
    ScrollPanelModule,
    StyleClassModule,
    MessageModule,
    InputTextModule,
    FormsModule,
    CommonModule
  ],
  template: `
    <div class="templates-container">
      <p-card header="React JSX 模版引擎" styleClass="main-card">
        <div class="header-content">
          <p-message severity="info" text="使用 React 语法编写组件，支持状态管理和事件处理"></p-message>
        </div>

        <p-tabs value="0" [scrollable]="true">
          <p-tablist>
            <p-tab value="0">
              <i class="pi pi-code mr-2"></i>JSX 组件
            </p-tab>
            <p-tab value="1">
              <i class="pi pi-function mr-2"></i>工具函数
            </p-tab>
            <p-tab value="2">
              <i class="pi pi-exchange mr-2"></i>Express API服务集成
            </p-tab>
            <p-tab value="3">
              <i class="pi pi-server mr-2"></i>Express直接服务集成
            </p-tab>
          </p-tablist>

          <p-tabpanels>
            <p-tabpanel value="0">
              <div class="tabpanel-content">
                <p-panel header="React JSX 基础" [toggleable]="true" styleClass="feature-panel">
                  <div class="panel-content">
                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">组件定义</h4>
                        <p-chip label="核心概念" styleClass="primary-chip"></p-chip>
                      </div>
                      <p-message severity="success" text="使用 React hooks 进行状态管理，如 useState, useEffect 等"></p-message>
                    </div>

                    <p-divider></p-divider>

                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">属性传递</h4>
                        <p-chip label="Props" styleClass="primary-chip"></p-chip>
                      </div>
                      <p-message severity="success" text="通过 props 向组件传递数据，支持字符串、数字、对象等类型"></p-message>
                    </div>
                  </div>
                </p-panel>
              </div>
            </p-tabpanel>

            <p-tabpanel value="1">
              <div class="tabpanel-content">
                <p-panel header="常用工具函数" [toggleable]="true" styleClass="feature-panel">
                  <div class="panel-content">
                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">日期处理</h4>
                        <p-chip label="日期格式化" styleClass="primary-chip"></p-chip>
                      </div>
                      <div class="code-block">
                        <p-message severity="info" text="import { formatDate } from '@/utils/date'"></p-message>
                        <p-message severity="info" text="import { dateFormat } from '@/utils/dateFormat'"></p-message>
                      </div>
                    </div>

                    <p-divider></p-divider>

                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">文本处理</h4>
                        <p-chip label="字符串操作" styleClass="primary-chip"></p-chip>
                      </div>
                      <div class="code-block">
                        <p-message severity="info" text="import { truncate } from '@/utils/truncate'"></p-message>
                        <p-message severity="info" text="import { shorten } from '@/utils/shorten'"></p-message>
                        <p-message severity="info" text="import { stripHtml } from '@/utils/stripHtml'"></p-message>
                      </div>
                    </div>

                    <p-divider></p-divider>

                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">其他工具</h4>
                        <p-chip label="辅助函数" styleClass="primary-chip"></p-chip>
                      </div>
                      <div class="code-block">
                        <p-message severity="info" text="import { titleToUrl } from '@/utils/titleToUrl'"></p-message>
                        <p-message severity="info" text="import { getColor } from '@/utils/getColor'"></p-message>
                        <p-message severity="info" text="import { markdown } from '@/utils/markdown'"></p-message>
                      </div>
                    </div>
                  </div>
                </p-panel>
              </div>
            </p-tabpanel>

            <p-tabpanel value="2">
              <div class="tabpanel-content">
                <p-panel header="Express API 服务集成" [toggleable]="true" styleClass="feature-panel">
                  <div class="panel-content">
                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">中间件配置</h4>
                        <p-badge value="API框架" severity="contrast"></p-badge>
                      </div>
                      <p-message severity="info" text="基于 Express 框架的 RESTful API 接口，支持标准的 HTTP 方法和现代化的 API 设计规范"></p-message>
                    </div>

                    <p-divider></p-divider>

                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">路由结构</h4>
                        <p-badge value="31个路由" severity="contrast"></p-badge>
                      </div>
                      <div class="grid grid-nogutter">
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="文章与内容管理" styleClass="category-panel">
                            <ul class="route-list">
                              <li class="route-item">
                                <i class="pi pi-file text-primary mr-2"></i>
                                <span class="font-medium">文章路由:</span>
                                <p-tag value="/api/articles/*" severity="info" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="route-item">
                                <i class="pi pi-book text-primary mr-2"></i>
                                <span class="font-medium">页面路由:</span>
                                <p-tag value="/api/pages/*" severity="info" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="route-item">
                                <i class="pi pi-comments text-primary mr-2"></i>
                                <span class="font-medium">评论路由:</span>
                                <p-tag value="/api/comments/*" severity="info" styleClass="ml-auto"></p-tag>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="分类与标签" styleClass="category-panel">
                            <ul class="route-list">
                              <li class="route-item">
                                <i class="pi pi-tags text-green-600 mr-2"></i>
                                <span class="font-medium">分类路由:</span>
                                <p-tag value="/api/categories/*" severity="success" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="route-item">
                                <i class="pi pi-tag text-green-600 mr-2"></i>
                                <span class="font-medium">标签路由:</span>
                                <p-tag value="/api/tags/*" severity="success" styleClass="ml-auto"></p-tag>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="用户与权限" styleClass="category-panel">
                            <ul class="route-list">
                              <li class="route-item">
                                <i class="pi pi-user text-blue-600 mr-2"></i>
                                <span class="font-medium">用户路由:</span>
                                <p-tag value="/api/users/*" severity="warn" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="route-item">
                                <i class="pi pi-shield text-blue-600 mr-2"></i>
                                <span class="font-medium">角色路由:</span>
                                <p-tag value="/api/roles/*" severity="warn" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="route-item">
                                <i class="pi pi-key text-blue-600 mr-2"></i>
                                <span class="font-medium">权限路由:</span>
                                <p-tag value="/api/rules/*" severity="warn" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="route-item">
                                <i class="pi pi-lock text-blue-600 mr-2"></i>
                                <span class="font-medium">访问令牌路由:</span>
                                <p-tag value="/api/accessTokens/*" severity="warn" styleClass="ml-auto"></p-tag>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="系统管理" styleClass="category-panel">
                            <ul class="route-list">
                              <li class="route-item">
                                <i class="pi pi-cog text-purple-600 mr-2"></i>
                                <span class="font-medium">配置路由:</span>
                                <p-tag value="/api/config/*" severity="contrast" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="route-item">
                                <i class="pi pi-bars text-purple-600 mr-2"></i>
                                <span class="font-medium">菜单路由:</span>
                                <p-tag value="/api/menus/*" severity="contrast" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="route-item">
                                <i class="pi pi-users text-purple-600 mr-2"></i>
                                <span class="font-medium">用户类型路由:</span>
                                <p-tag value="/api/userTypes/*" severity="contrast" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="route-item">
                                <i class="pi pi-desktop text-purple-600 mr-2"></i>
                                <span class="font-medium">站点设置路由:</span>
                                <p-tag value="/api/site-settings/*" severity="contrast" styleClass="ml-auto"></p-tag>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                      </div>
                    </div>

                    <p-divider></p-divider>

                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">调用方式</h4>
                        <p-badge value="HTTP方法" severity="contrast"></p-badge>
                      </div>
                      <div class="grid grid-nogutter">
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="GET 请求" styleClass="method-panel">
                            <ul class="method-list">
                              <li class="method-item">
                                <i class="pi pi-download text-green-600 mr-2"></i>
                                <span>/api/articles - 获取文章列表</span>
                              </li>
                              <li class="method-item">
                                <i class="pi pi-download text-green-600 mr-2"></i>
                                <span>/api/articles/:id - 获取指定文章</span>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="POST 请求" styleClass="method-panel">
                            <ul class="method-list">
                              <li class="method-item">
                                <i class="pi pi-plus text-blue-600 mr-2"></i>
                                <span>/api/articles - 创建新文章</span>
                              </li>
                              <li class="method-item">
                                <i class="pi pi-plus text-blue-600 mr-2"></i>
                                <span>/api/articles/batch - 批量创建</span>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="PUT 请求" styleClass="method-panel">
                            <ul class="method-list">
                              <li class="method-item">
                                <i class="pi pi-pencil text-orange-600 mr-2"></i>
                                <span>/api/articles/:id - 更新指定文章</span>
                              </li>
                              <li class="method-item">
                                <i class="pi pi-pencil text-orange-600 mr-2"></i>
                                <span>/api/articles/:id/publish - 发布文章</span>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="DELETE 请求" styleClass="method-panel">
                            <ul class="method-list">
                              <li class="method-item">
                                <i class="pi pi-trash text-red-600 mr-2"></i>
                                <span>/api/articles/:id - 删除指定文章</span>
                              </li>
                              <li class="method-item">
                                <i class="pi pi-trash text-red-600 mr-2"></i>
                                <span>/api/articles/batch - 批量删除</span>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                      </div>
                    </div>
                  </div>
                </p-panel>
              </div>
            </p-tabpanel>

            <p-tabpanel value="3">
              <div class="tabpanel-content">
                <p-panel header="Express 直接服务集成" [toggleable]="true" styleClass="feature-panel">
                  <div class="panel-content">
                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">服务文件结构</h4>
                        <p-badge value="31个服务" severity="contrast"></p-badge>
                      </div>
                      <p-message severity="info" text="项目服务代码位于 /src/server/services 目录下，包含独立的普通服务模块，支持直接导入调用"></p-message>
                    </div>

                    <p-divider></p-divider>

                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">服务分类</h4>
                        <p-chip label="模块化设计" styleClass="primary-chip"></p-chip>
                      </div>
                      <div class="grid grid-nogutter">
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="内容管理服务" styleClass="category-panel">
                            <ul class="service-list">
                              <li class="service-item">
                                <i class="pi pi-file text-primary mr-2"></i>
                                <span class="font-medium">文章服务</span>
                                <p-tag value="articleService.ts" severity="info" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="service-item">
                                <i class="pi pi-book text-primary mr-2"></i>
                                <span class="font-medium">页面服务</span>
                                <p-tag value="pageService.ts" severity="info" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="service-item">
                                <i class="pi pi-comments text-primary mr-2"></i>
                                <span class="font-medium">评论服务</span>
                                <p-tag value="commentService.ts" severity="info" styleClass="ml-auto"></p-tag>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="分类与标签服务" styleClass="category-panel">
                            <ul class="service-list">
                              <li class="service-item">
                                <i class="pi pi-folder text-green-600 mr-2"></i>
                                <span class="font-medium">分类服务</span>
                                <p-tag value="categoryService.ts" severity="success" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="service-item">
                                <i class="pi pi-tag text-green-600 mr-2"></i>
                                <span class="font-medium">标签服务</span>
                                <p-tag value="tagService.ts" severity="success" styleClass="ml-auto"></p-tag>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="用户与权限服务" styleClass="category-panel">
                            <ul class="service-list">
                              <li class="service-item">
                                <i class="pi pi-user text-blue-600 mr-2"></i>
                                <span class="font-medium">用户服务</span>
                                <p-tag value="userService.ts" severity="warn" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="service-item">
                                <i class="pi pi-shield text-blue-600 mr-2"></i>
                                <span class="font-medium">角色服务</span>
                                <p-tag value="roleService.ts" severity="warn" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="service-item">
                                <i class="pi pi-key text-blue-600 mr-2"></i>
                                <span class="font-medium">权限服务</span>
                                <p-tag value="ruleService.ts" severity="warn" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="service-item">
                                <i class="pi pi-lock text-blue-600 mr-2"></i>
                                <span class="font-medium">访问令牌服务</span>
                                <p-tag value="accessToken.Service.ts" severity="warn" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="service-item">
                                <i class="pi pi-id-card text-blue-600 mr-2"></i>
                                <span class="font-medium">用户类型服务</span>
                                <p-tag value="userTypeService.ts" severity="warn" styleClass="ml-auto"></p-tag>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="系统管理服务" styleClass="category-panel">
                            <ul class="service-list">
                              <li class="service-item">
                                <i class="pi pi-sliders-h text-purple-600 mr-2"></i>
                                <span class="font-medium">配置服务</span>
                                <p-tag value="configService.ts" severity="contrast" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="service-item">
                                <i class="pi pi-bars text-purple-600 mr-2"></i>
                                <span class="font-medium">菜单服务</span>
                                <p-tag value="menuService.ts" severity="contrast" styleClass="ml-auto"></p-tag>
                              </li>
                              <li class="service-item">
                                <i class="pi pi-desktop text-purple-600 mr-2"></i>
                                <span class="font-medium">站点设置服务</span>
                                <p-tag value="siteSettingsService.ts" severity="contrast" styleClass="ml-auto"></p-tag>
                              </li>
                            </ul>
                          </p-panel>
                        </div>
                      </div>
                    </div>

                    <p-divider></p-divider>

                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">服务方法规范</h4>
                        <p-badge value="标准化" severity="contrast"></p-badge>
                        <p-badge value="TypeScript" severity="contrast"></p-badge>
                      </div>
                      <div class="grid grid-nogutter">
                        <div class="col-12">
                          <p-panel header="统一方法规范" styleClass="method-panel">
                            <div class="grid grid-nogutter">
                              <div class="col-12 md:col-6 lg:col-4 mb-3">
                                <div class="method-card">
                                  <div class="method-header bg-green-100">
                                    <i class="pi pi-plus-circle text-green-700 text-xl"></i>
                                    <h5 class="m-0 text-green-800 font-bold">create(data)</h5>
                                  </div>
                                  <div class="method-body">
                                    <p class="m-0 text-green-700">创建新记录</p>
                                    <div class="method-example mt-2">
                                      <p-message severity="info" text="await service.create(data)"></p-message>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 md:col-6 lg:col-4 mb-3">
                                <div class="method-card">
                                  <div class="method-header bg-blue-100">
                                    <i class="pi pi-search text-blue-700 text-xl"></i>
                                    <h5 class="m-0 text-blue-800 font-bold">getById(id)</h5>
                                  </div>
                                  <div class="method-body">
                                    <p class="m-0 text-blue-700">根据ID获取单条记录</p>
                                    <div class="method-example mt-2">
                                      <p-message severity="info" text="await service.getById(id)"></p-message>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 md:col-6 lg:col-4 mb-3">
                                <div class="method-card">
                                  <div class="method-header bg-purple-100">
                                    <i class="pi pi-list text-purple-700 text-xl"></i>
                                    <h5 class="m-0 text-purple-800 font-bold">getList(filters, options)</h5>
                                  </div>
                                  <div class="method-body">
                                    <p class="m-0 text-purple-700">分页获取记录列表</p>
                                    <div class="method-example mt-2">
                                      <p-message severity="info" text="await service.getList(filters, pagination)"></p-message>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 md:col-6 lg:col-4 mb-3">
                                <div class="method-card">
                                  <div class="method-header bg-orange-100">
                                    <i class="pi pi-pencil text-orange-700 text-xl"></i>
                                    <h5 class="m-0 text-orange-800 font-bold">update(id, data)</h5>
                                  </div>
                                  <div class="method-body">
                                    <p class="m-0 text-orange-700">更新指定记录</p>
                                    <div class="method-example mt-2">
                                      <p-message severity="info" text="await service.update(id, data)"></p-message>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 md:col-6 lg:col-4 mb-3">
                                <div class="method-card">
                                  <div class="method-header bg-red-100">
                                    <i class="pi pi-trash text-red-700 text-xl"></i>
                                    <h5 class="m-0 text-red-800 font-bold">delete(id)</h5>
                                  </div>
                                  <div class="method-body">
                                    <p class="m-0 text-red-700">删除指定记录（软删除）</p>
                                    <div class="method-example mt-2">
                                      <p-message severity="info" text="await service.delete(id)"></p-message>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </p-panel>
                        </div>
                        <div class="col-12">
                          <p-panel header="核心特性保障" styleClass="method-panel mt-3">
                            <div class="grid grid-nogutter">
                              <div class="col-12 md:col-6 lg:col-3 mb-3">
                                <div class="feature-card bg-gradient-to-r from-green-50 to-emerald-50 h-full">
                                  <div class="flex align-items-center mb-3">
                                    <i class="pi pi-shield text-green-600 text-xl mr-2"></i>
                                    <h5 class="m-0 text-green-800 font-bold">类型安全</h5>
                                    <span class="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 border-round">✓</span>
                                  </div>
                                  <p class="m-0 text-sm text-green-700">完整的 TypeScript 类型定义，编译时错误检查</p>
                                </div>
                              </div>
                              <div class="col-12 md:col-6 lg:col-3 mb-3">
                                <div class="feature-card bg-gradient-to-r from-blue-50 to-cyan-50 h-full">
                                  <div class="flex align-items-center mb-3">
                                    <i class="pi pi-exclamation-triangle text-blue-600 text-xl mr-2"></i>
                                    <h5 class="m-0 text-blue-800 font-bold">错误处理</h5>
                                    <span class="ml-auto text-xs bg-blue-200 text-blue-800 px-2 py-1 border-round">✓</span>
                                  </div>
                                  <p class="m-0 text-sm text-blue-700">统一的错误处理机制，优雅的异常捕获</p>
                                </div>
                              </div>
                              <div class="col-12 md:col-6 lg:col-3 mb-3">
                                <div class="feature-card bg-gradient-to-r from-purple-50 to-violet-50 h-full">
                                  <div class="flex align-items-center mb-3">
                                    <i class="pi pi-check-square text-purple-600 text-xl mr-2"></i>
                                    <h5 class="m-0 text-purple-800 font-bold">数据验证</h5>
                                    <span class="ml-auto text-xs bg-purple-200 text-purple-800 px-2 py-1 border-round">✓</span>
                                  </div>
                                  <p class="m-0 text-sm text-purple-700">严格的输入数据验证，防止无效数据入库</p>
                                </div>
                              </div>
                              <div class="col-12 md:col-6 lg:col-3 mb-3">
                                <div class="feature-card bg-gradient-to-r from-orange-50 to-amber-50 h-full">
                                  <div class="flex align-items-center mb-3">
                                    <i class="pi pi-bolt text-orange-600 text-xl mr-2"></i>
                                    <h5 class="m-0 text-orange-800 font-bold">性能优化</h5>
                                    <span class="ml-auto text-xs bg-orange-200 text-orange-800 px-2 py-1 border-round">✓</span>
                                  </div>
                                  <p class="m-0 text-sm text-orange-700">高效的数据库查询优化，支持索引和缓存</p>
                                </div>
                              </div>
                            </div>
                          </p-panel>
                        </div>
                      </div>
                    </div>

                    <p-divider></p-divider>

                    <div class="feature-section">
                      <div class="section-header">
                        <h4 class="section-title">服务调用方式</h4>
                        <p-badge value="Node.js" severity="contrast"></p-badge>
                        <p-badge value="TypeScript" severity="contrast"></p-badge>
                      </div>
                      <div class="grid grid-nogutter">
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="基础导入" styleClass="call-panel">
                            <div class="call-content">
                              <p-message severity="info" text="import { articleService } from '@/server/services/articleService'"></p-message>
                            </div>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="创建操作" styleClass="call-panel">
                            <div class="call-content">
                              <p-message severity="success" text="const result = await articleService.create(articleData)"></p-message>
                            </div>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="查询操作" styleClass="call-panel">
                            <div class="call-content">
                              <p-message severity="success" text="const article = await articleService.getById(id)"></p-message>
                            </div>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="更新操作" styleClass="call-panel">
                            <div class="call-content">
                              <p-message severity="success" text="const updated = await articleService.update(id, updateData)"></p-message>
                            </div>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="删除操作" styleClass="call-panel">
                            <div class="call-content">
                              <p-message severity="warn" text="const success = await articleService.delete(id)"></p-message>
                            </div>
                          </p-panel>
                        </div>
                        <div class="col-12 md:col-6 mb-3">
                          <p-panel header="列表查询" styleClass="call-panel">
                            <div class="call-content">
                              <p-message severity="success" text="const articles = await articleService.getList(filters, pagination)"></p-message>
                            </div>
                          </p-panel>
                        </div>
                      </div>
                    </div>
                  </div>
                </p-panel>
              </div>
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>
      </p-card>
    </div>
  `,
  styles: [
    `
      .templates-container {
        padding: 1rem;
        background: var(--p-content-background);
        min-height: 100vh;
      }

      .main-card {
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .header-content {
        margin-bottom: 1.5rem;
      }

      .tabpanel-content {
        padding: 1rem 0;
      }

      .feature-panel {
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .panel-content {
        padding: 1rem;
      }

      .feature-section {
        margin-bottom: 1.5rem;
      }

      .feature-section:last-child {
        margin-bottom: 0;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .section-title {
        margin: 0;
        color: var(--p-primary-color);
        font-weight: 600;
        font-size: 1.25rem;
        letter-spacing: 0.5px;
      }

      .primary-chip {
        background: var(--p-primary-color);
        color: var(--p-primary-contrast-color);
      }

      .code-block {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .table-container {
        overflow-x: auto;
        margin-top: 1rem;
      }

      .service-table {
        width: 100%;
      }

      .method-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
      }

      .method-tag {
        font-size: 0.75rem;
        padding: 0.125rem 0.5rem;
      }

      .category-panel {
        height: 100%;
        border-radius: 6px;
      }

      .route-list,
      .service-list,
      .method-list,
      .standard-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .route-item,
      .service-item,
      .method-item,
      .standard-item {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        border-radius: 4px;
        background: var(--p-content-background);
        border: 1px solid var(--p-content-border-color);
        height: 3rem;
      }

      .route-item:last-child,
      .service-item:last-child,
      .method-item:last-child,
      .standard-item:last-child {
        margin-bottom: 0;
      }

      .method-panel {
        border-radius: 8px;
      }

      .method-card {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        height: 100%;
      }

      .method-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      }

      .method-header {
        padding: 1rem;
        text-align: center;
        border-bottom: 1px solid var(--p-content-border-color);
      }

      .method-header h5 {
        margin-top: 0.5rem;
        font-size: 1.1rem;
        letter-spacing: 0.3px;
      }

      .method-body {
        padding: 1rem;
        background: var(--p-content-background);
      }

      .method-example {
        margin-top: 0.75rem;
      }

      .feature-card {
        padding: 1.25rem;
        border-radius: 8px;
        border: 1px solid var(--p-content-border-color);
        height: 100%;
        transition: all 0.3s ease;
      }

      .feature-card h5 {
        font-size: 1.1rem;
        letter-spacing: 0.3px;
        margin-bottom: 0.75rem;
      }

      .feature-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .call-panel {
        border-radius: 8px;
        height: 100%;
      }

      .call-content {
        padding: 1rem;
      }

      .mt-3 {
        margin-top: 1rem;
      }
    `
  ]
})
export class DocTemplatesPage {}
