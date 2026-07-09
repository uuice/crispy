import type { FaqBlock as FaqBlockProps } from '@/payload-types'
import React from 'react'

import RichText from '@/components/RichText'

type Props = FaqBlockProps & {
  className?: string
}

export const FaqBlock: React.FC<Props> = ({ className, items }) => {
  if (!items?.length) return null

  return (
    <div className={className}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        {items.map((item, index) => {
          if (!item?.question) return null

          return (
            <details
              key={item.id || index}
              className="group rounded-lg border border-border bg-card px-4 py-3"
            >
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="flex items-center justify-between gap-3">
                  {item.question}
                  <span
                    aria-hidden
                    className="text-muted-foreground transition-transform group-open:rotate-180"
                  >
                    ▾
                  </span>
                </span>
              </summary>
              {item.answer ? (
                <div className="mt-3 border-t border-border pt-3 text-muted-foreground">
                  <RichText data={item.answer} enableGutter={false} />
                </div>
              ) : null}
            </details>
          )
        })}
      </div>
    </div>
  )
}
