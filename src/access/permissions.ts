export const PERMISSION_CATALOG = [
  { value: 'posts:create', label: '创建文章', group: 'posts' },
  { value: 'posts:update:own', label: '编辑自己的文章', group: 'posts' },
  { value: 'posts:update:any', label: '编辑任意文章', group: 'posts' },
  { value: 'posts:delete', label: '删除文章', group: 'posts' },
  { value: 'posts:publish', label: '发布文章', group: 'posts' },
  { value: 'pages:manage', label: '管理单页', group: 'pages' },
  { value: 'pages:read:drafts', label: '查看单页草稿', group: 'pages' },
  { value: 'media:create', label: '上传媒体', group: 'media' },
  { value: 'media:update', label: '编辑媒体', group: 'media' },
  { value: 'media:delete', label: '删除媒体', group: 'media' },
  { value: 'taxonomy:manage', label: '管理分类/标签', group: 'taxonomy' },
  { value: 'ops:manage', label: '管理运营内容', group: 'ops' },
  { value: 'novels:manage', label: '管理小说', group: 'novels' },
  { value: 'novels:read:all', label: '阅读全部小说（含未启用）', group: 'novels' },
  { value: 'comments:moderate', label: '审核评论', group: 'comments' },
  { value: 'users:manage', label: '管理用户', group: 'users' },
  { value: 'roles:manage', label: '管理角色与权限', group: 'users' },
  { value: 'settings:site', label: '站点/导航/缓存设置', group: 'settings' },
  { value: 'settings:ai', label: 'AI 设置', group: 'settings' },
  { value: 'settings:comment', label: '评论设置', group: 'settings' },
  { value: 'settings:storage', label: '存储设置', group: 'settings' },
  { value: 'settings:email', label: '邮件设置', group: 'settings' },
  { value: 'catalog:secrets', label: '密钥类 Catalog', group: 'catalog' },
  { value: 'catalog:prompts:read', label: '查看 Prompt 模板', group: 'catalog' },
  { value: 'catalog:prompts:write', label: '修改 Prompt 模板', group: 'catalog' },
  { value: 'catalog:app-configs:read', label: '查看应用配置', group: 'catalog' },
  { value: 'catalog:app-configs:write', label: '修改应用配置', group: 'catalog' },
  { value: 'logs:read', label: '查看审计/访问日志', group: 'system' },
  { value: 'cache:manage', label: '管理前台缓存', group: 'system' },
  { value: 'stats:read', label: '查看内容统计', group: 'system' },
  { value: 'ai:use', label: '使用 AI / Agent', group: 'system' },
  { value: 'presets:manage', label: '管理查询预设', group: 'system' },
] as const

export type Permission = (typeof PERMISSION_CATALOG)[number]['value']

export const ALL_PERMISSIONS: Permission[] = PERMISSION_CATALOG.map((entry) => entry.value)

export const PERMISSION_SELECT_OPTIONS = PERMISSION_CATALOG.map((entry) => ({
  label: `${entry.group} · ${entry.label}`,
  value: entry.value,
}))

/** Stable system role slugs (seeded, not deletable). */
export type SystemRoleSlug = 'super-admin' | 'editor' | 'author'

export const SYSTEM_ROLE_SLUGS: SystemRoleSlug[] = ['super-admin', 'editor', 'author']

export type CrispyRole = SystemRoleSlug

const AUTHOR_PERMISSIONS: Permission[] = [
  'posts:create',
  'posts:update:own',
  'media:create',
  'media:update',
  'novels:read:all',
  'ai:use',
]

const EDITOR_PERMISSIONS: Permission[] = [
  ...AUTHOR_PERMISSIONS,
  'posts:update:any',
  'posts:delete',
  'posts:publish',
  'pages:manage',
  'pages:read:drafts',
  'media:delete',
  'taxonomy:manage',
  'ops:manage',
  'novels:manage',
  'comments:moderate',
  'settings:site',
  'catalog:prompts:read',
  'catalog:app-configs:read',
  'cache:manage',
  'stats:read',
  'presets:manage',
]

export const SYSTEM_ROLE_DEFINITIONS: Record<
  SystemRoleSlug,
  { name: string; description: string; permissions: Permission[] }
> = {
  'super-admin': {
    name: '超级管理员',
    description: '全部权限，含用户/角色与系统配置',
    permissions: [...ALL_PERMISSIONS],
  },
  editor: {
    name: '编辑',
    description: '内容与运营管理，不可改用户/角色与密钥配置',
    permissions: EDITOR_PERMISSIONS,
  },
  author: {
    name: '作者',
    description: '管理自己的文章（仅草稿）与媒体上传',
    permissions: AUTHOR_PERMISSIONS,
  },
}

export function isPermission(value: string): value is Permission {
  return (ALL_PERMISSIONS as string[]).includes(value)
}

export function uniquePermissions(values: readonly string[]): Permission[] {
  const set = new Set<Permission>()
  for (const value of values) {
    if (isPermission(value)) set.add(value)
  }
  return [...set]
}
