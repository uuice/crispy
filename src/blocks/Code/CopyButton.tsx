'use client'
import { Button } from '@/components/ui/button'
import { CopyIcon } from '@payloadcms/ui/icons/Copy'
import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex justify-end align-middle">
      <Button
        aria-label={copied ? 'Copied' : 'Copy code'}
        className="flex items-center justify-center p-2 min-w-0"
        title={copied ? 'Copied' : 'Copy code'}
        type="button"
        variant="secondary"
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          setCopied(true)
          setTimeout(() => setCopied(false), 1000)
        }}
      >
        <CopyIcon />
      </Button>
    </div>
  )
}
