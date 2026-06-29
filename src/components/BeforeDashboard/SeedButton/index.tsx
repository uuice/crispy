'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    数据库已填充！现在可以{' '}
    <a target="_blank" href="/">
      访问前台
    </a>
    。MCP 密钥请查看终端日志或 Admin → MCP → API Keys。
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('数据库已填充过。')
        return
      }
      if (loading) {
        toast.info('正在填充数据，请稍候…')
        return
      }
      if (error) {
        toast.error('发生错误，请刷新页面后重试。')
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            fetch('/next/seed', { method: 'POST', credentials: 'include' })
              .then((res) => {
                if (res.ok) {
                  resolve(true)
                  setSeeded(true)
                } else {
                  reject('填充数据失败。')
                }
              })
              .catch(reject)
          }),
          {
            loading: '正在填充示例数据…',
            success: <SuccessMessage />,
            error: '填充数据失败。',
          },
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = '（填充中…）'
  if (seeded) message = '（完成）'
  if (error) message = `（错误：${error}）`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick} type="button">
        填充示例数据
      </button>
      {message}
    </Fragment>
  )
}
