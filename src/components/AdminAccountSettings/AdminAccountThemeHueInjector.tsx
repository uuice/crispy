'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { AdminThemeHueControl } from './AdminThemeHueControl'

const MOUNT_ATTR = 'data-crispy-theme-hue-mount'

function findOrCreateMount(): HTMLElement | null {
  const settings = document.querySelector('.payload-settings')
  if (!settings) return null

  const existing = settings.querySelector(`[${MOUNT_ATTR}]`)
  if (existing instanceof HTMLElement) return existing

  const mount = document.createElement('div')
  mount.setAttribute(MOUNT_ATTR, 'true')

  const themeField = settings.querySelector('.field-type.radio')
  if (themeField instanceof HTMLElement) {
    themeField.after(mount)
    return mount
  }

  const languageBlock = settings.querySelector('.payload-settings__language')
  if (languageBlock instanceof HTMLElement) {
    languageBlock.after(mount)
    return mount
  }

  settings.appendChild(mount)
  return mount
}

/** Injects theme hue control into Payload account settings (next to light/dark theme). */
export function AdminAccountThemeHueInjector() {
  const pathname = usePathname()
  const [mount, setMount] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!pathname?.endsWith('/account')) {
      setMount(null)
      return
    }

    const sync = () => {
      setMount(findOrCreateMount())
    }

    sync()

    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [pathname])

  if (!mount) return null

  return createPortal(<AdminThemeHueControl />, mount)
}
