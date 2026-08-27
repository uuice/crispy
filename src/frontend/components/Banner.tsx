import React from 'react'

type Props = {
  title?: string
  subtitle?: string
}

export function Banner({ title = '', subtitle = '' }: Props) {
  return (
    <header
      className="banner-hero overflow-hidden border py-8 md:py-12 px-5 sm:px-6 rounded-lg animate-in"
      style={{ borderColor: 'var(--card-border)', color: 'var(--text)' }}
    >
      <h1
        className="banner-hero-title font-bold tracking-tight"
        style={{
          fontSize: 'var(--text-2xl)',
          fontFamily: 'var(--font-mono)',
          margin: 0,
        }}
      >
        <span className="banner-hero-title-text">{title}</span>
      </h1>
      {subtitle ? (
        <p
          className="banner-hero-subtitle mt-1.5 max-w-2xl code-label"
          style={{ fontSize: 'var(--text-sm)' }}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  )
}
