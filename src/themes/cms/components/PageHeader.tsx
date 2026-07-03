import React from 'react'

type Props = {
  title: string
  subtitle?: React.ReactNode
  eyebrow?: string
  variant?: 'hero' | 'inline'
  stats?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  variant = 'hero',
  stats,
}: Props) {
  if (variant === 'inline') {
    return (
      <header className="cms-page-header cms-page-header--inline">
        {eyebrow ? <p className="cms-eyebrow">{eyebrow}</p> : null}
        <h1 className="cms-page-title">{title}</h1>
        {subtitle ? <p className="cms-page-subtitle">{subtitle}</p> : null}
        {stats ? <div className="cms-page-stats">{stats}</div> : null}
      </header>
    )
  }

  return (
    <section className="cms-hero">
      <div aria-hidden="true" className="cms-hero-bg" />
      <div className="cms-container cms-hero-inner">
        {eyebrow ? <p className="cms-eyebrow">{eyebrow}</p> : null}
        <h1 className="cms-hero-title">{title}</h1>
        {subtitle ? <p className="cms-hero-subtitle">{subtitle}</p> : null}
        {stats ? <div className="cms-hero-stats">{stats}</div> : null}
      </div>
    </section>
  )
}
