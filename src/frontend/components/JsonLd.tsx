import React from 'react'

type Props = {
  data: Record<string, unknown>
}

export function JsonLd({ data }: Props) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  )
}
