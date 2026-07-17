import fs from 'fs'
import path from 'path'

import type { Payload } from 'payload'

import { resolveDataFile } from '@/utilities/runtimeDataPath'

export type EmailRuntimeConfig = {
  enabled: boolean
  type?: 'resend' | 'smtp'
  apiKey?: string
  smtpHost?: string
  smtpPort?: number
  smtpSecure?: boolean
  smtpUser?: string
  smtpPass?: string
  fromAddress?: string
  fromName?: string
  formDefaultToEmail?: string
  overrideRecipient?: string
  updatedAt?: string
}

export function getEmailRuntimePath(): string {
  return resolveDataFile('email-runtime.json', 'CRISPY_EMAIL_RUNTIME_PATH')
}

export function readEmailRuntimeFile(): EmailRuntimeConfig | null {
  try {
    const filePath = getEmailRuntimePath()
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw) as EmailRuntimeConfig
  } catch {
    return null
  }
}

export function writeEmailRuntimeFile(config: EmailRuntimeConfig): void {
  const filePath = getEmailRuntimePath()
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
}

function relationId(value: unknown): string | number | undefined {
  if (value == null) return undefined
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: string | number }).id
  }
  if (typeof value === 'string' || typeof value === 'number') return value
  return undefined
}

type EmailSettingsLike = {
  activeTransport?: unknown
  fromAddress?: string | null
  fromName?: string | null
  formDefaultToEmail?: string | null
  overrideRecipient?: string | null
}

/**
 * Persist Active email transport for adapter bootstrap after restart.
 * Pass `settingsOverride` from Global afterChange `doc` to avoid reading uncommitted state.
 */
export async function syncEmailRuntimeFile(
  payload: Payload,
  settingsOverride?: EmailSettingsLike | null,
): Promise<void> {
  const settings =
    settingsOverride ??
    (await payload.findGlobal({
      slug: 'email-settings',
      depth: 0,
      overrideAccess: true,
    }))

  const fromAddress = settings?.fromAddress?.trim() || undefined
  const fromName = settings?.fromName?.trim() || undefined
  const formDefaultToEmail = settings?.formDefaultToEmail?.trim() || undefined
  const overrideRecipient = settings?.overrideRecipient?.trim() || undefined

  const transportId = relationId(settings?.activeTransport)
  if (transportId == null) {
    writeEmailRuntimeFile({
      enabled: false,
      fromAddress,
      fromName,
      formDefaultToEmail,
      overrideRecipient,
      updatedAt: new Date().toISOString(),
    })
    payload.logger.info({ msg: 'email-runtime synced', enabled: false, reason: 'no-active-transport' })
    return
  }

  const transport = await payload.findByID({
    collection: 'email-transports',
    id: transportId,
    depth: 0,
    overrideAccess: true,
    context: { returnSecrets: true },
  })

  if (!transport || transport.enabled === false) {
    writeEmailRuntimeFile({
      enabled: false,
      fromAddress,
      fromName,
      formDefaultToEmail,
      overrideRecipient,
      updatedAt: new Date().toISOString(),
    })
    payload.logger.warn({
      msg: 'email-runtime fell back to disabled',
      reason: !transport ? 'transport-not-found' : 'transport-disabled',
      transportId,
    })
    return
  }

  if (transport.type === 'resend') {
    if (!transport.apiKey) {
      writeEmailRuntimeFile({
        enabled: false,
        fromAddress,
        fromName,
        formDefaultToEmail,
        overrideRecipient,
        updatedAt: new Date().toISOString(),
      })
      payload.logger.error({
        msg: 'email-runtime fell back to disabled',
        reason: 'resend-api-key-missing',
        transportId,
      })
      return
    }

    writeEmailRuntimeFile({
      enabled: true,
      type: 'resend',
      apiKey: transport.apiKey,
      fromAddress,
      fromName,
      formDefaultToEmail,
      overrideRecipient,
      updatedAt: new Date().toISOString(),
    })
    payload.logger.info({ msg: 'email-runtime synced', type: 'resend', transportId })
    return
  }

  if (transport.type === 'smtp') {
    if (!transport.smtpHost) {
      writeEmailRuntimeFile({
        enabled: false,
        fromAddress,
        fromName,
        formDefaultToEmail,
        overrideRecipient,
        updatedAt: new Date().toISOString(),
      })
      payload.logger.error({
        msg: 'email-runtime fell back to disabled',
        reason: 'smtp-host-missing',
        transportId,
      })
      return
    }

    writeEmailRuntimeFile({
      enabled: true,
      type: 'smtp',
      smtpHost: transport.smtpHost,
      smtpPort: typeof transport.smtpPort === 'number' ? transport.smtpPort : 587,
      smtpSecure: Boolean(transport.smtpSecure),
      smtpUser: transport.smtpUser || undefined,
      smtpPass: transport.smtpPass || undefined,
      fromAddress,
      fromName,
      formDefaultToEmail,
      overrideRecipient,
      updatedAt: new Date().toISOString(),
    })
    payload.logger.info({ msg: 'email-runtime synced', type: 'smtp', transportId })
    return
  }

  writeEmailRuntimeFile({
    enabled: false,
    fromAddress,
    fromName,
    formDefaultToEmail,
    overrideRecipient,
    updatedAt: new Date().toISOString(),
  })
  payload.logger.warn({
    msg: 'email-runtime fell back to disabled',
    reason: 'unknown-transport-type',
    transportId,
  })
}
