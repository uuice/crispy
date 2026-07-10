import type { PrismTheme } from 'prism-react-renderer'

/** Prism theme wired to blog --chroma-* tokens (follows --hue in light/dark). */
export const crispyPrismTheme: PrismTheme = {
  plain: {
    color: 'var(--text)',
    backgroundColor: 'var(--card-bg)',
  },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'var(--chroma-comment)' } },
    { types: ['builtin'], style: { color: 'var(--chroma-info)' } },
    { types: ['number', 'variable', 'inserted'], style: { color: 'var(--chroma-prompt)' } },
    { types: ['operator'], style: { color: 'var(--chroma-chevron)' } },
    { types: ['constant', 'char'], style: { color: 'var(--chroma-hash)' } },
    { types: ['tag'], style: { color: 'var(--chroma-keyword)' } },
    { types: ['attr-name'], style: { color: 'var(--chroma-flag)' } },
    { types: ['deleted', 'string'], style: { color: 'var(--chroma-prompt)' } },
    { types: ['changed', 'punctuation'], style: { color: 'var(--chroma-chevron)' } },
    { types: ['function', 'keyword'], style: { color: 'var(--chroma-keyword)' } },
    { types: ['class-name'], style: { color: 'var(--chroma-info)' } },
    { types: ['boolean', 'selector', 'atrule', 'property', 'regex'], style: { color: 'var(--chroma-flag)' } },
    { types: ['entity', 'url', 'symbol'], style: { color: 'var(--chroma-info)' } },
  ],
}
