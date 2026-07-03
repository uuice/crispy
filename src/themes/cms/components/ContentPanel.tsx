import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  id?: string
}

export function ContentPanel({ children, className = '', id }: Props) {
  return (
    <div className={`cms-panel ${className}`.trim()} id={id}>
      {children}
    </div>
  )
}
