import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PanelMenuModule } from 'primeng/panelmenu'
import { ButtonModule } from 'primeng/button'
import { MenuItem } from 'primeng/api'

@Component({
  selector: 'cs-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, ButtonModule],
  template: `
    <aside class="sidebar" [class.sidebar-collapsed]="collapsed">
      <p-panelMenu [model]="items"></p-panelMenu>
      <div class="sidebar-header">
        <p-button
          icon="pi pi-bars"
          [text]="true"
          [rounded]="true"
          (onClick)="handleToggle()"
          title="Toggle sidebar"
        ></p-button>
      </div>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        width: 100%;
        height: 100%;
        background: var(--p-content-background);
        border-right: 1px solid var(--p-content-border-color);
        display: flex;
        flex-direction: column;
        overflow: auto;
      }

      .sidebar-header {
        padding: 1rem;
        border-top: 1px solid var(--p-content-border-color);
        flex-shrink: 0;
        display: flex;
        justify-content: flex-end;
        min-height: 50px;
      }

      /* Hide text in collapsed state */
      .sidebar-collapsed ::ng-deep .p-panelmenu .p-panelmenu-header .p-panelmenu-header-label {
        display: none !important;
      }

      .sidebar-collapsed ::ng-deep .p-panelmenu .p-panelmenu-content {
        display: none;
      }
    `
  ]
})
export class SidebarComponent {
  @Input() items: MenuItem[] = []
  @Input() collapsed = false
  @Output() toggleSidebar = new EventEmitter<void>()

  handleToggle(): void {
    console.log('Sidebar toggle button clicked')
    try {
      this.toggleSidebar.emit()
    } catch (error) {
      console.error('Error emitting toggleSidebar event:', error)
    }
  }
}
