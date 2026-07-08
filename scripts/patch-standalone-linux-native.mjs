/**
 * Replace darwin native bindings with Linux binaries in a standalone bundle,
 * then prune non-target platforms and dev-only packages.
 *
 * Usage: node scripts/patch-standalone-linux-native.mjs <staging-dir>
 *
 * Environment (set by pack-linux-standalone.sh, or override manually):
 *
 *   PACK_LINUX=1
 *     Enables Linux deploy mode in pack-standalone.sh (this script is only called when set).
 *
 *   LINUX_ARCH — default: x64
 *     Target server CPU: x64 (amd64) | arm64
 *
 *   LINUX_LIBC — default: glibc
 *     Target C library: glibc (Ubuntu/Debian/CentOS) | musl (Alpine)
 *
 * Examples:
 *   LINUX_ARCH=arm64 pnpm cli dev:pack-linux
 *   LINUX_LIBC=musl pnpm cli dev:pack-linux
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const stagingDir = process.argv[2]
if (!stagingDir) {
  console.error('usage: node scripts/patch-standalone-linux-native.mjs <staging-dir>')
  process.exit(1)
}

const linuxArch = process.env.LINUX_ARCH || 'x64'
const linuxLibc = process.env.LINUX_LIBC || 'glibc'
const pnpmDir = path.join(stagingDir, 'node_modules', '.pnpm')

if (!fs.existsSync(pnpmDir)) {
  console.error(`error: pnpm store not found at ${pnpmDir}`)
  process.exit(1)
}

const libsqlTarget =
  linuxLibc === 'musl' ? `linux-${linuxArch}-musl` : `linux-${linuxArch}-gnu`

const keepLibsqlPrefix = `@libsql+${libsqlTarget}@`

/** Next.js may still trace sharp; Crispy uses OSS virtual sizes and ships without sharp. */
const SHARP_PNPM_PREFIXES = ['sharp@', '@img+sharp-', '@img+sharp-libvips-']

/** Dev-only packages that should not ship in a Linux production tarball. */
const DEV_PNPM_PREFIXES = [
  '@playwright+test@',
  'playwright-core@',
  'playwright@',
  'vitest@',
  'jsdom@',
  '@testing-library+react@',
  'eslint@',
]

