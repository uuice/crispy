#!/usr/bin/env node
/**
 * Crispy CLI — single package.json script entry.
 * Usage: pnpm cli <group:command> [args…]
 *        pnpm cli help [group|group:command]
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const IS_WIN = process.platform === 'win32'
const PNPM = IS_WIN ? 'pnpm.cmd' : 'pnpm'

/** @type {Record<string, { title: string, commands: CommandDef[] }>} */
const GROUPS = {
  dev: {
    title: '开发与构建',
    commands: [
      {
        id: 'dev',
        summary: '开发服务器（端口 3333）+ 主题 CSS watch',
        note: '本地默认 SQLite，无需 Docker。等价于 dev-with-theme-css.mjs。',
        run: () => nodeScript('dev-with-theme-css.mjs'),
      },
      {
        id: 'build',
        summary: '编译主题 CSS + Next 生产构建',
        note: 'build 前自动跑 theme CSS；build 后自动生成 sitemap。',
        run: async () => {
          await runChain([
            () => nodeScript('build-theme-css.mjs'),
            () => runProductionBuild(),
          ])
        },
      },
      {
        id: 'start',
        summary: '启动生产服务器（需先 build）',
        note: '配合 DATABASE_PUSH=false + pnpm cli db:migrate 用于生产。',
        run: () => pnpmExec(['cross-env', 'NODE_OPTIONS=--no-deprecation', 'next', 'start']),
      },
      {
        id: 'dev-prod',
        summary: '清空 .next → build → start（本地模拟生产）',
        note: '排查生产构建问题时使用，较慢。',
        run: async () => {
          rmRf('.next')
          await runChain([
            () => nodeScript('build-theme-css.mjs'),
            () => runProductionBuild(),
            () => pnpmExec(['cross-env', 'NODE_OPTIONS=--no-deprecation', 'next', 'start']),
          ])
        },
      },
      {
        id: 'pack',
        summary: 'build + 打包 standalone 部署目录',
        note: '输出 dist/crispy-*-standalone-*.tar.gz。',
        run: async () => {
          const build = lookup.get('dev:build')
          await build.def.run([])
          bashScript('pack-standalone.sh')
        },
      },
      {
        id: 'pack-standalone',
        summary: '仅打包 standalone（需已 build）',
        note: '不重新 build；缺少 .next/standalone 会报错。',
        run: () => bashScript('pack-standalone.sh'),
      },
    ],
  },
  theme: {
    title: '主题 CSS（通常由 dev/build 自动调用）',
    commands: [
      {
        id: 'build',
        summary: '编译 blog/cms/kb → public/theme-assets/*.css',
        note: 'layout 运行时只 link 当前主题；部署前须执行或由 build 触发。',
        run: () => nodeScript('build-theme-css.mjs'),
      },
      {
        id: 'watch',
        summary: '编译并 watch 主题 CSS',
        note: '单独调试主题样式时使用；dev 已内置 watch。',
        run: () => nodeScript('build-theme-css.mjs', ['--watch']),
      },
    ],
  },
  generate: {
    title: '代码生成',
    commands: [
      {
        id: 'types',
        summary: '更新 src/payload-types.ts',
        note: '新增/修改 Collection 或 Global 字段后必跑。',
        run: () => payload(['generate:types']),
      },
      {
        id: 'importmap',
        summary: '更新 Admin 自定义组件 import map',
        note: '改 Admin 视图/字段组件后必跑。',
        run: () => payload(['generate:importmap']),
      },
      {
        id: 'openapi',
        summary: '写入 public/openapi.json（Swagger 静态备份）',
        note: '运行时也可 GET /api/openapi.json；生产勿公开静态文件。',
        run: () => tsxScript('generate-openapi.ts'),
      },
    ],
  },
  db: {
    title: '数据库与 Docker',
    commands: [
      {
        id: 'migrate',
        summary: '执行 Postgres 迁移',
        note: '生产部署前必跑；本地 SQLite 开发通常不需要。',
        run: () => payload(['migrate']),
      },
      {
        id: 'status',
        summary: '查看迁移状态',
        note: 'CI 与部署后验收用。',
        run: () => payload(['migrate:status']),
      },
      {
        id: 'create',
        summary: '新建 Postgres 迁移（需 Docker PG + Node 22）',
        note: 'SQLite 不可用；参数：迁移名称。例：pnpm cli db:create add_foo',
        run: (args) => bashScript('migrate-create.sh', args),
      },
      {
        id: 'bootstrap',
        summary: '首次 Postgres 迁移（Docker up + create initial + migrate）',
        note: '空仓库初始化 PG schema；已有 migrations 时只 migrate。',
        run: () => bashScript('bootstrap-postgres-migration.sh'),
      },
      {
        id: 'seed',
        summary: 'CLI 填充示例数据',
        note: '含 MCP 测试用户；也可在 Admin 仪表盘点击填充。',
        run: () => tsxScript('run-seed.ts'),
      },
      {
        id: 'import-astro-learn',
        summary: '从 astro-learn 导入迁移 manifest',
        note: '默认读取 ../astro-learn；可设 ASTRO_LEARN_PATH。seed 前须先执行。',
        run: () => tsxScript('import-astro-learn.ts'),
      },
      {
        id: 'push-schema',
        summary: '一次性 dev schema push（SQLite 漂移修复）',
        note: '需 DATABASE_PUSH=true；慎用，生产禁止 push。',
        run: () => tsxScript('push-dev-schema.ts'),
      },
      {
        id: 'docker-up',
        summary: 'docker compose up -d（启动 PostgreSQL）',
        note: '本地 PG 调试时使用。',
        run: () => spawnSyncInherit('docker', ['compose', 'up', '-d']),
      },
      {
        id: 'docker-down',
        summary: 'docker compose down（停止 PostgreSQL）',
        note: '停止本地 PostgreSQL 容器。',
        run: () => spawnSyncInherit('docker', ['compose', 'down']),
      },
    ],
  },
  verify: {
    title: '冒烟验证',
    commands: [
      {
        id: 'phase1',
        summary: 'MCP + Preview + RSS',
        note: '可选 MCP_API_KEY=xxx；未设置则跳过 MCP 段。',
        run: () => tsxScript('verify-phase1.ts'),
      },
      {
        id: 'phase2',
        summary: '图库 / 招聘 / 中文前台 / access-log',
        note: '需 dev 服务器运行中。',
        run: () => tsxScript('verify-phase2.ts'),
      },
      {
        id: 'ai',
        summary: 'DeepSeek 连通与流式 API',
        note: '需 .env 中 DeepSeek API Key。',
        run: () => tsxScript('verify-ai.ts'),
      },
      {
        id: 'all',
        summary: '依次跑 phase1 → phase2 → ai',
        note: '发布前完整冒烟；任一步失败即退出。',
        run: async () => {
          await runChain([
            () => tsxScript('verify-phase1.ts'),
            () => tsxScript('verify-phase2.ts'),
            () => tsxScript('verify-ai.ts'),
          ])
        },
      },
    ],
  },
  ai: {
    title: 'AI 工具',
    commands: [
      {
        id: 'backfill',
        summary: '回填内容 embedding 向量',
        note: '语义搜索 / AI 助手索引维护。',
        run: () => tsxScript('backfill-embeddings.ts'),
      },
    ],
  },
  mcp: {
    title: 'MCP',
    commands: [
      {
        id: 'key',
        summary: '为 agent 用户生成 MCP API Key',
        note: '需先 pnpm cli db:seed；输出 MCP_API_KEY 供 verify:phase1 使用。',
        run: () => tsxScript('create-mcp-key.ts'),
      },
    ],
  },
  quality: {
    title: '质量与 CI',
    commands: [
      {
        id: 'lint-fix',
        summary: 'ESLint 检查并自动修复',
        note: '同 quality:lint --fix。',
        run: () =>
          pnpmExec([
            'cross-env',
            'NODE_OPTIONS=--no-deprecation',
            'eslint',
            '.',
            '--fix',
          ]),
      },
      {
        id: 'lint',
        summary: 'ESLint 检查',
        note: '加 --fix 自动修复：pnpm cli quality:lint --fix',
        run: (args) =>
          pnpmExec([
            'cross-env',
            'NODE_OPTIONS=--no-deprecation',
            'eslint',
            '.',
            ...(args.includes('--fix') ? ['--fix'] : []),
          ]),
      },
      {
        id: 'tsc',
        summary: 'TypeScript 类型检查（不 emit）',
        note: 'ci:check 的子步骤。',
        run: () => pnpmExec(['exec', 'tsc', '--noEmit']),
      },
      {
        id: 'test',
        summary: 'test int|e2e|all',
        note: '默认 all = vitest + playwright。',
        run: (args) => {
          const sub = args[0] || 'all'
          if (sub === 'int') {
            return pnpmExec([
              'cross-env',
              'NODE_OPTIONS=--no-deprecation',
              'vitest',
              'run',
              '--config',
              './vitest.config.mts',
            ])
          }
          if (sub === 'e2e') {
            return pnpmExec([
              'cross-env',
              'NODE_OPTIONS=--no-deprecation --import=tsx/esm',
              'playwright',
              'test',
              '--config=playwright.config.ts',
            ])
          }
          if (sub === 'all') {
            return runChain([
              () =>
                pnpmExec([
                  'cross-env',
                  'NODE_OPTIONS=--no-deprecation',
                  'vitest',
                  'run',
                  '--config',
                  './vitest.config.mts',
                ]),
              () =>
                pnpmExec([
                  'cross-env',
                  'NODE_OPTIONS=--no-deprecation --import=tsx/esm',
                  'playwright',
                  'test',
                  '--config=playwright.config.ts',
                ]),
            ])
          }
          fail('用法：pnpm cli quality:test int|e2e|all')
        },
      },
      {
        id: 'ci',
        summary: '本地 CI：lint + tsc + test:int + build',
        note: '与 GitHub Actions 对齐；build 使用 CI SQLite 库。',
        run: async () => {
          const ciEnv = {
            DATABASE_URL: 'file:./.data/ci-payload.db',
            DATABASE_DRIVER: 'sqlite',
          }
          await runChain([
            () =>
              pnpmExec([
                'cross-env',
                'NODE_OPTIONS=--no-deprecation',
                'eslint',
                '.',
              ]),
            () => pnpmExec(['exec', 'tsc', '--noEmit']),
            () =>
              pnpmExec(
                [
                  'cross-env',
                  'NODE_OPTIONS=--no-deprecation',
                  'vitest',
                  'run',
                  '--config',
                  './vitest.config.mts',
                ],
                ciEnv,
              ),
            () => nodeScript('build-theme-css.mjs'),
            () => runProductionBuild(ciEnv),
          ])
        },
      },
    ],
  },
  util: {
    title: '工具',
    commands: [
      {
        id: 'payload',
        summary: '透传 payload 子命令',
        note: '例：pnpm cli util:payload migrate:create foo',
        run: (args) => payload(args),
      },
      {
        id: 'install',
        summary: 'pnpm install --ignore-workspace',
        note: 'monorepo 边缘场景；一般直接用 pnpm install。',
        run: () =>
          pnpmExec(['cross-env', 'NODE_OPTIONS=--no-deprecation', '--ignore-workspace', 'install']),
      },
      {
        id: 'reinstall',
        summary: '删除 node_modules 与 lockfile 后重装',
        note: '依赖异常时的核弹选项。',
        run: async () => {
          rmRf('node_modules')
          try {
            spawnSync('rm', ['-f', 'pnpm-lock.yaml'], { cwd: ROOT, stdio: 'inherit' })
          } catch {
            /* windows may lack rm */
          }
          pnpmExec(['cross-env', 'NODE_OPTIONS=--no-deprecation', '--ignore-workspace', 'install'])
        },
      },
    ],
  },
}

