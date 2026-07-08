/**
 * One-off OSS connectivity test. Usage: pnpm exec tsx scripts/test-oss.ts
 */
import 'dotenv/config'
import { createRequire } from 'node:module'

import { buildVirtualMediaSizes } from '../src/uploads/ossVirtualSizes.ts'
import { isOssVirtualSizesEnabled } from '../src/uploads/isOssVirtualSizesEnabled.ts'
import { isS3Enabled } from '../src/storage/s3.ts'

const require = createRequire(import.meta.url)
const { HeadBucketCommand, ListObjectsV2Command, PutObjectCommand, S3Client } = require('@aws-sdk/client-s3') as typeof import('@aws-sdk/client-s3')

function mask(value: string | undefined): string {
  if (!value) return '(unset)'
  if (value.length <= 8) return '***'
  return `${value.slice(0, 4)}...${value.slice(-4)}`
}

async function main() {
  console.log('=== Crispy OSS Test ===\n')

  console.log('Config:')
  console.log(`  S3 enabled: ${isS3Enabled()}`)
  console.log(`  Virtual sizes: ${isOssVirtualSizesEnabled()}`)
  console.log(`  Bucket: ${process.env.S3_BUCKET ?? '(unset)'}`)
  console.log(`  Region: ${process.env.S3_REGION ?? '(unset)'}`)
  console.log(`  Endpoint: ${process.env.S3_ENDPOINT ?? '(unset)'}`)
  console.log(`  Prefix: ${process.env.S3_PREFIX ?? 'media'}`)
  console.log(`  Public base: ${process.env.S3_PUBLIC_BASE_URL ?? '(unset)'}`)
  console.log(`  Force path style: ${process.env.S3_FORCE_PATH_STYLE ?? '(default true)'}`)
  console.log(`  Access key: ${mask(process.env.S3_ACCESS_KEY_ID)}`)
  console.log()

  if (!isS3Enabled()) {
    console.error('FAIL: S3_* env vars incomplete')
    process.exit(1)
  }

  const region = process.env.S3_REGION ?? 'us-east-1'
  const endpoint = process.env.S3_ENDPOINT
  const client = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    region,
    ...(endpoint
      ? {
          endpoint,
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
        }
      : {}),
  })

  const bucket = process.env.S3_BUCKET!
  const prefix = process.env.S3_PREFIX ?? 'media'
  const testKey = `${prefix}/crispy-oss-test-${Date.now()}.txt`
  const publicBase = process.env.S3_PUBLIC_BASE_URL?.replace(/\/$/, '')

  // 1. Head bucket
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
    console.log('OK  HeadBucket — bucket reachable')
  } catch (error) {
    console.error('FAIL HeadBucket:', error instanceof Error ? error.message : error)
    process.exit(1)
  }

  // 2. List existing objects
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
    console.warn('WARN ListObjects:', error instanceof Error ? error.message : error)
  }

  // 3. Put test object
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: testKey,
        Body: 'crispy oss test',
        ContentType: 'text/plain',
      }),
    )
    console.log(`OK  PutObject — uploaded ${testKey}`)
  } catch (error) {
    console.error('FAIL PutObject:', error instanceof Error ? error.message : error)
    process.exit(1)
  }

  const originalUrl = publicBase
    ? `${publicBase}/${testKey.replace(`${prefix}/`, `${prefix}/`)}`
    : `${endpoint?.replace(/\/$/, '')}/${bucket}/${testKey}`

  // Fix URL: public base already includes bucket domain, key is prefix/filename
  const objectUrl = publicBase ? `${publicBase}/${testKey}` : originalUrl

  // 4. Public HTTP read
  try {
    const res = await fetch(objectUrl, { method: 'GET' })
    if (res.ok) {
      console.log(`OK  Public GET — ${res.status} ${objectUrl}`)
    } else {
      console.warn(`WARN Public GET — ${res.status} (object uploaded but not public-read?)`)
      console.warn(`     URL: ${objectUrl}`)
    }
  } catch (error) {
    console.warn('WARN Public GET failed:', error instanceof Error ? error.message : error)
  }

  // 5. Virtual sizes — prefer an existing image key if present
  let sampleImageUrl = publicBase
    ? `${publicBase}/${prefix}/oss-test-sample.jpg`
    : `${endpoint?.replace(/\/$/, '')}/${bucket}/${prefix}/oss-test-sample.jpg`

  try {
    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: `${prefix}/`, MaxKeys: 20 }),
    )
    const imageKey = listed.Contents?.find((item) =>
      /\.(jpe?g|png|webp|gif)$/i.test(item.Key ?? ''),
    )?.Key
    if (imageKey && publicBase) {
      sampleImageUrl = `${publicBase}/${imageKey.replace(`${prefix}/`, `${prefix}/`)}`
      if (publicBase.endsWith('/')) {
        sampleImageUrl = `${publicBase}${imageKey}`
      } else {
        sampleImageUrl = `${publicBase}/${imageKey}`
      }
      console.log(`     using existing image: ${imageKey}`)
    }
  } catch {
    // ignore
  }

  const sizes = buildVirtualMediaSizes({
    url: sampleImageUrl,
    filename: 'oss-test-sample.jpg',
    mimeType: 'image/jpeg',
    width: 2000,
    height: 1500,
  })

  if (!sizes?.thumbnail?.url) {
    console.error('FAIL Virtual sizes URL generation')
    process.exit(1)
  }

  console.log('OK  Virtual sizes generated')
  console.log(`     thumbnail: ${sizes.thumbnail.url}`)

  // 6. Test OSS image processing
  try {
    const imgRes = await fetch(sizes.thumbnail.url, { method: 'HEAD' })
    if (imgRes.ok) {
      console.log(`OK  OSS IMG processing — ${imgRes.status}`)
    } else if (imgRes.status === 404) {
      console.log('SKIP OSS IMG — sample image not in bucket (upload a real image to verify IMG)')
    } else {
      console.warn(`WARN OSS IMG — ${imgRes.status} ${imgRes.statusText}`)
    }
  } catch (error) {
    console.warn('WARN OSS IMG HEAD failed:', error instanceof Error ? error.message : error)
  }

  console.log('\n=== Done ===')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
