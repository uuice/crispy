import React from 'react'

export default function NotFoundPage() {
  return (
    <html>
      <head>
        <title>页面未找到</title>
        <meta charSet="utf-8" />
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #dc3545;
            font-size: 3rem;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            font-size: 1.2rem;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>404</h1>
          <p>抱歉，您访问的页面不存在</p>
          <a href="/">返回首页</a>
        </div>
      </body>
    </html>
  )
}
