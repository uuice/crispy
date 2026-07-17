import { readEmailRuntimeFile, type EmailRuntimeConfig } from '@/email/syncEmailRuntimeFile'

export type ResolvedEmailConfig = {
  enabled: boolean
  type?: 'resend' | 'smtp'
  apiKey?: string
  smtpHost?: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser?: string
  smtpPass?: string
  fromAddress: string
  fromName: string
  formDefaultToEmail?: string
  overrideRecipient?: string
  source: 'runtime-file' | 'none'
}

function disabledConfig(from?: Partial<ResolvedEmailConfig>): ResolvedEmailConfig {
  return {
    enabled: false,
    smtpPort: 587,
    smtpSecure: false,
    fromAddress: 'noreply@example.com',
    fromName: 'Crispy CMS',
    source: 'none',
    ...from,
  }
}

function fromRuntime(file: EmailRuntimeConfig): ResolvedEmailConfig {
  const fromAddress = file.fromAddress?.trim() || 'noreply@example.com'
  const fromName = file.fromName?.trim() || 'Crispy CMS'
  const formDefaultToEmail = file.formDefaultToEmail?.trim() || undefined
  const overrideRecipient = file.overrideRecipient?.trim() || undefined

  if (!file.enabled || !file.type) {
    return disabledConfig({
      fromAddress,
      fromName,
      formDefaultToEmail,
      overrideRecipient,
      source: 'runtime-file',
    })
  }

  if (file.type === 'resend' && file.apiKey) {
    return {
      enabled: true,
      type: 'resend',
      apiKey: file.apiKey,
      smtpPort: 587,
      smtpSecure: false,
      fromAddress,
      fromName,
      formDefaultToEmail,
      overrideRecipient,
      source: 'runtime-file',
    }
  }

  if (file.type === 'smtp' && file.smtpHost) {
    const port = typeof file.smtpPort === 'number' ? file.smtpPort : 587
    return {
      enabled: true,
      type: 'smtp',
      smtpHost: file.smtpHost,
      smtpPort: port,
      smtpSecure: Boolean(file.smtpSecure) || port === 465,
      smtpUser: file.smtpUser || undefined,
      smtpPass: file.smtpPass || undefined,
      fromAddress,
      fromName,
      formDefaultToEmail,
      overrideRecipient,
      source: 'runtime-file',
    }
  }

  return disabledConfig({
    fromAddress,
    fromName,
    formDefaultToEmail,
    overrideRecipient,
    source: 'runtime-file',
  })
}

/**
 * Sync resolver for email adapter bootstrap.
 * Reads Admin Active via .data/email-runtime.json only (no RESEND_/SMTP_ env fallback).
 */
export function resolveEmailConfigSync(): ResolvedEmailConfig {
  const runtime = readEmailRuntimeFile()
  if (runtime) return fromRuntime(runtime)
  return disabledConfig()
}
