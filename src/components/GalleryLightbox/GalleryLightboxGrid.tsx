'use client'

import React, { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

import { Media } from '@/components/Media'
import type { GalleryItem, Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'

import './galleryLightbox.scss'

export type GalleryLightboxItem = Pick<GalleryItem, 'id' | 'title' | 'image'> &
  Partial<Pick<GalleryItem, 'description'>>

type ClassNames = {
  grid?: string
  item?: string
  figure?: string
  media?: string
  image?: string
  title?: string
  description?: string
}

type Props = {
  items: GalleryLightboxItem[]
  classNames?: ClassNames
}

function mediaResource(item: GalleryLightboxItem): MediaType | null {
  const image = item.image
  return image && typeof image === 'object' ? (image as MediaType) : null
}

export function GalleryLightboxGrid({ items, classNames }: Props) {
  const labelId = useId()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const close = useCallback(() => setActiveIndex(null), [])

  const showPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current == null || items.length === 0) return current
      return (current - 1 + items.length) % items.length
    })
  }, [items.length])

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current == null || items.length === 0) return current
      return (current + 1) % items.length
    })
  }, [items.length])

  useEffect(() => {
    if (activeIndex == null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeIndex, close, showNext, showPrev])

  const activeItem = activeIndex != null ? items[activeIndex] : null
  const activeResource = activeItem ? mediaResource(activeItem) : null

  const dialog =
    mounted && activeItem && activeResource?.url
      ? createPortal(
          <div
            aria-labelledby={labelId}
            aria-modal="true"
            className="gallery-lightbox"
            role="dialog"
          >
            <button
              aria-label="关闭"
              className="gallery-lightbox__backdrop"
              onClick={close}
              type="button"
            />
            <div className="gallery-lightbox__panel">
              <div className="gallery-lightbox__toolbar">
                <p className="gallery-lightbox__caption" id={labelId}>
                  {activeItem.title}
                  <span className="gallery-lightbox__count">
                    {activeIndex! + 1} / {items.length}
                  </span>
                </p>
                <button
                  aria-label="关闭画廊"
                  className="gallery-lightbox__close"
                  onClick={close}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="gallery-lightbox__stage">
                {items.length > 1 ? (
                  <button
                    aria-label="上一张"
                    className="gallery-lightbox__nav gallery-lightbox__nav--prev"
                    onClick={showPrev}
                    type="button"
                  >
                    ‹
                  </button>
                ) : null}
                <div className="gallery-lightbox__image-wrap">
                  <Media
                    className="gallery-lightbox__media"
                    htmlElement="div"
                    imageVariant="xlarge"
                    imgClassName="gallery-lightbox__image"
                    priority
                    resource={activeResource}
                    size="100vw"
                  />
                </div>
                {items.length > 1 ? (
                  <button
                    aria-label="下一张"
                    className="gallery-lightbox__nav gallery-lightbox__nav--next"
                    onClick={showNext}
                    type="button"
                  >
                    ›
                  </button>
                ) : null}
              </div>
              {activeItem.description ? (
                <p className="gallery-lightbox__description">{activeItem.description}</p>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <ul className={cn(classNames?.grid)}>
        {items.map((item, index) => {
          const resource = mediaResource(item)
          if (!resource?.url) return null

          return (
            <li key={item.id} className={cn(classNames?.item)}>
              <figure className={cn(classNames?.figure)}>
                <button
                  aria-label={`查看大图：${item.title}`}
                  className={cn('gallery-lightbox-trigger', classNames?.media)}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <Media
                    fill
                    imageVariant="small"
                    imgClassName={classNames?.image}
                    resource={resource}
                    size="(max-width: 768px) 50vw, 25vw"
                  />
                </button>
                <figcaption>
                  <p className={cn(classNames?.title)}>{item.title}</p>
                  {item.description ? (
                    <p className={cn(classNames?.description)}>{item.description}</p>
                  ) : null}
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>
      {dialog}
    </>
  )
}
