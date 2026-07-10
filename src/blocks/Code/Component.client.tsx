'use client'
import { Highlight } from 'prism-react-renderer'
import React from 'react'
import { CopyButton } from './CopyButton'
import { crispyPrismTheme } from './prismTheme'

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null

  return (
    <Highlight code={code} language={language} theme={crispyPrismTheme}>
      {({ getLineProps, getTokenProps, tokens }) => (
        <pre className="blog-code-block p-4 text-xs rounded overflow-x-auto">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ className: 'table-row', line })}>
              <span className="blog-code-linenum table-cell select-none text-right">{i + 1}</span>
              <span className="table-cell pl-4">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
          <CopyButton code={code} />
        </pre>
      )}
    </Highlight>
  )
}