/** @typedef {{ id: string, summary: string, note: string, run: (args: string[]) => void | Promise<void> }} CommandDef */

/** @type {Map<string, { group: string, def: CommandDef, name: string }>} */
const lookup = new Map()

function commandName(groupKey, id) {
  return `${groupKey}:${id}`
}

for (const [groupKey, group] of Object.entries(GROUPS)) {
  for (const def of group.commands) {
    const name = commandName(groupKey, def.id)
    lookup.set(name, { group: groupKey, def, name })
  }
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function spawnSyncInherit(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--no-deprecation', ...env },
  })
  if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1)
}

function pnpmExec(args, env = {}) {
  spawnSyncInherit(PNPM, ['exec', ...args], env)
}

function runProductionBuild(env = {}) {
  pnpmExec(['cross-env', 'NODE_OPTIONS=--no-deprecation', 'next', 'build'], env)
  pnpmExec(['next-sitemap', '--config', 'next-sitemap.config.cjs'], env)
}

function payload(args) {
  pnpmExec(['cross-env', 'NODE_OPTIONS=--no-deprecation', 'payload', ...args])
}

function nodeScript(name, args = []) {
  spawnSyncInherit(process.execPath, [path.join('scripts', name), ...args])
}

function bashScript(name, args = []) {
  spawnSyncInherit('bash', [path.join('scripts', name), ...args])
}

