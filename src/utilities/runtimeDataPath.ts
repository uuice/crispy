import path from 'path'

/**
 * Resolve a file under repo `.data/`.
 * Prefer an absolute env override; otherwise use a cwd-relative path without
 * calling `process.cwd()`, so Next/Turbopack NFT does not treat the whole
 * project root as a traced dependency.
 */
export function resolveDataFile(filename: string, envName: string): string {
  const override = process.env[envName]?.trim()
  if (override) return path.resolve(override)
  return path.resolve('.data', filename)
}
