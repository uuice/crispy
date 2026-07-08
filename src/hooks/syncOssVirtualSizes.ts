import type { CollectionAfterOperationHook, PayloadRequest, TypeWithID } from 'payload'
import { createLocalReq } from 'payload'

import { buildVirtualMediaSizes } from '@/uploads/ossVirtualSizes'
import { isOssVirtualSizesEnabled } from '@/uploads/isOssVirtualSizesEnabled'
import { persistVirtualMediaSizes } from '@/uploads/persistVirtualMediaSizes'

const SKIP_CONTEXT_KEY = 'skipOssVirtualSizes'

const WRITE_OPERATIONS = new Set(['create', 'update', 'updateByID'])

type MediaLike = TypeWithID & {
  mimeType?: string | null
  url?: string | null
  filename?: string | null
  width?: number | null
  height?: number | null
  thumbnailURL?: string | null
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function resolveDocFromOperationResult(result: unknown): MediaLike | null {
  if (!result || typeof result !== 'object') return null

  if ('doc' in result && result.doc && typeof result.doc === 'object' && 'id' in result.doc) {
    return result.doc as MediaLike
  }

  if ('id' in result) {
    return result as MediaLike
  }

  return null
}

async function loadMediaDoc(req: PayloadRequest, id: number | string): Promise<MediaLike | null> {
  try {
    return (await req.payload.findByID({
      collection: 'media',
      id,
      depth: 0,
      overrideAccess: true,
      req,
    })) as MediaLike
  } catch {
    return null
  }
}

async function syncOssVirtualSizesForDoc(req: PayloadRequest, doc: MediaLike): Promise<void> {
  if (!isOssVirtualSizesEnabled()) return

  const mimeType = typeof doc.mimeType === 'string' ? doc.mimeType : ''
  if (!mimeType.startsWith('image/')) return

  const url = typeof doc.url === 'string' ? doc.url : ''
  if (!url) return

  const sizes = buildVirtualMediaSizes({
    url,
    filename: typeof doc.filename === 'string' ? doc.filename : null,
    mimeType,
    width: toNumber(doc.width),
    height: toNumber(doc.height),
  })

  if (!sizes) {
    req.payload.logger.warn({
      msg: `OSS virtual sizes skipped: could not resolve public URL for media:${doc.id}`,
    })
    return
  }

  const thumbnailURL = sizes.thumbnail?.url ?? doc.thumbnailURL

  await persistVirtualMediaSizes(req, doc.id, sizes, thumbnailURL)
}

const pendingSyncIds = new Set<number | string>()

/** Persist after the Payload transaction commits (in-transaction SQL was not sticking). */
function scheduleOssVirtualSizesSync(payload: PayloadRequest['payload'], mediaId: number | string): void {
  if (pendingSyncIds.has(mediaId)) return
  pendingSyncIds.add(mediaId)

  setImmediate(() => {
    void (async () => {
      try {
        const req = await createLocalReq({}, payload)
        const doc = await loadMediaDoc(req, mediaId)
        if (doc) {
          await syncOssVirtualSizesForDoc(req, doc)
        }
      } catch (error) {
        payload.logger.error({
          err: error,
          msg: `Failed to sync OSS virtual sizes for media:${mediaId}`,
        })
      } finally {
        pendingSyncIds.delete(mediaId)
      }
    })()
  })
}

/** Run after create/update completes; defer DB write until the operation transaction commits. */
export const syncOssVirtualSizesAfterOperation: CollectionAfterOperationHook = async (arg) => {
  if (!isOssVirtualSizesEnabled()) return arg.result
  if (!WRITE_OPERATIONS.has(arg.operation)) return arg.result

  const context =
    'context' in arg.args && arg.args.context && typeof arg.args.context === 'object'
      ? (arg.args.context as Record<string, unknown>)
      : undefined
  if (context?.[SKIP_CONTEXT_KEY]) return arg.result

  const resultDoc = resolveDocFromOperationResult(arg.result)
  if (!resultDoc?.id) return arg.result

  scheduleOssVirtualSizesSync(arg.req.payload, resultDoc.id)
  return arg.result
}
