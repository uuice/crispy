'use client'

import React, { useCallback, useState } from 'react'
import { useDocumentInfo, useForm, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

import type { AiSuggestTaxonomyResult } from '@/ai/types'
import { lexicalToPlainText } from '@/ai/lexical/toPlainText'

type CategoryDoc = { id: number; title: string }
type TagDoc = { id: number; title: string }

type StructuredResponse = {
  data: AiSuggestTaxonomyResult
  categories: CategoryDoc[]
  tags: TagDoc[]
  error?: string
}

const AiSuggestPanel: UIFieldClientComponent = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const { dispatchFields } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<StructuredResponse | null>(null)

  const title = useFormFields(([fields]) => fields.title?.value as string | undefined)
  const content = useFormFields(([fields]) => fields.content?.value)

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
            contentPlain: lexicalToPlainText(content),
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
  }, [collectionSlug, content, id, title])

  const applySuggestions = useCallback(() => {
    if (!result?.data) return
    const { data } = result

    if (data.title) {
      dispatchFields({ type: 'UPDATE', path: 'title', value: data.title })
    }
    if (data.seoTitle) {
      dispatchFields({ type: 'UPDATE', path: 'meta.title', value: data.seoTitle })
    }
    if (data.seoDescription || data.summary) {
      dispatchFields({
        type: 'UPDATE',
        path: 'meta.description',
        value: data.seoDescription ?? data.summary,
      })
    }

    const categoryIds = (data.categoryTitles ?? [])
      .map((t) => result.categories.find((c) => c.title === t)?.id)
      .filter((v): v is number => typeof v === 'number')

    const tagIds = (data.tagTitles ?? [])
      .map((t) => result.tags.find((tag) => tag.title === t)?.id)
      .filter((v): v is number => typeof v === 'number')

    if (categoryIds.length) {
      dispatchFields({ type: 'UPDATE', path: 'categories', value: categoryIds })
    }
    if (tagIds.length) {
      dispatchFields({ type: 'UPDATE', path: 'tags', value: tagIds })
    }

    setResult(null)
  }, [dispatchFields, result])

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
      <p style={{ fontWeight: 600, marginBottom: '8px' }}>AI 智能填充</p>
      <p style={{ fontSize: '13px', color: 'var(--theme-elevation-800)', marginBottom: '12px' }}>
        根据正文建议标题、SEO、分类与标签（仅从已有分类/标签中匹配）。
      </p>
      <button
        className="btn btn--style-secondary btn--size-small"
        disabled={loading || !title?.trim()}
        onClick={() => void handleSuggest()}
        type="button"
      >
        {loading ? '分析中…' : '生成建议'}
      </button>
      {error && <p style={{ color: 'var(--theme-error-500)', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
      {result?.data && (
        <div style={{ marginTop: '12px', fontSize: '13px' }}>
          {result.data.title && (
            <p>
              <strong>标题：</strong>
              {result.data.title}
            </p>
          )}
          {result.data.seoTitle && (
            <p>
              <strong>SEO 标题：</strong>
              {result.data.seoTitle}
            </p>
          )}
          {(result.data.seoDescription || result.data.summary) && (
            <p>
              <strong>SEO 描述：</strong>
              {result.data.seoDescription ?? result.data.summary}
            </p>
          )}
          {result.data.categoryTitles?.length ? (
            <p>
              <strong>分类：</strong>
              {result.data.categoryTitles.join('、')}
            </p>
          ) : null}
          {result.data.tagTitles?.length ? (
            <p>
              <strong>标签：</strong>
              {result.data.tagTitles.join('、')}
            </p>
          ) : null}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button className="btn btn--style-primary btn--size-small" onClick={applySuggestions} type="button">
              应用到表单
            </button>
            <button
              className="btn btn--style-secondary btn--size-small"
              onClick={() => setResult(null)}
              type="button"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AiSuggestPanel
