import type { PayloadRequest } from 'payload'

import { AUDIT_LOG_SLUG, type AuditAction } from '@/collections/AuditLogs'

export async function writeAuditLog({
  req,
  collection,
  action,
  documentId,
  changes,
}: {
  req: PayloadRequest
  collection: string
  action: AuditAction
  documentId: string | number
  changes: Record<string, unknown> | unknown
}): Promise<void> {
  if (req.context?.skipAuditLog) return

  try {
    await req.payload.create({
      collection: AUDIT_LOG_SLUG,
      data: {
        collection,
        action,
        documentId: String(documentId),
        user: req.user?.id,
        changes: changes as Record<string, unknown>,
      },
      overrideAccess: true,
      req,
      context: {
        ...req.context,
        skipAuditLog: true,
      },
    })
  } catch (error) {
    // Never fail the primary mutation because audit logging failed (e.g. missing user FK in tests).
    req.payload.logger.error({ err: error, msg: 'Failed to write audit log' })
  }
}
