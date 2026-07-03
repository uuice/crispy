import React from 'react'

type Props = {
  title: string
  subtitle?: React.ReactNode
  eyebrow?: string
  stats?: React.ReactNode
}

export function PageHeader({ title, subtitle, eyebrow, stats }: Props) {
  return (
    <header className="kb-page-header">
      {eyebrow ? <p className="kb-eyebrow">{eyebrow}</p> : null}
      <h1 className="kb-page-title">{title}</h1>
      {subtitle ? <p className="kb-page-subtitle">{subtitle}</p> : null}
      {stats ? <div className="kb-page-stats">{stats}</div> : null}
    </header>
  )
}
