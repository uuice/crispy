'use client'

import { Button, Link, toast } from '@payloadcms/ui'
import React, { useCallback, useMemo, useState } from 'react'

import type { FrontendCacheEntry, FrontendCacheGroup } from '@/frontend-cache/registry'
import type { ResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import type { DbCacheStats, DynamicRouteCacheRow, RegistryCacheStatus } from '@/frontend-cache/dbCache'

import './cache.scss'

type CacheApiPayload = {
  settings: ResolvedCacheSettings
  dbStats: DbCacheStats
  entryStatuses: Record<string, RegistryCacheStatus>
  dynamicRoutes: DynamicRouteCacheRow[]
  entries: FrontendCacheEntry[]
  groupLabels: Record<FrontendCacheGroup, string>
}

type PurgeResponse = {
  ok: boolean
  purged: number
  failed: number
  deleted?: number
}

type PurgeExpiredResponse = {
  ok: boolean
  deleted: number
}

type CacheManagePanelProps = {
  initial: CacheApiPayload
}

function formatHtmlBytes(bytes: number | null): string {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

function formatDateTime(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

function expiryStatusLabel(status: DynamicRouteCacheRow['expiryStatus']): string {
  switch (status) {
    case 'expired':
      return '已过期（待清理）'
    case 'expiringSoon':
      return '即将过期'
    default:
      return '有效'
  }
}

export function CacheManagePanel({ initial }: CacheManagePanelProps) {
  const [settings] = useState(initial.settings)
  const [dbStats, setDbStats] = useState(initial.dbStats)
  const [entryStatuses, setEntryStatuses] = useState(initial.entryStatuses)
  const [dynamicRoutes, setDynamicRoutes] = useState(initial.dynamicRoutes)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [purging, setPurging] = useState(false)
  const [purgingExpired, setPurgingExpired] = useState(false)
  const [refreshingStats, setRefreshingStats] = useState(false)

  const refreshDbStats = useCallback(async () => {
    setRefreshingStats(true)
    try {
      const response = await fetch('/api/admin/cache')
      if (!response.ok) return
      const data = (await response.json()) as CacheApiPayload
      setDbStats(data.dbStats)
      setEntryStatuses(data.entryStatuses)
      setDynamicRoutes(data.dynamicRoutes)
    } finally {
      setRefreshingStats(false)
    }
  }, [])

  const grouped = useMemo(() => {
    const map = new Map<FrontendCacheGroup, FrontendCacheEntry[]>()
    for (const entry of initial.entries) {
      const list = map.get(entry.group) ?? []
      list.push(entry)
      map.set(entry.group, list)
    }
    return map
  }, [initial.entries])

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleGroup = useCallback(
    (group: FrontendCacheGroup, checked: boolean) => {
      const ids = initial.entries.filter((entry) => entry.group === group).map((entry) => entry.id)
      setSelected((prev) => {
        const next = new Set(prev)
        for (const id of ids) {
          if (checked) next.add(id)
          else next.delete(id)
        }
        return next
      })
    },
    [initial.entries],
  )

  const purge = useCallback(async (ids: string[]) => {
    if (!ids.length || purging) return

    setPurging(true)
    try {
      const response = await fetch('/api/admin/cache/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })

      const data = (await response.json()) as PurgeResponse & { error?: string }

      if (!response.ok) {
        throw new Error(data.error || '清除失败')
      }

      toast.success(`已清除 ${data.purged} 项缓存${data.failed ? `，${data.failed} 项失败` : ''}`)
      setSelected(new Set())
      await refreshDbStats()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '清除失败')
    } finally {
      setPurging(false)
    }
  }, [purging, refreshDbStats])

  const purgeRoutePaths = useCallback(async (routePaths: string[]) => {
    if (!routePaths.length || purging) return

    setPurging(true)
    try {
      const response = await fetch('/api/admin/cache/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routePaths }),
      })

      const data = (await response.json()) as PurgeResponse & { error?: string }

      if (!response.ok) {
        throw new Error(data.error || '清除失败')
      }

      toast.success(`已清除 ${data.deleted ?? routePaths.length} 条动态路径缓存`)
      await refreshDbStats()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '清除失败')
    } finally {
      setPurging(false)
    }
  }, [purging, refreshDbStats])

  const purgeExpired = useCallback(async () => {
    if (purgingExpired || purging) return
    if (dbStats.expiredPending === 0) {
      toast.info('当前没有已过期待清理的条目')
      return
    }
    if (!window.confirm(`确定清理 ${dbStats.expiredPending} 条已过期的缓存条目？`)) return

    setPurgingExpired(true)
    try {
      const response = await fetch('/api/admin/cache/purge-expired', { method: 'POST' })
      const data = (await response.json()) as PurgeExpiredResponse & { error?: string }

      if (!response.ok) {
        throw new Error(data.error || '清理失败')
      }

      toast.success(`已清理 ${data.deleted} 条过期缓存`)
      await refreshDbStats()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '清理失败')
    } finally {
      setPurgingExpired(false)
    }
  }, [dbStats.expiredPending, purging, purgingExpired, refreshDbStats])

  const purgeAll = useCallback(async () => {
    if (purging) return
    if (!window.confirm('确定清除全部已注册的前台缓存？')) return

    setPurging(true)
    try {
      const response = await fetch('/api/admin/cache/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })

      const data = (await response.json()) as PurgeResponse & { error?: string }

      if (!response.ok) {
        throw new Error(data.error || '清除失败')
      }

      toast.success(`已清除全部 ${data.purged} 项缓存`)
      setSelected(new Set())
      await refreshDbStats()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '清除失败')
    } finally {
      setPurging(false)
    }
  }, [purging, refreshDbStats])

  return (
    <div className="admin-cache">
      <header className="admin-cache__header">
        <div>
          <h1 className="admin-cache__title">前台缓存管理</h1>
          <p className="admin-cache__subtitle">
            管理 `frontend-cache-entries`：数据查询 JSON 与页面 HTML 均存于数据库。Middleware 在 HIT 时直接返回 HTML；内容变更后
            hooks 会自动失效相关项，过期条目由定时任务每小时清理。
          </p>
        </div>
        <div className="admin-cache__header-actions">
          <Link href="/admin/globals/cache-settings" prefetch={false}>
            缓存配置
          </Link>
          <Button
            buttonStyle="secondary"
            disabled={purging || purgingExpired || dbStats.expiredPending === 0}
            onClick={purgeExpired}
            size="small"
          >
            {purgingExpired ? '清理中…' : `清理过期 (${dbStats.expiredPending})`}
          </Button>
          <Button buttonStyle="secondary" disabled={purging} onClick={purgeAll} size="small">
            清除全部
          </Button>
          <Button
            buttonStyle="primary"
            disabled={purging || selected.size === 0}
            onClick={() => purge([...selected])}
            size="small"
          >
            清除选中 ({selected.size})
          </Button>
        </div>
      </header>

      <div className="admin-cache__settings">
        <div className="admin-cache__settings-item">
          <span>缓存开关</span>
          <strong>{settings.cachingEnabled ? '开启' : '关闭'}</strong>
        </div>
        <div className="admin-cache__settings-item">
          <span>页面 HTML 缓存 TTL（秒）</span>
          <strong>{settings.pageRevalidateSeconds}</strong>
        </div>
        <div className="admin-cache__settings-item">
          <span>数据缓存 JSON（秒）</span>
          <strong>{settings.dataCacheRevalidateSeconds}</strong>
        </div>
        <div className="admin-cache__settings-item admin-cache__settings-item--stats">
          <span>
            DB 条目总数
            <button
              className="admin-cache__link-btn admin-cache__refresh-btn"
              disabled={purging || refreshingStats}
              onClick={() => refreshDbStats()}
              type="button"
            >
              {refreshingStats ? '刷新中…' : '刷新'}
            </button>
          </span>
          <strong>{dbStats.total}</strong>
        </div>
        <div className="admin-cache__settings-item">
          <span>数据 JSON 条目</span>
          <strong>{dbStats.data}</strong>
        </div>
        <div className="admin-cache__settings-item">
          <span>含 HTML 的路由条目</span>
          <strong>{dbStats.routeWithHtml}</strong>
        </div>
        <div className="admin-cache__settings-item">
          <span>仅元数据的路由条目</span>
          <strong>{dbStats.routeMetadataOnly}</strong>
        </div>
        <div className="admin-cache__settings-item">
          <span>即将过期（1 小时内）</span>
          <strong>{dbStats.expiringSoon}</strong>
        </div>
        <div className="admin-cache__settings-item">
          <span>已过期（待清理）</span>
          <strong>{dbStats.expiredPending}</strong>
        </div>
        <div className="admin-cache__settings-item">
          <span>定时清理</span>
          <strong>每小时（purgeExpiredFrontendCache）</strong>
        </div>
      </div>

      <p className="admin-cache__note">
        页面 HTML 由 Middleware 从 DB 读取并直出，TTL 仅在「缓存配置」Global 中设置（`pageRevalidateSeconds`），前台页面已关闭
        Next.js ISR。注册表 Path 为固定路径或动态模式，Tag 为数据 JSON。「已缓存动态路径」列出 DB 中实际 slug 路径。
      </p>

      {[...grouped.entries()].map(([group, entries]) => (
        <section key={group} className="admin-cache__group">
          <div className="admin-cache__group-header">
            <h2>{initial.groupLabels[group]}</h2>
            <div className="admin-cache__group-actions">
              <button
                className="admin-cache__link-btn"
                disabled={purging}
                onClick={() => toggleGroup(group, true)}
                type="button"
              >
                全选
              </button>
              <button
                className="admin-cache__link-btn"
                disabled={purging}
                onClick={() => toggleGroup(group, false)}
                type="button"
              >
                取消
              </button>
            </div>
          </div>

          <div className="admin-cache__table-wrap">
            <table className="admin-cache__table">
              <thead>
                <tr>
                  <th aria-label="选择" />
                  <th>名称</th>
                  <th>类型</th>
                  <th>目标</th>
                  <th>DB 缓存</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <input
                        checked={selected.has(entry.id)}
                        disabled={purging}
                        onChange={() => toggleOne(entry.id)}
                        type="checkbox"
                      />
                    </td>
                    <td>
                      <div className="admin-cache__label">{entry.label}</div>
                      {entry.description ? (
                        <div className="admin-cache__desc">{entry.description}</div>
                      ) : null}
                    </td>
                    <td>
                      {entry.kind === 'tag'
                        ? 'Tag'
                        : entry.pathMatch === 'pattern'
                          ? 'Pattern'
                          : 'Path'}
                    </td>
                    <td>
                      <code className="admin-cache__target">{entry.target}</code>
                    </td>
                    <td>
                      {(() => {
                        const status = entryStatuses[entry.id]
                        if (!status?.active) {
                          return <span className="admin-cache__badge admin-cache__badge--empty">无</span>
                        }
                        return (
                          <span className="admin-cache__badge admin-cache__badge--active">
                            有 ({status.count})
                          </span>
                        )
                      })()}
                    </td>
                    <td>
                      <button
                        className="admin-cache__link-btn"
                        disabled={purging}
                        onClick={() => purge([entry.id])}
                        type="button"
                      >
                        清除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="admin-cache__group">
        <div className="admin-cache__group-header">
          <h2>已缓存动态路径</h2>
          <span className="admin-cache__group-meta">{dynamicRoutes.length} 条</span>
        </div>

        {dynamicRoutes.length === 0 ? (
          <p className="admin-cache__empty">暂无动态路径 HTML 缓存（访问文章详情等页面后会出现在此）。</p>
        ) : (
          <div className="admin-cache__table-wrap">
            <table className="admin-cache__table">
              <thead>
                <tr>
                  <th>路径</th>
                  <th>HTML</th>
                  <th>大小</th>
                  <th>过期时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {dynamicRoutes.map((row) => (
                  <tr key={String(row.id)}>
                    <td>
                      <code className="admin-cache__target">{row.routePath}</code>
                    </td>
                    <td>
                      {row.hasHtml ? (
                        <span className="admin-cache__badge admin-cache__badge--active">有</span>
                      ) : (
                        <span className="admin-cache__badge admin-cache__badge--empty">无</span>
                      )}
                    </td>
                    <td>{formatHtmlBytes(row.htmlBytes)}</td>
                    <td>{formatDateTime(row.expiresAt)}</td>
                    <td>
                      <span
                        className={`admin-cache__badge admin-cache__badge--${row.expiryStatus}`}
                      >
                        {expiryStatusLabel(row.expiryStatus)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin-cache__link-btn"
                        disabled={purging}
                        onClick={() => purgeRoutePaths([row.routePath])}
                        type="button"
                      >
                        清除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
