import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const client = treaty<App>('localhost:4200')

const text = await client.html.get()
console.log(text)
