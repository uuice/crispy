// src/views/HomePage.tsx
import React from 'react'
import { linkService } from '../server/services/linkService'
import type { LinkWithType, PaginatedResult } from '../types'

interface HomePageProps {
  title: string
  message: string
}

export default async function HomePage({ title, message }: HomePageProps) {
  // 获取链接数据
  const linkResult= await linkService.getLinks({
    page: 1,
    pageSize: 10,
    status: 10  // 只获取启用的链接
  })

  return (
    <html>
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
          }
          .links-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
          .link-item {
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .link-title {
            font-weight: bold;
            color: #007bff;
            margin-bottom: 5px;
          }
          .link-url {
            color: #666;
            font-size: 0.9em;
          }
          .link-type {
            display: inline-block;
            background: #e9ecef;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-left: 10px;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>{title}</h1>
          <p>{message}</p>
          <p>当前时间: {new Date().toLocaleString()}</p>
          <a href="/about" className="button">关于我们</a>
        </div>

        <div className="links-container">
          <h2>友情链接 ({linkResult.pagination.total} 个)</h2>
          {linkResult.dataList.length > 0 ? (
            linkResult.dataList.map(link => (
              <div key={link.id} className="link-item">
                <div className="link-title">
                  {link.site_name}
                  {link.type_name && (
                    <span className="link-type">{link.type_name}</span>
                  )}
                </div>
                <div className="link-url">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </div>
                {link.des && (
                  <p style={{ color: '#666', marginTop: '8px' }}>
                    {link.des}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>暂无友情链接</p>
          )}
          {linkResult.pagination.total > 10 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              显示第 1-{Math.min(10, linkResult.pagination.total)} 条，共 {linkResult.pagination.total} 条
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
