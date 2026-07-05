import { spawn } from 'node:child_process'

const watch = spawn(process.execPath, ['scripts/build-theme-css.mjs', '--watch'], {
  cwd: process.cwd(),
  stdio: 'inherit',
})

const next = spawn(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  ['exec', 'next', 'dev', '-p', '3333'],
  {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--no-deprecation',
    },
  },
)

function shutdown(code = 0) {
  watch.kill('SIGTERM')
  next.kill('SIGTERM')
  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

watch.on('exit', (code) => {
  if (code && code !== 0) shutdown(code)
})

next.on('exit', (code) => {
  if (code && code !== 0) shutdown(code)
})
