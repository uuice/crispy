import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
} from 'payload'

import { writeAuditLog } from '@/plugins/auditLogWriter'

const SENSITIVE_FIELDS = new Set([
  'password',
  'salt',
  'hash',
  'resetPasswordToken',
  'resetPasswordExpiration',
  'loginAttempts',
  'lockUntil',
  'sessions',
  'apiKey',
  'enableAPIKey',
])

function sanitizeDocument(doc: Record<string, unknown> | null | undefined): Record<string, unknown> {
  if (!doc) return {}

  return Object.fromEntries(
    Object.entries(doc).filter(([key]) => !SENSITIVE_FIELDS.has(key)),
  )
}

function diffDocuments(
  previous: Record<string, unknown> | null | undefined,
  current: Record<string, unknown> | null | undefined,
): Record<string, { old: unknown; new: unknown }> {
  const prev = sanitizeDocument(previous)
  const next = sanitizeDocument(current)
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)])
  const changes: Record<string, { old: unknown; new: unknown }> = {}

  for (const key of keys) {
    const oldValue = prev[key]
    const newValue = next[key]
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes[key] = { old: oldValue, new: newValue }
    }
  }

  return changes
}

export function createAuditLogHook(collectionSlug: string): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, operation, req }) => {
    if (req.context?.skipAuditLog) return doc

    const action = operation === 'create' ? 'create' : 'update'
    const changes =
      action === 'create'
        ? sanitizeDocument(doc as Record<string, unknown>)
        : diffDocuments(
            previousDoc as Record<string, unknown>,
            doc as Record<string, unknown>,
          )

    await writeAuditLog({
      req,
      collection: collectionSlug,
      action,
      documentId: doc.id,
      changes,
    })

    return doc
  }
}

export function createAuditDeleteHook(collectionSlug: string): CollectionAfterDeleteHook {
  return async ({ doc, req }) => {
    if (req.context?.skipAuditLog) return doc

    await writeAuditLog({
      req,
      collection: collectionSlug,
      action: 'delete',
      documentId: doc.id,
      changes: sanitizeDocument(doc as Record<string, unknown>),
    })

    return doc
  }
}
