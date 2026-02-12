import React from 'react'

interface AboutPageProps {
  name: string
}

export default function AboutPage({ name }: AboutPageProps) {
  return (
    <html>
      <head>
        <title>关于我们</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
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
          .back-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #6c757d;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>关于我们</h1>
          <p>这是一个使用 React JSX 作为模板引擎的 Express 应用示例。</p>
          <p>访问者: {name}</p>
          <a href="/" className="back-button">返回首页</a>
        </div>
      </body>
    </html>
  )
}
