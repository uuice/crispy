/**
 * One-off OSS connectivity test. Usage: pnpm exec tsx scripts/test-oss.ts
 * Reads Admin Active storage from .data/storage-runtime.json.
 */
import 'dotenv/config'
import { createRequire } from 'node:module'

import { buildVirtualMediaSizes } from '../src/uploads/ossVirtualSizes.ts'
import { isOssVirtualSizesEnabled } from '../src/uploads/isOssVirtualSizesEnabled.ts'
import { isS3Enabled } from '../src/storage/s3.ts'
import { resolveStorageConfigSync } from '../src/storage/resolveStorageConfig.ts'

const require = createRequire(import.meta.url)
const { HeadBucketCommand, ListObjectsV2Command, PutObjectCommand, S3Client } =
  require('@aws-sdk/client-s3') as typeof import('@aws-sdk/client-s3')

function mask(value: string | undefined): string {
  if (!value) return '(unset)'
  if (value.length <= 8) return '***'
  return `${value.slice(0, 4)}...${value.slice(-4)}`
}

async function main() {
  console.log('=== Crispy OSS Test ===\n')

  const storage = resolveStorageConfigSync()

  console.log('Config (Admin storage-runtime):')
  console.log(`  S3 enabled: ${isS3Enabled()}`)
  console.log(`  Virtual sizes: ${isOssVirtualSizesEnabled()}`)
  console.log(`  Bucket: ${storage.bucket || '(unset)'}`)
  console.log(`  Region: ${storage.region}`)
  console.log(`  Endpoint: ${storage.endpoint ?? '(unset)'}`)
  console.log(`  Prefix: ${storage.prefix}`)
  console.log(`  Public base: ${storage.publicBaseUrl ?? '(unset)'}`)
  console.log(`  Force path style: ${storage.forcePathStyle}`)
  console.log(`  Access key: ${mask(storage.accessKeyId)}`)
  console.log()

  if (!isS3Enabled()) {
    console.error('FAIL: S3 not enabled — set Admin 存储设置 mode=s3 + Active target, then restart')
    process.exit(1)
  }

  const client = new S3Client({
    credentials: {
      accessKeyId: storage.accessKeyId,
      secretAccessKey: storage.secretAccessKey,
    },
    region: storage.region,
    ...(storage.endpoint
      ? {
          endpoint: storage.endpoint,
          forcePathStyle: storage.forcePathStyle,
        }
      : {}),
  })

  const bucket = storage.bucket
  const prefix = storage.prefix
  const testKey = `${prefix}/crispy-oss-test-${Date.now()}.txt`
  const publicBase = storage.publicBaseUrl

  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
    console.log('OK  HeadBucket — bucket reachable')
  } catch (error) {
    console.error('FAIL HeadBucket:', error instanceof Error ? error.message : error)
    process.exit(1)
  }

  try {
    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: `${prefix}/`, MaxKeys: 5 }),
    )
    const count = listed.KeyCount ?? listed.Contents?.length ?? 0
    console.log(`OK  ListObjects — ${count} object(s) under ${prefix}/`)
    for (const item of listed.Contents ?? []) {
      console.log(`     - ${item.Key}`)
    }
  } catch (error) {
    console.error('FAIL ListObjects:', error instanceof Error ? error.message : error)
    process.exit(1)
  }

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: testKey,
        Body: 'crispy oss test',
        ContentType: 'text/plain',
      }),
    )
    console.log(`OK  PutObject — ${testKey}`)
  } catch (error) {
    console.error('FAIL PutObject:', error instanceof Error ? error.message : error)
    process.exit(1)
  }

  if (publicBase) {
    const sampleUrl = `${publicBase}/${testKey}`
    console.log(`OK  Public URL sample: ${sampleUrl}`)
  }

  if (isOssVirtualSizesEnabled()) {
    const sizes = buildVirtualMediaSizes({
      url: publicBase ? `${publicBase}/${prefix}/sample.jpg` : `https://example.com/${prefix}/sample.jpg`,
      filename: 'sample.jpg',
      mimeType: 'image/jpeg',
      width: 2000,
      height: 1500,
    })
    console.log(`OK  Virtual sizes — ${Object.keys(sizes ?? {}).length} variants`)
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
