import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ToastModule } from 'primeng/toast'

@Component({
  selector: 'cs-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  template: `
    <style></style>
    <p-toast></p-toast>
    <router-outlet />
  `
})
export class App {}