function tsxScript(name, args = []) {
  pnpmExec(['cross-env', 'NODE_OPTIONS=--no-deprecation', 'tsx', path.join('scripts', name), ...args])
}

function rmRf(relativePath) {
  spawnSync('rm', ['-rf', relativePath], { cwd: ROOT, stdio: 'inherit' })
}

async function runChain(steps) {
  for (const step of steps) {
    await step()
  }
}

function printHelp(topic) {
  if (topic) {
    const groupSection = GROUPS[topic]
    if (groupSection) {
      console.log(`\n── ${groupSection.title} (${topic}) ──\n`)
      for (const def of groupSection.commands) {
        const name = commandName(topic, def.id)
        console.log(`  ${name.padEnd(22)} ${def.summary}`)
        console.log(`    备注：${def.note}`)
      }
      console.log('')
      return
    }

    const hit = lookup.get(topic)
    if (!hit) {
      console.error(`未知命令：${topic}`)
      printHelp()
      process.exit(1)
    }
    const { name, def } = hit
    console.log(`\n${name}`)
    console.log(`  ${def.summary}`)
    console.log(`  备注：${def.note}\n`)
    return
  }

  console.log(`
Crispy CLI — 统一开发命令入口

用法:
  pnpm cli                         显示本帮助（package.json 仅此一条 scripts）
  pnpm cli <group:command> [args]  唯一命令格式（如 db:migrate、dev:dev）
  pnpm cli help [group|group:command]  查看分组或单条备注

常用:
  pnpm cli dev:dev                 开发（3333）
  pnpm cli dev:build               生产构建
  pnpm cli db:migrate              跑迁移
  pnpm cli generate:types          更新 payload-types
  pnpm cli verify:all              完整冒烟
  pnpm cli quality:ci              本地 CI
`)

  for (const [groupKey, group] of Object.entries(GROUPS)) {
    console.log(`── ${group.title} (${groupKey}) ──`)
    for (const def of group.commands) {
      const name = commandName(groupKey, def.id)
      console.log(`  ${name.padEnd(22)} ${def.summary}`)
    }
    console.log('')
  }
}

async function dispatch(argv) {
  if (argv.length === 0 || argv[0] === 'help' || argv[0] === '-h' || argv[0] === '--help') {
    printHelp(argv[1])
    return
  }

  const hit = lookup.get(argv[0])
  if (hit) {
    await hit.def.run(argv.slice(1))
    return
  }

  console.error(`未知命令：${argv.join(' ')}（须使用 group:command 格式，如 db:migrate）`)
  printHelp()
  process.exit(1)
}

dispatch(process.argv.slice(2)).catch((error) => {
  console.error(error)
  process.exit(1)
})
