import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { frontendLabels } from '@/i18n/frontend-labels'

export default function NotFound() {
  return (
    <div className="container py-28">
      <div className="prose max-w-none dark:prose-invert">
        <h1 style={{ marginBottom: 0 }}>{frontendLabels.notFound.title}</h1>
        <p className="mb-4">{frontendLabels.notFound.message}</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">{frontendLabels.notFound.home}</Link>
      </Button>
    </div>
  )
}
