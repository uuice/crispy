import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core'
import { provideRouter, withRouterConfig, RouteReuseStrategy } from '@angular/router'

import { routes } from './app.routes'
import { provideClientHydration, withEventReplay } from '@angular/platform-browser'

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import Aura from '@primeng/themes/aura'
import nora from '@primeng/themes/nora'
import lara from '@primeng/themes/lara'

import { MessageService } from 'primeng/api'
import { CustomReuseStrategy } from './backstage/services/route-reuse.strategy'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    ),
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy
    },
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: lara,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    }),
    MessageService
  ]
}
