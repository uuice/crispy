import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core'
import { TabsModule } from 'primeng/tabs'

interface TabItem {
  label: string
  routerLink: string
  icon?: string
  closable: boolean
}

@Component({
  selector: 'cs-page-tabs',
  standalone: true,
  imports: [TabsModule],
  template: `
    @if (tabs.length > 0) {
      <div class="tabs-container">
        <p-tabs [value]="value()" scrollable (valueChange)="onTabChange($event)">
          <p-tablist>
            @for (tab of tabs; track tab.routerLink; let i = $index) {
              <p-tab [value]="i">
                @if (tab.icon) {
                  <i [class]="tab.icon"></i>
                }
                {{ tab.label }}
              </p-tab>
            }
          </p-tablist>
        </p-tabs>
      </div>
    }
  `,
  styles: [
    `
      .tabs-container {
        background: var(--p-content-background);
        border-radius: 6px;
        margin-bottom: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      /* Custom tab header styling */
      .tab-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* Override PrimeNG tab styles */
      .tabs-container ::ng-deep .p-tablist {
        border-bottom: 1px solid var(--p-content-border-color);
      }
    `
  ]
})
export class PageTabsComponent implements AfterViewInit, OnChanges {
  @Input() tabs: TabItem[] = []
  @Input() activeIndex = 0
  @Output() tabChange = new EventEmitter<number>()
  @Output() closeTab = new EventEmitter<number>()

  value: WritableSignal<number> = signal(0)

  ngAfterViewInit(): void {
    console.log('PageTabsComponent initialized')
    this.value.set(this.activeIndex)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeIndex']) {
      this.value.set(this.activeIndex)
    }
  }

  onTabChange(event: string | number) {
    console.log(event)
    this.value.set(Number(event))
    this.tabChange.emit(Number(event))
  }

  onCloseTab(index: number, tab: TabItem) {
    this.closeTab.emit(index)
  }
}
