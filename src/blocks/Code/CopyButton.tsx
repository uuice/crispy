'use client'

import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { useRef, useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (
    <div className="flex justify-end">
      <Button
        aria-label={copied ? '已复制' : '复制代码'}
        className="mt-2 h-auto min-w-0 gap-1.5 px-2.5 py-1.5 text-xs"
        title={copied ? '已复制' : '复制代码'}
        type="button"
        variant="secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
            resetTimerRef.current = setTimeout(() => setCopied(false), 2000)
          } catch {
            setCopied(false)
          }
        }}
      >
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        <span>{copied ? '已复制' : '复制'}</span>
      </Button>
    </div>
  )
}
