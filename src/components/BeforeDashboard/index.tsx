import { Banner } from '@payloadcms/ui/elements/Banner'
import { Link } from '@payloadcms/ui'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>欢迎使用 Crispy CMS</h4>
      </Banner>
      建议按以下步骤开始：
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' 填充示例页面、文章与演示账号，然后 '}
          <a href="/" target="_blank">
            访问前台
          </a>
          {' 查看效果。'}
        </li>
        <li>
          {'查看 '}
          <Link href="/admin/dev-docs" prefetch={false}>
            二次开发文档
          </Link>
          {'（技术栈、权限、AI、MCP、部署）。'}
        </li>
        <li>
          {'在 '}
          <strong>站点设置</strong>
          {' 中配置站点名称、Logo 与 RSS；在 '}
          <strong>MCP → API Keys</strong>
          {' 创建密钥供 AI Agent 使用。'}
        </li>
        <li>
          {'编辑文章时可使用 '}
          <strong>实时预览</strong>
          {' 与 '}
          <strong>草稿发布</strong>
          {' 工作流。'}
        </li>
      </ul>
      <p className={`${baseClass}__hint`}>
        可在右上角切换界面语言（中文 / English）与主题（浅色 / 深色）。
      </p>
    </div>
  )
}

export default BeforeDashboard
