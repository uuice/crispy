'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useDocumentInfo, useField, useForm } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

import type { AiSuggestTaxonomyResult } from '@/ai/types'

import { AiFloatingPanel } from './AiFloatingPanel'
import { AiIconButton } from './AiIconButton'
import { useAiFieldContext } from './useAiFieldContext'

type CategoryDoc = { id: number; title: string }
type TagDoc = { id: number; title: string }

type StructuredResponse = {
  data: AiSuggestTaxonomyResult
  categories: CategoryDoc[]
  tags: TagDoc[]
  error?: string
}

type SuggestContentProps = {
  hint: string
  loading: boolean
  error: string | null
  result: StructuredResponse | null
  canGenerate: boolean
  showSeo: boolean
  showDescription: boolean
  showTaxonomy: boolean
  onSuggest: () => void
  onApply: () => void
  onCancel: () => void
}

function AiSuggestPanelContent({
  hint,
  loading,
  error,
  result,
  canGenerate,
  showSeo,
  showDescription,
  showTaxonomy,
  onSuggest,
  onApply,
  onCancel,
}: SuggestContentProps) {
  return (
    <>
      <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>AI 智能填充</p>
      <p style={{ fontSize: '12px', color: 'var(--theme-elevation-700)', marginBottom: '12px' }}>{hint}</p>
      <button
        className="btn btn--style-primary btn--size-small"
        disabled={loading || !canGenerate}
        onClick={onSuggest}
        type="button"
      >
        {loading ? '分析中…' : '生成建议'}
      </button>
      {!canGenerate && (
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-600)', marginTop: '8px' }}>
          请先填写标题后再生成建议。
        </p>
      )}
      {error && (
        <p style={{ color: 'var(--theme-error-500)', fontSize: '13px', marginTop: '10px' }}>{error}</p>
      )}
      {result?.data && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid var(--theme-elevation-150)',
            background: 'var(--theme-elevation-50)',
            fontSize: '13px',
          }}
        >
          {result.data.title && (
            <p style={{ margin: '0 0 8px' }}>
              <strong>标题：</strong>
              {result.data.title}
            </p>
          )}
          {showSeo && result.data.seoTitle && (
            <p style={{ margin: '0 0 8px' }}>
              <strong>SEO 标题：</strong>
              {result.data.seoTitle}
            </p>
          )}
          {showSeo && (result.data.seoDescription || result.data.summary) && (
            <p style={{ margin: '0 0 8px' }}>
              <strong>SEO 描述：</strong>
              {result.data.seoDescription ?? result.data.summary}
            </p>
          )}
          {showDescription && (result.data.summary || result.data.seoDescription) && (
            <p style={{ margin: '0 0 8px' }}>
              <strong>描述：</strong>
              {result.data.summary ?? result.data.seoDescription}
            </p>
          )}
          {showTaxonomy && result.data.categoryTitles?.length ? (
            <p style={{ margin: '0 0 8px' }}>
              <strong>分类：</strong>
              {result.data.categoryTitles.join('、')}
            </p>
          ) : null}
          {showTaxonomy && result.data.tagTitles?.length ? (
            <p style={{ margin: '0 0 8px' }}>
              <strong>标签：</strong>
              {result.data.tagTitles.join('、')}
            </p>
          ) : null}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button className="btn btn--style-primary btn--size-small" onClick={onApply} type="button">
              应用到表单
            </button>
            <button className="btn btn--style-secondary btn--size-small" onClick={onCancel} type="button">
              取消
            </button>
          </div>
        </div>
      )}
      {!result?.data && !error && !loading && (
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-600)', marginTop: '10px' }}>
          点击「生成建议」后在此预览，确认后应用到表单。
        </p>
      )}
    </>
  )
}

