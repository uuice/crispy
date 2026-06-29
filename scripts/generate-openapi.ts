import 'dotenv/config'
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import config from '@payload-config'
import { getPayload } from 'payload'

import { buildOpenApiDocument } from '../src/openapi/buildDocument'
import { getServerSideURL } from '../src/utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const root = path.resolve(path.dirname(filename), '..')

const payload = await getPayload({ config })
const serverUrl = getServerSideURL().replace(/\/$/, '')
const document = await buildOpenApiDocument(payload, serverUrl)

const outDir = path.join(root, 'public')
mkdirSync(outDir, { recursive: true })

const outPath = path.join(outDir, 'openapi.json')
writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8')

console.log(`OpenAPI spec written to ${outPath}`)
console.log(`Collections: ${payload.config.collections.length}`)
console.log(`Paths: ${Object.keys(document.paths).length}`)
