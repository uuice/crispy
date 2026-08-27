'use client'

import { FieldLabel, toast, useAuth, useConfig, useTranslation } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { type AuthzUserShape, userHasPermissionSync } from '@/access/can'
import { DEFAULT_ADMIN_THEME_HUE, normalizeAdminThemeHue } from '@/brand/admin-theme'
import { adminLabels } from '@/i18n/admin-labels'

function applyHue(hue: number) {
  document.documentElement.style.setProperty('--crispy-hue', `${normalizeAdminThemeHue(hue)}deg`)
}

export function AdminThemeHueControl() {
  const { user } = useAuth()
  const { config } = useConfig()
  const { t } = useTranslation()
  const [hue, setHue] = useState(DEFAULT_ADMIN_THEME_HUE)
  const [loaded, setLoaded] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const canEdit = user != null && userHasPermissionSync(user as AuthzUserShape, 'settings:site')

  useEffect(() => {
    if (!canEdit) return

    const load = async () => {
      try {
        const res = await fetch(
          formatAdminURL({
            apiRoute: config.routes.api,
            path: '/globals/site-settings?depth=0',
          }),
          { credentials: 'include' },
        )

        if (!res.ok) return

        const data = (await res.json()) as { adminThemeHue?: number | null }
        const nextHue =
          typeof data.adminThemeHue === 'number' ? data.adminThemeHue : DEFAULT_ADMIN_THEME_HUE
        setHue(nextHue)
        applyHue(nextHue)
      } catch {
        // ignore load errors; server-injected hue still applies
      } finally {
        setLoaded(true)
      }
    }

    void load()
  }, [canEdit, config.routes.api])

  const persistHue = useCallback(
    async (value: number) => {
      const normalized = normalizeAdminThemeHue(value)

      try {
        const res = await fetch(
          formatAdminURL({
            apiRoute: config.routes.api,
            path: '/globals/site-settings',
          }),
          {
            body: JSON.stringify({ adminThemeHue: normalized }),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          },
        )

        if (!res.ok) {
          toast.error(t('error:unknown'))
          return
        }

        toast.success('主题色相已保存')
      } catch {
        toast.error(t('error:unknown'))
      }
    },
    [config.routes.api, t],
  )

  const scheduleSave = useCallback(
    (value: number) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }

      saveTimerRef.current = setTimeout(() => {
        void persistHue(value)
      }, 450)
    },
    [persistHue],
  )

  const onHueChange = useCallback(
    (raw: number) => {
      const next = normalizeAdminThemeHue(raw)
      setHue(next)
      applyHue(next)
      scheduleSave(next)
    },
    [scheduleSave],
  )

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  if (!canEdit) return null

  return (
    <div className="payload-settings__theme-hue">
      <FieldLabel
        htmlFor="admin-theme-hue"
        label={adminLabels.adminThemeHue}
      />
      <p className="payload-settings__theme-hue-hint">
        OKLCH 色相 0–360，默认 41 为暖橙。拖动后立即预览，松手后自动保存。
      </p>
      <div className="payload-settings__theme-hue-controls">
        <input
          aria-label={adminLabels.adminThemeHue}
          className="payload-settings__theme-hue-range"
          disabled={!loaded}
          id="admin-theme-hue"
          max={360}
          min={0}
          onChange={(event) => onHueChange(Number(event.target.value))}
          step={1}
          type="range"
          value={hue}
        />
        <input
          aria-label={`${adminLabels.adminThemeHue} 数值`}
          className="payload-settings__theme-hue-number"
          disabled={!loaded}
          max={360}
          min={0}
          onChange={(event) => onHueChange(Number(event.target.value))}
          step={1}
          type="number"
          value={hue}
        />
      </div>
    </div>
  )
}
