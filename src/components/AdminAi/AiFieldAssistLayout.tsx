'use client'

import React from 'react'

type Props = {
  children: React.ReactNode
  assist: React.ReactNode
}

/** Places AI trigger at the trailing end of a field row. */
export function AiFieldAssistLayout({ children, assist }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      <div style={{ flexShrink: 0, marginBottom: '2px' }}>{assist}</div>
    </div>
  )
}
