'use client'

import { FieldLabel, useField } from '@payloadcms/ui'
import { Banner } from '@payloadcms/ui/elements/Banner'
import type { UIFieldClientComponent } from 'payload'
import React, { useCallback, useLayoutEffect } from 'react'

import { adminLabels } from '@/i18n/admin-labels'
import { FRONTEND_THEME_ADMIN_META } from '@/themes/adminMeta'
import { FRONTEND_THEME_DEFINITIONS } from '@/themes/definitions'
import { buildThemePreviewUrl } from '@/themes/preview.shared'
import { getClientSideURL } from '@/utilities/getURL'

import './index.scss'

function ThemeMock({ variant }: { variant: 'blog' | 'cms' | 'kb' }) {
  if (variant === 'cms') {
    return (
      <div aria-hidden className="frontend-theme-field__mock frontend-theme-field__mock--cms">
        <div className="frontend-theme-field__mock-header" />
        <div className="frontend-theme-field__mock-body">
          <div className="frontend-theme-field__mock-block frontend-theme-field__mock-block--hero" />
          <div className="frontend-theme-field__mock-block" />
          <div className="frontend-theme-field__mock-block" />
        </div>
      </div>
    )
  }

  if (variant === 'kb') {
    return (
      <div aria-hidden className="frontend-theme-field__mock frontend-theme-field__mock--kb">
        <div className="frontend-theme-field__mock-sidebar" />
        <div className="frontend-theme-field__mock-main">
          <div className="frontend-theme-field__mock-block frontend-theme-field__mock-block--hero" />
          <div className="frontend-theme-field__mock-block" />
        </div>
      </div>
    )
  }

  return (
    <div aria-hidden className="frontend-theme-field__mock frontend-theme-field__mock--blog">
      <div className="frontend-theme-field__mock-header" />
      <div className="frontend-theme-field__mock-body">
        <div className="frontend-theme-field__mock-block frontend-theme-field__mock-block--accent" />
        <div className="frontend-theme-field__mock-block" />
      </div>
    </div>
  )
}

const THEME_FIELD_PATH = 'frontendTheme'

function dedupeThemePickerInstances() {
  const nodes = document.querySelectorAll<HTMLElement>('.frontend-theme-field')
  nodes.forEach((node, index) => {
    node.style.display = index === 0 ? '' : 'none'
  })
}

const FrontendThemeField: UIFieldClientComponent = () => {
  const { value, setValue } = useField<string>({ path: THEME_FIELD_PATH })
  const baseUrl = getClientSideURL() || '/'

  useLayoutEffect(() => {
    dedupeThemePickerInstances()
  }, [])

  const onSelect = useCallback(
    (themeId: string) => {
      if (value === themeId) {
        return
      }

      setValue(themeId)
    },
    [setValue, value],
  )

  const onCardKeyDown = useCallback(
    (event: React.KeyboardEvent, themeId: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect(themeId)
      }
    },
    [onSelect],
  )

  return (
    <div className="field-type ui frontend-theme-field">
      <FieldLabel label={adminLabels.frontendTheme} />
      <p className="frontend-theme-field__hint">{adminLabels.frontendThemeHint}</p>

      <div
        aria-label={adminLabels.frontendTheme}
        className="frontend-theme-field__cards"
        role="radiogroup"
      >
        {FRONTEND_THEME_DEFINITIONS.map((theme) => {
          const meta = FRONTEND_THEME_ADMIN_META[theme.id]
          const isSelected = value === theme.id
          const previewHref = buildThemePreviewUrl(theme.id, baseUrl)

          return (
            <article key={theme.id} className="frontend-theme-field__card-shell">
              <div
                aria-checked={isSelected}
                className="frontend-theme-field__card"
                data-selected={isSelected}
                onClick={() => onSelect(theme.id)}
                onKeyDown={(event) => onCardKeyDown(event, theme.id)}
                role="radio"
                tabIndex={0}
              >
                <ThemeMock variant={meta.mock} />

                <div className="frontend-theme-field__card-head">
                  <p className="frontend-theme-field__card-title">{theme.label}</p>
                  {isSelected ? (
                    <span className="frontend-theme-field__badge">{adminLabels.frontendThemeSelected}</span>
                  ) : null}
                </div>

                <p className="frontend-theme-field__card-desc">{meta.description}</p>
              </div>

              <a
                className="frontend-theme-field__preview-link"
                href={previewHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                {adminLabels.frontendThemePreviewLink}
                <span aria-hidden>↗</span>
              </a>
            </article>
          )
        })}
      </div>

      <Banner className="frontend-theme-field__banner" type="info">
        <p>{adminLabels.frontendThemeCacheHint}</p>
      </Banner>
    </div>
  )
}

export default FrontendThemeField
