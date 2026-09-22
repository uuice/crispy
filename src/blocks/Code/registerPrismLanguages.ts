/**
 * Register Admin Code-block languages missing from prism-react-renderer defaults.
 * Import order matters: set Prism on globalThis before prismjs components evaluate.
 */
import './setPrismGlobal'

import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-shell-session'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-less'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-toml'
import 'prismjs/components/prism-ini'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-powershell'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-http'
import 'prismjs/components/prism-nginx'
