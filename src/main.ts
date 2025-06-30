import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { App } from './app/app'

// Import Quill and make it available globally
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

// Make Quill available globally for PrimeNG Editor
;(window as any).Quill = Quill

bootstrapApplication(App, appConfig).catch((err) => console.error(err))
