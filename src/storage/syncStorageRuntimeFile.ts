import fs from 'fs'
import path from 'path'

import type { Payload } from 'payload'

import { resolveDataFile } from '@/utilities/runtimeDataPath'

export type StorageRuntimeConfig = {
  mode: 'local' | 's3'
  bucket?: string
  region?: string
  endpoint?: string
  prefix?: string
  accessKeyId?: string
  secretAccessKey?: string
  forcePathStyle?: boolean
  publicBaseUrl?: string
  virtualSizes?: boolean
  updatedAt?: string
}

export function getStorageRuntimePath(): string {
  return resolveDataFile('storage-runtime.json', 'CRISPY_STORAGE_RUNTIME_PATH')
}

export function readStorageRuntimeFile(): StorageRuntimeConfig | null {
  try {
    const filePath = getStorageRuntimePath()
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw) as StorageRuntimeConfig
  } catch {
    return null
  }
}

export function writeStorageRuntimeFile(config: StorageRuntimeConfig): void {
  const filePath = getStorageRuntimePath()
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

type StorageSettingsLike = {
  mode?: string | null
  activeTarget?: unknown
}

/**
 * Persist Active storage target for sync plugin bootstrap after restart.
 * Pass `settingsOverride` from Global afterChange `doc` to avoid reading uncommitted state.
 */
export async function syncStorageRuntimeFile(
  payload: Payload,
  settingsOverride?: StorageSettingsLike | null,
): Promise<void> {
  const settings =
    settingsOverride ??
    (await payload.findGlobal({
      slug: 'storage-settings',
      depth: 0,
      overrideAccess: true,
    }))

  const mode = settings?.mode === 's3' ? 's3' : 'local'
  if (mode !== 's3') {
    writeStorageRuntimeFile({ mode: 'local', updatedAt: new Date().toISOString() })
    payload.logger.info({ msg: 'storage-runtime synced', mode: 'local', reason: 'mode-not-s3' })
    return
  }

  const targetId = relationId(settings?.activeTarget)
  if (targetId == null) {
    writeStorageRuntimeFile({ mode: 'local', updatedAt: new Date().toISOString() })
    payload.logger.warn({
      msg: 'storage-runtime fell back to local',
      reason: 'activeTarget-missing',
    })
    return
  }

  const target = await payload.findByID({
    collection: 'storage-targets',
    id: targetId,
    depth: 0,
    overrideAccess: true,
    context: { returnSecrets: true },
  })

  if (!target || target.enabled === false) {
    writeStorageRuntimeFile({ mode: 'local', updatedAt: new Date().toISOString() })
    payload.logger.warn({
      msg: 'storage-runtime fell back to local',
      reason: !target ? 'target-not-found' : 'target-disabled',
      targetId,
    })
    return
  }

  if (!target.accessKeyId || !target.secretAccessKey) {
    writeStorageRuntimeFile({ mode: 'local', updatedAt: new Date().toISOString() })
    payload.logger.error({
      msg: 'storage-runtime fell back to local',
      reason: 'secrets-unavailable',
      targetId,
    })
    return
  }

  writeStorageRuntimeFile({
    mode: 's3',
    bucket: target.bucket,
    region: target.region || 'us-east-1',
    endpoint: target.endpoint || undefined,
    prefix: target.prefix || 'media',
    accessKeyId: target.accessKeyId,
    secretAccessKey: target.secretAccessKey,
    forcePathStyle: target.forcePathStyle !== false,
    publicBaseUrl: target.publicBaseUrl || undefined,
    virtualSizes: target.virtualSizes !== false,
    updatedAt: new Date().toISOString(),
  })
  payload.logger.info({
    msg: 'storage-runtime synced',
    mode: 's3',
    bucket: target.bucket,
    targetId,
  })
}
