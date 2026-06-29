'use client'

import React, { useCallback, useState } from 'react'
import { useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

import type { AiAction } from '@/ai/types'

import { AiAssistPopup } from './AiAssistPopup'
import { useAiComplete } from './useAiComplete'
import { useAiFieldContext } from './useAiFieldContext'

const SEO_ACTIONS: { action: AiAction; label: string }[] = [
  { action: 'seo_title', label: '优化 SEO 标题' },
  { action: 'seo_description', label: '优化 SEO 描述' },
]

type SeoTarget = 'meta.title' | 'meta.description'

const AiSeoPanel: UIFieldClientComponent = (props) => {
  const { field } = props
  const { id, collectionSlug } = useDocumentInfo()
  const { setValue: setMetaTitle } = useField<string>({ path: 'meta.title' })
  const { setValue: setMetaDescription } = useField<string>({ path: 'meta.description' })
  const { runComplete } = useAiComplete()
  const { title, contentPlain, profile } = useAiFieldContext(field)
  const [error, setError] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [activeAction, setActiveAction] = useState<AiAction | null>(null)
  const [activeTarget, setActiveTarget] = useState<SeoTarget | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const metaTitle = useFormFields(([fields]) => fields['meta.title']?.value as string | undefined)
  const metaDescription = useFormFields(
    ([fields]) => fields['meta.description']?.value as string | undefined,
  )

  const runSeo = useCallback(
    async (fieldPath: SeoTarget, action: 'seo_title' | 'seo_description') => {
      setError(null)
      setStreaming(true)
      setActiveAction(action)
      setActiveTarget(fieldPath)
      setPreview('')

      const input = fieldPath === 'meta.title' ? (metaTitle ?? '') : (metaDescription ?? '')

      try {
        await runComplete(
          {
            action,
            collection: collectionSlug ?? 'posts',
            docId: id,
            fieldPath,
            input,
            context: {
              title,
              contentPlain,
              locale: 'zh-CN',
            },
          },
          {
            onChunk: (_chunk, fullText) => setPreview(fullText),
          },
        )
      } catch (err) {
        setPreview(null)
        setActiveAction(null)
        setActiveTarget(null)
        setError(err instanceof Error ? err.message : 'AI 失败')
      } finally {
        setStreaming(false)
      }
    },
    [collectionSlug, contentPlain, id, metaDescription, metaTitle, runComplete, title],
  )

  const applyPreview = useCallback(() => {
    if (preview === null || !activeTarget) return
    if (activeTarget === 'meta.title') {
      setMetaTitle(preview)
    } else {
      setMetaDescription(preview)
    }
    setPreview(null)
    setActiveAction(null)
    setActiveTarget(null)
  }, [activeTarget, preview, setMetaDescription, setMetaTitle])

  const clearPreview = useCallback(() => {
    setPreview(null)
    setActiveAction(null)
    setActiveTarget(null)
  }, [])

  if (!profile?.seo) return null

  const originalText =
    activeTarget === 'meta.description' ? (metaDescription ?? '') : (metaTitle ?? '')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--theme-elevation-150)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>AI SEO 优化</p>
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-700)', margin: 0 }}>
          基于标题与正文生成 SEO 标题/描述，预览后应用。
        </p>
      </div>
      <AiAssistPopup
        actions={SEO_ACTIONS}
        activeAction={activeAction}
        applyLabel="应用到字段"
        disabled={streaming}
        error={error}
        hint="选择要优化的 SEO 字段，生成后可对比预览。"
        originalText={originalText}
        preview={preview}
        showCustomPrompt={false}
        streaming={streaming}
        title="AI SEO 优化"
        triggerTitle="AI SEO 优化"
        onAction={async (action) => {
          if (action === 'seo_title') await runSeo('meta.title', 'seo_title')
          if (action === 'seo_description') await runSeo('meta.description', 'seo_description')
        }}
        onApply={applyPreview}
        onCancelPreview={clearPreview}
      />
    </div>
  )
}

export default AiSeoPanel
