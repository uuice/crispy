import React from 'react'

export function SiteCuteDecor({ variant = 'blog' }: { variant?: 'blog' | 'admin' }) {
  const layerClass =
    variant === 'admin' ? 'site-cute-layer site-cute-layer--admin' : 'site-cute-layer'

  return (
    <div aria-hidden="true" className={layerClass}>
      <span className="cute-float-icon cute-float-icon--1">✦</span>
      <span className="cute-float-icon cute-float-icon--2">✧</span>
      <span className="cute-float-icon cute-float-icon--3">⋆</span>
      <span className="cute-float-icon cute-float-icon--4">✦</span>
      <span className="cute-float-icon cute-float-icon--5">★</span>
      <span className="cute-float-icon cute-float-icon--6">✧</span>
      <span className="cute-float-icon cute-float-icon--7">♡</span>
      <span className="cute-float-icon cute-float-icon--8">☆</span>
      <span className="cute-float-icon cute-float-icon--9">✿</span>
      <span className="cute-float-icon cute-float-icon--10">❀</span>
      <span className="cute-float-icon cute-float-icon--11">˖</span>
      <span className="cute-float-icon cute-float-icon--12">✧</span>
      <span className="cute-dot cute-dot--1" />
      <span className="cute-dot cute-dot--2" />
      <span className="cute-dot cute-dot--3" />
      <span className="cute-dot cute-dot--4" />
      <span className="cute-dot cute-dot--5" />
      <span className="cute-blob cute-blob--a" />
      <span className="cute-blob cute-blob--b" />
      {variant === 'blog' ? <span className="cute-blob cute-blob--c" /> : null}
    </div>
  )
}
