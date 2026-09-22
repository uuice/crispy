import { Prism } from 'prism-react-renderer'

/** Expose prism-react-renderer's Prism so prismjs/components/* can attach grammars. */
const root = globalThis as typeof globalThis & { Prism?: typeof Prism }
root.Prism = Prism

export { Prism }
