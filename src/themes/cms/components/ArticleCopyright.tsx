import React from 'react'

type Props = {
  articleUrl: string
  publishDate: string
}

export function ArticleCopyright({ articleUrl, publishDate }: Props) {
  const licenseUrl = 'https://creativecommons.org/licenses/by-nc-sa/4.0/'

  return (
    <div className="cms-article-copyright">
      <div className="cms-article-copyright-box">
        <p className="cms-article-copyright-label">版权信息</p>
        <div className="cms-article-copyright-row">
          <span>链接</span>
          <a href={articleUrl}>{articleUrl}</a>
        </div>
        <div className="cms-article-copyright-row">
          <span>日期</span>
          <span>{publishDate}</span>
        </div>
        <div className="cms-article-copyright-row">
          <span>协议</span>
          <span>
            <a href={licenseUrl} rel="license noopener noreferrer" target="_blank">
              CC BY-NC-SA 4.0
            </a>{' '}
            转载请注明出处
          </span>
        </div>
      </div>
    </div>
  )
}
