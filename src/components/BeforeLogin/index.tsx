import React from 'react'

import './index.scss'

const BeforeLogin: React.FC = () => {
  return (
    <div className="before-login">
      <p className="before-login__title">欢迎使用 Crispy CMS</p>
      <p className="before-login__text">登录后即可管理内容、站点配置与 MCP 集成。</p>
    </div>
  )
}

export default BeforeLogin