function npmPack(name, version) {
  const spec = version ? `${name}@${version}` : name
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'crispy-native-'))
  try {
    execFileSync('npm', ['pack', spec, '--pack-destination', tmp], {
      cwd: tmp,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const tgz = fs.readdirSync(tmp).find((f) => f.endsWith('.tgz'))
    if (!tgz) throw new Error(`npm pack returned no tarball for ${spec}`)
    return path.join(tmp, tgz)
  } catch (err) {
    throw new Error(`npm pack ${spec} failed: ${err instanceof Error ? err.message : err}`)
  }
}

function extractPackage(tgzPath, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  execFileSync('tar', ['-xzf', tgzPath, '-C', destDir, '--strip-components=1'], {
    stdio: 'ignore',
  })
}

function pnpmFolderName(scopePath, version) {
  return `${scopePath.replace('/', '+')}@${version}`
}

function installScopedPackage(scopePath, version, pnpmRoot) {
  const folder = pnpmFolderName(scopePath, version)
  const [scope, name] = scopePath.split('/')
  const dest = path.join(pnpmRoot, folder, 'node_modules', scope, name)
  if (fs.existsSync(dest)) return dest

  console.log(`  → ${scopePath}@${version}`)
  const tgz = npmPack(scopePath, version)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  extractPackage(tgz, dest)
  return dest
}

function linkScopedPackage(scopeDir, scopePath, version, pnpmRoot) {
  const [scope, name] = scopePath.split('/')
  const folder = pnpmFolderName(scopePath, version)
  const target = path.join(pnpmRoot, folder, 'node_modules', scope, name)
  const link = path.join(scopeDir, name)
  fs.mkdirSync(scopeDir, { recursive: true })
  if (fs.existsSync(link)) fs.rmSync(link, { force: true })
  fs.symlinkSync(path.relative(path.dirname(link), target), link)
}

function cleanLibsqlScopeSymlinks(pnpmRoot) {
  for (const entry of fs.readdirSync(pnpmRoot)) {
    if (!entry.startsWith('libsql@')) continue
    const libsqlScopeDir = path.join(pnpmRoot, entry, 'node_modules', '@libsql')
    if (!fs.existsSync(libsqlScopeDir)) continue
    for (const name of fs.readdirSync(libsqlScopeDir)) {
      if (name === libsqlTarget) continue
      if (name.startsWith('linux-') || name.startsWith('darwin') || name.startsWith('win32')) {
        fs.rmSync(path.join(libsqlScopeDir, name), { force: true })
      }
    }
  }
}

function patchLibsql(libsqlVersion, pnpmRoot) {
  const libsqlPkgPath = path.join(pnpmRoot, `libsql@${libsqlVersion}`, 'node_modules', 'libsql', 'package.json')
  if (!fs.existsSync(libsqlPkgPath)) return

  const libsqlPkg = JSON.parse(fs.readFileSync(libsqlPkgPath, 'utf8'))
  const platformPkg = `@libsql/${libsqlTarget}`
  const platformVer = libsqlPkg.optionalDependencies?.[platformPkg]
  if (!platformVer) {
    throw new Error(`libsql@${libsqlVersion} has no optional dep ${platformPkg}`)
  }

  installScopedPackage(platformPkg, platformVer, pnpmRoot)
  const libsqlScopeDir = path.join(pnpmRoot, `libsql@${libsqlVersion}`, 'node_modules', '@libsql')
  linkScopedPackage(libsqlScopeDir, platformPkg, platformVer, pnpmRoot)
}

function isSharpPnpmEntry(entry) {
  return SHARP_PNPM_PREFIXES.some((prefix) => entry.startsWith(prefix))
}

function shouldKeepLibsqlEntry(entry) {
  if (entry.startsWith(keepLibsqlPrefix)) return true
  if (entry.startsWith('@libsql+core@') || entry.startsWith('@libsql+client@')) return true
  if (entry.startsWith('@libsql+hrana-client@') || entry.startsWith('@libsql+isomorphic-')) return true
  return false
}

function installUnscopedPackage(name, version, pnpmRoot) {
  const folder = `${name}@${version}`
  const dest = path.join(pnpmRoot, folder, 'node_modules', name)
  if (fs.existsSync(dest)) return dest

  console.log(`  → ${name}@${version}`)
  const tgz = npmPack(name, version)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  extractPackage(tgz, dest)
  return dest
}

function resolveDrizzleKitVersion(stagingDir) {
  const pnpmRoot = path.join(stagingDir, 'node_modules', '.pnpm')
  const hit = fs.readdirSync(pnpmRoot).find((e) => e.startsWith('@payloadcms+db-postgres@'))
  if (!hit) return null

  const pkgPath = path.join(pnpmRoot, hit, 'node_modules', '@payloadcms/db-postgres', 'package.json')
  if (!fs.existsSync(pkgPath)) return null

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  return pkg.dependencies?.['drizzle-kit'] ?? null
}

/** withPayload excludes drizzle-kit from standalone trace but Turbopack still requires it at runtime. */
function patchTurbopackExternals(stagingDir) {
  const sourceNextModules = process.env.PATCH_SOURCE_NEXT_MODULES
  if (!sourceNextModules || !fs.existsSync(sourceNextModules)) return

  const drizzleVersion = resolveDrizzleKitVersion(stagingDir)
  if (drizzleVersion) {
    console.log('→ Ensuring drizzle-kit for Turbopack runtime externals...')
    installUnscopedPackage('drizzle-kit', drizzleVersion, pnpmDir)
  }

  const stagingNextModules = path.join(stagingDir, '.next', 'node_modules')
  fs.mkdirSync(stagingNextModules, { recursive: true })

  for (const entry of fs.readdirSync(sourceNextModules)) {
    if (!entry.startsWith('drizzle-kit-')) continue

    const dest = path.join(stagingNextModules, entry)
    if (fs.existsSync(dest)) continue

    const target = fs.readlinkSync(path.join(sourceNextModules, entry))
    fs.symlinkSync(target, dest)
    console.log(`  → linked .next/node_modules/${entry}`)
  }
}

function pruneStandaloneBundle(pnpmRoot) {
  console.log('→ Pruning non-target native platforms and dev dependencies...')
  let removedEntries = 0

  for (const entry of fs.readdirSync(pnpmRoot)) {
    let shouldRemove = false

    if (isSharpPnpmEntry(entry)) {
      shouldRemove = true
    } else if (entry.startsWith('@libsql+') && !shouldKeepLibsqlEntry(entry)) {
      shouldRemove = true
    } else if (DEV_PNPM_PREFIXES.some((prefix) => entry.startsWith(prefix))) {
      shouldRemove = true
    }

    if (shouldRemove) {
      fs.rmSync(path.join(pnpmRoot, entry), { force: true, recursive: true })
      removedEntries++
    }
  }

  cleanLibsqlScopeSymlinks(pnpmRoot)

  console.log(`→ Removed ${removedEntries} pnpm entries from bundle`)
}

function removePnpmEntries(pnpmRoot, prefix) {
  let removed = 0
  for (const entry of fs.readdirSync(pnpmRoot)) {
    if (entry.startsWith(prefix)) {
      fs.rmSync(path.join(pnpmRoot, entry), { force: true, recursive: true })
      removed++
    }
  }
  return removed
}

console.log(`→ Patching native modules for linux/${linuxArch} (${linuxLibc})`)

const libsqlVersions = fs
  .readdirSync(pnpmDir)
  .filter((e) => e.startsWith('libsql@'))
  .map((e) => e.slice('libsql@'.length))

for (const version of libsqlVersions) {
  console.log(`→ libsql@${version}`)
  patchLibsql(version, pnpmDir)
}

removePnpmEntries(pnpmDir, '@libsql+darwin')

patchTurbopackExternals(stagingDir)
console.log('→ Removing traced sharp packages (OSS virtual sizes; no runtime sharp)...')
for (const prefix of SHARP_PNPM_PREFIXES) {
  removePnpmEntries(pnpmDir, prefix)
}
pruneStandaloneBundle(pnpmDir)

console.log('→ Linux native patch and prune complete')