const AiSuggestPanel: UIFieldClientComponent = (props) => {
  const { field } = props
  const { id, collectionSlug } = useDocumentInfo()
  const { dispatchFields, setModified } = useForm()
  const { title, contentPlain, profile } = useAiFieldContext(field)
  const { setValue: setTitle } = useField<string>({ path: 'title' })

  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<StructuredResponse | null>(null)

  const showTaxonomy = Boolean(profile?.suggest?.taxonomy)
  const showSeo = Boolean(profile?.seo)
  const descriptionPath = profile?.suggest?.descriptionPath
  const showDescription = Boolean(descriptionPath)
  const showPanel = Boolean(profile?.suggest !== undefined || showSeo)

  const updateField = useCallback(
    (path: string, value: unknown) => {
      dispatchFields({ type: 'UPDATE', path, value, valid: true })
      setModified(true)
    },
    [dispatchFields, setModified],
  )

  const handleSuggest = useCallback(async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/ai/structured', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_taxonomy',
          collection: collectionSlug ?? 'posts',
          docId: id,
          context: {
            title,
            contentPlain,
            locale: 'zh-CN',
          },
        }),
      })

      const json = (await res.json()) as StructuredResponse

      if (!res.ok) {
        throw new Error(json.error ?? `请求失败 (${res.status})`)
      }

      setResult(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 失败')
    } finally {
      setLoading(false)
    }
  }, [collectionSlug, contentPlain, id, title])

  const applySuggestions = useCallback(() => {
    if (!result?.data) return
    const { data } = result

    if (data.title) {
      setTitle(data.title)
    }
    if (showSeo && data.seoTitle) {
      updateField('meta.title', data.seoTitle)
    }
    if (showSeo && (data.seoDescription || data.summary)) {
      updateField('meta.description', data.seoDescription ?? data.summary)
    }
    if (showDescription && descriptionPath && (data.summary || data.seoDescription)) {
      updateField(descriptionPath, data.summary ?? data.seoDescription)
    }

    if (showTaxonomy) {
      const categoryIds = (data.categoryTitles ?? [])
        .map((t) => result.categories.find((c) => c.title === t)?.id)
        .filter((v): v is number => typeof v === 'number')

      const tagIds = (data.tagTitles ?? [])
        .map((t) => result.tags.find((tag) => tag.title === t)?.id)
        .filter((v): v is number => typeof v === 'number')

      if (categoryIds.length) updateField('categories', categoryIds)
      if (tagIds.length) updateField('tags', tagIds)
    }

    setResult(null)
    setOpen(false)
  }, [
    descriptionPath,
    result,
    setTitle,
    showDescription,
    showSeo,
    showTaxonomy,
    updateField,
  ])

  if (!showPanel) return null

  const hintParts: string[] = ['标题']
  if (showSeo) hintParts.push('SEO')
  if (showDescription) hintParts.push('描述')
  if (showTaxonomy) hintParts.push('分类与标签')

  const hint = `根据已有内容建议${hintParts.join('、')}（分类/标签仅从已有项中匹配）。`

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
        <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>AI 智能填充</p>
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-700)', margin: 0 }}>{hint}</p>
      </div>
      <>
        <AiIconButton
          ref={triggerRef}
          ariaLabel="AI 智能填充"
          disabled={loading}
          open={open}
          title="AI 智能填充"
          onClick={() => setOpen((prev) => !prev)}
        />
        <AiFloatingPanel
          anchorRef={triggerRef}
          closeOnOutsideClick={!loading}
          open={open}
          onClose={() => {
            if (loading) return
            setOpen(false)
          }}
        >
          <AiSuggestPanelContent
            canGenerate={Boolean(title?.trim())}
            error={error}
            hint={hint}
            loading={loading}
            result={result}
            showDescription={showDescription}
            showSeo={showSeo}
            showTaxonomy={showTaxonomy}
            onApply={applySuggestions}
            onCancel={() => setResult(null)}
            onSuggest={() => void handleSuggest()}
          />
        </AiFloatingPanel>
      </>
    </div>
  )
}

export default AiSuggestPanel
