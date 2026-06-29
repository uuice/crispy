'use client'

import React, { useCallback, useState } from 'react'
import { useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

import { lexicalToPlainText } from '@/ai/lexical/toPlainText'

import { AiActionToolbar } from './AiActionToolbar'
import { AiPreviewPanel } from './AiPreviewPanel'
import { useAiComplete } from './useAiComplete'

const AiSeoPanel: UIFieldClientComponent = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const { setValue: setMetaTitle } = useField<string>({ path: 'meta.title' })
  const { setValue: setMetaDescription } = useField<string>({ path: 'meta.description' })
  const { runComplete } = useAiComplete()
  const [error, setError] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [preview, setPreview] = useState<{
    field: 'meta.title' | 'meta.description'
    text: string
  } | null>(null)

  const title = useFormFields(([fields]) => fields.title?.value as string | undefined)
  const metaTitle = useFormFields(([fields]) => fields['meta.title']?.value as string | undefined)
  const metaDescription = useFormFields(
    ([fields]) => fields['meta.description']?.value as string | undefined,
  )
  const content = useFormFields(([fields]) => fields.content?.value)

  const contentPlain = lexicalToPlainText(content)

  const runSeo = useCallback(
    async (fieldPath: 'meta.title' | 'meta.description', action: 'seo_title' | 'seo_description') => {
      setError(null)
      setStreaming(true)
      setPreview({ field: fieldPath, text: '' })

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
            onChunk: (_chunk, fullText) => setPreview({ field: fieldPath, text: fullText }),
          },
        )
      } catch (err) {
        setPreview(null)
        setError(err instanceof Error ? err.message : 'AI 失败')
      } finally {
        setStreaming(false)
      }
    },
    [collectionSlug, contentPlain, id, metaDescription, metaTitle, runComplete, title],
  )

  const applyPreview = useCallback(() => {
    if (!preview) return
    if (preview.field === 'meta.title') {
      setMetaTitle(preview.text)
    } else {
      setMetaDescription(preview.text)
    }
    setPreview(null)
  }, [preview, setMetaDescription, setMetaTitle])

  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '16px',
        borderRadius: '4px',
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: '8px' }}>AI SEO 优化</p>
      <p style={{ fontSize: '13px', color: 'var(--theme-elevation-800)', marginBottom: '12px' }}>
        基于文章标题与正文生成 SEO 标题/描述，流式预览后应用。
      </p>
      <AiActionToolbar
        actions={[
          { action: 'seo_title', label: '优化 SEO 标题' },
          { action: 'seo_description', label: '优化 SEO 描述' },
        ]}
        disabled={streaming}
        onAction={async (action) => {
          if (action === 'seo_title') await runSeo('meta.title', 'seo_title')
          if (action === 'seo_description') await runSeo('meta.description', 'seo_description')
        }}
      />
      {error && <p style={{ color: 'var(--theme-error-500)', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
      {preview && (
        <AiPreviewPanel
          applyLabel="应用到字段"
          streaming={streaming}
          text={preview.text}
          title={preview.field === 'meta.title' ? 'SEO 标题预览' : 'SEO 描述预览'}
          onApply={applyPreview}
          onCancel={() => setPreview(null)}
        />
      )}
    </div>
  )
}

export default AiSeoPanel
