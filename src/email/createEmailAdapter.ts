import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'
import type { EmailAdapter } from 'payload'

function readDefaultFrom(): { address: string; name: string } {
  const address = process.env.EMAIL_FROM_ADDRESS?.trim() || 'noreply@example.com'
  const name = process.env.EMAIL_FROM_NAME?.trim() || 'Crispy CMS'
  return { address, name }
}

/**
 * Resend takes precedence when RESEND_API_KEY is set; otherwise SMTP via Nodemailer.
 * Returns undefined when no transport is configured (form submissions still persist).
 */
export function createEmailAdapter(): EmailAdapter | Promise<EmailAdapter> | undefined {
  const { address, name } = readDefaultFrom()
  const overrideRecipientAddress = process.env.EMAIL_OVERRIDE_RECIPIENT?.trim() || undefined

  const resendApiKey = process.env.RESEND_API_KEY?.trim()
  if (resendApiKey) {
    return resendAdapter({
      apiKey: resendApiKey,
      defaultFromAddress: address,
      defaultFromName: name,
      overrideRecipientAddress,
    })
  }

  const smtpHost = process.env.SMTP_HOST?.trim()
  if (smtpHost) {
    const port = Number(process.env.SMTP_PORT || 587)
    const secure = process.env.SMTP_SECURE === 'true' || port === 465

    return nodemailerAdapter({
      defaultFromAddress: address,
      defaultFromName: name,
      overrideRecipientAddress,
      transportOptions: {
        host: smtpHost,
        port,
        secure,
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
      },
    })
  }

  return undefined
}
