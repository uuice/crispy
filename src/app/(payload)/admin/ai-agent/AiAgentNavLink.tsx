'use client'

import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import React from 'react'

const AI_AGENT_PATH = '/admin/ai-agent'

export function AiAgentNavLink() {
  const pathname = usePathname()
  const isActive = pathname === AI_AGENT_PATH || pathname.startsWith(`${AI_AGENT_PATH}/`)

  return (
    <Link
      className={`nav__link${isActive ? ' active' : ''}`}
      href={AI_AGENT_PATH}
      prefetch={false}
    >
      AI 内容助手
    </Link>
  )
}

export default AiAgentNavLink
