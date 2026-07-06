/**
 * Replace darwin native bindings with linux binaries in a standalone bundle.
 * Patches sharp and libsql via npm pack — no Docker required.
 *
 * Usage: node scripts/patch-standalone-linux-native.mjs <staging-dir>
 * Env:   LINUX_ARCH=x64|arm64 (default x64), LINUX_LIBC=glibc|musl (default glibc)
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

const sharpPlatformSuffix =
  linuxLibc === 'musl' ? `linuxmusl-${linuxArch}` : `linux-${linuxArch}`

const libsqlTarget =
  linuxLibc === 'musl' ? `linux-${linuxArch}-musl` : `linux-${linuxArch}-gnu`

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

function removePnpmEntries(pnpmRoot, prefix) {
  for (const entry of fs.readdirSync(pnpmRoot)) {
    if (entry.startsWith(prefix)) {
      fs.rmSync(path.join(pnpmRoot, entry), { force: true, recursive: true })
    }
  }
}

function removeScopeSymlinks(pnpmRoot, parentPrefix, scopeFolder, platformPattern) {
  for (const entry of fs.readdirSync(pnpmRoot)) {
    if (!entry.startsWith(parentPrefix)) continue
    const scopeDir = path.join(pnpmRoot, entry, 'node_modules', scopeFolder)
    if (!fs.existsSync(scopeDir)) continue
    for (const name of fs.readdirSync(scopeDir)) {
      if (platformPattern.test(name)) {
        fs.rmSync(path.join(scopeDir, name), { force: true })
      }
    }
  }
}

function patchSharpVersion(sharpVersion, pnpmRoot) {
  const sharpPkgPath = path.join(pnpmRoot, `sharp@${sharpVersion}`, 'node_modules', 'sharp', 'package.json')
  if (!fs.existsSync(sharpPkgPath)) return

  const sharpPkg = JSON.parse(fs.readFileSync(sharpPkgPath, 'utf8'))
  const opt = sharpPkg.optionalDependencies || {}
  const sharpPlatform = `@img/sharp-${sharpPlatformSuffix}`
  const libvipsPlatform = `@img/sharp-libvips-${sharpPlatformSuffix}`

  const sharpPlatformVer = opt[sharpPlatform]
  const libvipsVer = opt[libvipsPlatform]
  if (!sharpPlatformVer) {
    throw new Error(`sharp@${sharpVersion} has no optional dep ${sharpPlatform}`)
  }

  installScopedPackage(sharpPlatform, sharpPlatformVer, pnpmRoot)
  if (libvipsVer) {
    installScopedPackage(libvipsPlatform, libvipsVer, pnpmRoot)
    const sharpImgDir = path.join(
      pnpmRoot,
      pnpmFolderName(sharpPlatform, sharpPlatformVer),
      'node_modules',
      '@img',
    )
    linkScopedPackage(sharpImgDir, libvipsPlatform, libvipsVer, pnpmRoot)
  }

  const imgDir = path.join(pnpmRoot, `sharp@${sharpVersion}`, 'node_modules', '@img')
  linkScopedPackage(imgDir, sharpPlatform, sharpPlatformVer, pnpmRoot)
  if (libvipsVer) linkScopedPackage(imgDir, libvipsPlatform, libvipsVer, pnpmRoot)
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

console.log(`→ Patching native modules for linux/${linuxArch} (${linuxLibc})`)

const sharpVersions = fs
  .readdirSync(pnpmDir)
  .filter((e) => e.startsWith('sharp@'))
  .map((e) => e.slice('sharp@'.length))

for (const version of sharpVersions) {
  console.log(`→ sharp@${version}`)
  patchSharpVersion(version, pnpmDir)
}

const libsqlVersions = fs
  .readdirSync(pnpmDir)
  .filter((e) => e.startsWith('libsql@'))
  .map((e) => e.slice('libsql@'.length))

for (const version of libsqlVersions) {
  console.log(`→ libsql@${version}`)
  patchLibsql(version, pnpmDir)
}

removePnpmEntries(pnpmDir, '@img+sharp-darwin')
removePnpmEntries(pnpmDir, '@img+sharp-libvips-darwin')
removePnpmEntries(pnpmDir, '@libsql+darwin')
removeScopeSymlinks(pnpmDir, 'sharp@', '@img', /darwin|win32/)
removeScopeSymlinks(pnpmDir, 'libsql@', '@libsql', /darwin|win32/)

console.log('→ Removed darwin native bindings')
