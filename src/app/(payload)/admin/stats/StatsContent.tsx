import { Link } from '@payloadcms/ui'
import React from 'react'

import type { CollectionStatsSummary } from '@/admin-stats/types'

import { StatsRefreshButton } from './StatsRefreshButton'

import './stats.scss'

type StatsContentProps = {
  stats: CollectionStatsSummary
}

function formatCount(value: number | null, accessDenied: boolean): string {
  if (accessDenied) return '—'
  if (value === null) return '—'
  return value.toLocaleString('zh-CN')
}

function sumCounts(
  rows: CollectionStatsSummary['rows'],
  key: 'activeCount' | 'trashedCount' | 'totalCount' | 'draftCount' | 'publishedCount',
) {
  return rows.reduce((total, row) => {
    if (row.accessDenied) return total
    const value = row[key]
    return typeof value === 'number' ? total + value : total
  }, 0)
}

export function StatsContent({ stats }: StatsContentProps) {
  const generatedAt = new Date(stats.generatedAt).toLocaleString('zh-CN')

  return (
    <div className="admin-stats">
      <header className="admin-stats__header">
        <div>
          <h1 className="admin-stats__title">内容统计</h1>
          <p className="admin-stats__subtitle">
            各 Collection 文档数量概览（含回收站与草稿）。统计时间：{generatedAt}
          </p>
        </div>
        <StatsRefreshButton />
      </header>

      <div className="admin-stats__summary">
        <div className="admin-stats__summary-item">
          <span className="admin-stats__summary-label">Collection 总数</span>
          <strong>{stats.rows.length}</strong>
        </div>
        <div className="admin-stats__summary-item">
          <span className="admin-stats__summary-label">可读取</span>
          <strong>{stats.accessibleCollections}</strong>
        </div>
        <div className="admin-stats__summary-item">
          <span className="admin-stats__summary-label">无权限</span>
          <strong>{stats.deniedCollections}</strong>
        </div>
        <div className="admin-stats__summary-item">
          <span className="admin-stats__summary-label">有效文档合计</span>
          <strong>{sumCounts(stats.rows, 'activeCount').toLocaleString('zh-CN')}</strong>
        </div>
        <div className="admin-stats__summary-item">
          <span className="admin-stats__summary-label">回收站合计</span>
          <strong>{sumCounts(stats.rows, 'trashedCount').toLocaleString('zh-CN')}</strong>
        </div>
      </div>

      <div className="admin-stats__table-wrap">
        <table className="admin-stats__table">
          <thead>
            <tr>
              <th>Collection</th>
              <th>分组</th>
              <th>有效</th>
              <th>回收站</th>
              <th>总计</th>
              <th>草稿</th>
              <th>已发布</th>
              <th>能力</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {stats.rows.map((row) => (
              <tr key={row.slug}>
                <td>
                  <div className="admin-stats__slug">{row.slug}</div>
                  <div className="admin-stats__label">{row.label}</div>
                </td>
                <td>{row.adminGroup ?? '—'}</td>
                <td className="admin-stats__num">{formatCount(row.activeCount, row.accessDenied)}</td>
                <td className="admin-stats__num">
                  {row.trashEnabled
                    ? formatCount(row.trashedCount, row.accessDenied)
                    : '—'}
                </td>
                <td className="admin-stats__num">{formatCount(row.totalCount, row.accessDenied)}</td>
                <td className="admin-stats__num">
                  {row.draftsEnabled
                    ? formatCount(row.draftCount, row.accessDenied)
                    : '—'}
                </td>
                <td className="admin-stats__num">
                  {row.draftsEnabled
                    ? formatCount(row.publishedCount, row.accessDenied)
                    : '—'}
                </td>
                <td>
                  <div className="admin-stats__badges">
                    {row.trashEnabled ? <span className="admin-stats__badge">回收站</span> : null}
                    {row.draftsEnabled ? <span className="admin-stats__badge">草稿</span> : null}
                    {row.accessDenied ? (
                      <span className="admin-stats__badge admin-stats__badge--muted">无读权限</span>
                    ) : null}
                  </div>
                </td>
                <td>
                  {row.accessDenied ? (
                    '—'
                  ) : (
                    <Link href={`/admin/collections/${row.slug}`} prefetch={false}>
                      打开列表
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>合计（有权限项）</td>
              <td className="admin-stats__num">{sumCounts(stats.rows, 'activeCount').toLocaleString('zh-CN')}</td>
              <td className="admin-stats__num">{sumCounts(stats.rows, 'trashedCount').toLocaleString('zh-CN')}</td>
              <td className="admin-stats__num">{sumCounts(stats.rows, 'totalCount').toLocaleString('zh-CN')}</td>
              <td className="admin-stats__num">{sumCounts(stats.rows, 'draftCount').toLocaleString('zh-CN')}</td>
              <td className="admin-stats__num">
                {sumCounts(stats.rows, 'publishedCount').toLocaleString('zh-CN')}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
