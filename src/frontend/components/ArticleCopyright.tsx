import React from 'react'

type Props = {
  articleUrl: string
  publishDate: string
}

export function ArticleCopyright({ articleUrl, publishDate }: Props) {
  const licenseUrl = 'https://creativecommons.org/licenses/by-nc-sa/4.0/'

  return (
    <div className="article-copyright mt-8">
      <div
        className="border px-3 py-2.5 code-label"
        style={{
          borderColor: 'var(--card-border)',
          background: 'var(--card-bg)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          lineHeight: 1.5,
          color: 'var(--text-muted)',
        }}
      >
        <p className="m-0 mb-2" style={{ fontSize: '0.7rem' }}>
          版权信息
        </p>
        <div className="grid gap-1" style={{ gridTemplateColumns: '4.5em 1fr' }}>
          <span className="shrink-0">链接</span>
          <a className="hover:opacity-80 break-all" href={articleUrl} style={{ color: 'var(--text)' }}>
            {articleUrl}
          </a>
        </div>
        <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: '4.5em 1fr' }}>
          <span aria-label="日期" className="shrink-0">
            日期
          </span>
          <span>{publishDate}</span>
        </div>
        <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: '4.5em 1fr' }}>
          <span className="shrink-0">协议</span>
          <span>
            <a
              className="hover:opacity-80"
              href={licenseUrl}
              rel="license noopener noreferrer"
              target="_blank"
            >
              CC BY-NC-SA 4.0
            </a>{' '}
            <span>转载请注明出处</span>
          </span>
        </div>
      </div>
    </div>
  )
}
