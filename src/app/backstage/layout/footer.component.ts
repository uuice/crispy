import { Component, Input } from '@angular/core'

@Component({
  selector: 'cs-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="copyright">
        <span>Copyright © {{ year }} Crispy Admin. Powered by UUICE.</span>
        <span>Version: 1.0.0</span>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: var(--p-content-background);
        border-top: 1px solid var(--p-content-border-color);
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        .copyright {
          font-size: 0.85rem;
        }
      }
    `
  ]
})
export class FooterComponent {
  @Input() year = new Date().getFullYear()
}
