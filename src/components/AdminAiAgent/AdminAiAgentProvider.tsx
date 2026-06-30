'use client'

import React from 'react'

import { AdminAiAgentWidget } from './AdminAiAgentWidget'

/** Global floating AI chat widget injected into every admin page. */
export function AdminAiAgentProvider({ children }: { children?: React.ReactNode }) {
  return (
    <>
      {children}
      <AdminAiAgentWidget />
    </>
  )
}

export default AdminAiAgentProvider
