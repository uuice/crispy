import React, { ReactNode } from 'react';

interface BaseLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
  siteConfig?: any;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  title = 'Crispy',
  description = 'A modern Angular SSR blog platform',
  children,
  siteConfig
}) => {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

            body {
              font-family: 'Inter', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }

            .gradient-text {
              background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              animation: gradient 8s ease infinite;
              background-size: 300% 300%;
            }

            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }

            .card-hover {
              transition: all 0.3s ease;
              transform: translateY(0);
            }

            .card-hover:hover {
              transform: translateY(-8px);
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
          `}
        </style>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
};
