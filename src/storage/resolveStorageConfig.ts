import { readStorageRuntimeFile, type StorageRuntimeConfig } from '@/storage/syncStorageRuntimeFile'

export type ResolvedStorageConfig = {
  enabled: boolean
  mode: 'local' | 's3'
  bucket: string
  region: string
  endpoint?: string
  prefix: string
  accessKeyId: string
  secretAccessKey: string
  forcePathStyle: boolean
  publicBaseUrl?: string
  virtualSizes: boolean
  source: 'runtime-file' | 'none'
}

function localConfig(): ResolvedStorageConfig {
  return {
    enabled: false,
    mode: 'local',
    bucket: '',
    region: 'us-east-1',
    prefix: 'media',
    accessKeyId: '',
    secretAccessKey: '',
    forcePathStyle: true,
    virtualSizes: false,
    source: 'none',
  }
}

function fromRuntime(file: StorageRuntimeConfig): ResolvedStorageConfig | null {
  if (file.mode !== 's3') {
    return {
      ...localConfig(),
      mode: 'local',
      source: 'runtime-file',
    }
  }

  if (!file.bucket || !file.accessKeyId || !file.secretAccessKey) return null

  return {
    enabled: true,
    mode: 's3',
    bucket: file.bucket,
    region: file.region || 'us-east-1',
    endpoint: file.endpoint || undefined,
    prefix: (file.prefix ?? 'media').replace(/^\/+|\/+$/g, '') || 'media',
    accessKeyId: file.accessKeyId,
    secretAccessKey: file.secretAccessKey,
    forcePathStyle: file.forcePathStyle !== false,
    publicBaseUrl: file.publicBaseUrl?.replace(/\/$/, '') || undefined,
    virtualSizes: file.virtualSizes !== false,
    source: 'runtime-file',
  }
}

/**
 * Sync resolver for plugin bootstrap and upload helpers.
 * Reads Admin Active via .data/storage-runtime.json only (no S3_* env fallback).
 */
export function resolveStorageConfigSync(): ResolvedStorageConfig {
  const runtime = readStorageRuntimeFile()
  if (runtime) {
    const parsed = fromRuntime(runtime)
    if (parsed) return parsed
  }
  return localConfig()
}
