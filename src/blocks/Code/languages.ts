/** Admin Code block language options (Payload select). */
export const CODE_BLOCK_LANGUAGES = [
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'JSX', value: 'jsx' },
  { label: 'TSX', value: 'tsx' },
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'Less', value: 'less' },
  { label: 'HTML', value: 'markup' },
  { label: 'JSON', value: 'json' },
  { label: 'Bash', value: 'bash' },
  { label: 'Shell Session', value: 'shell-session' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Swift', value: 'swift' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'SQL', value: 'sql' },
  { label: 'YAML', value: 'yaml' },
  { label: 'TOML', value: 'toml' },
  { label: 'INI', value: 'ini' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Dockerfile', value: 'docker' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'PowerShell', value: 'powershell' },
  { label: 'Diff', value: 'diff' },
  { label: 'Git', value: 'git' },
  { label: 'HTTP', value: 'http' },
  { label: 'Nginx', value: 'nginx' },
] as const

export type CodeBlockLanguage = (typeof CODE_BLOCK_LANGUAGES)[number]['value']

const LANGUAGE_ALIASES: Record<string, CodeBlockLanguage> = {
  js: 'javascript',
  ts: 'typescript',
  html: 'markup',
  xml: 'markup',
  sass: 'scss',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  py: 'python',
  golang: 'go',
  rs: 'rust',
  'c++': 'cpp',
  cs: 'csharp',
  rb: 'ruby',
  yml: 'yaml',
  md: 'markdown',
  dockerfile: 'docker',
  gql: 'graphql',
  ps: 'powershell',
  ps1: 'powershell',
  jsonc: 'json',
  console: 'shell-session',
  terminal: 'shell-session',
}

const ALLOWED = new Set<string>(CODE_BLOCK_LANGUAGES.map((item) => item.value))

/** Normalize markdown fence language to a stored Code block language. */
export function normalizeCodeBlockLanguage(language: string): CodeBlockLanguage {
  const normalized = language.trim().toLowerCase()
  const mapped = LANGUAGE_ALIASES[normalized] ?? normalized
  if (ALLOWED.has(mapped)) return mapped as CodeBlockLanguage
  return 'javascript'
}
