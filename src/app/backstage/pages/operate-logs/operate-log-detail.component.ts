import { Component, EventEmitter, Input, Output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { OperateLogEntity } from '@src/types'

@Component({
  selector: 'cs-operate-log-detail',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      header="操作日志详情"
      [modal]="true"
      [style]="{ width: '600px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onClose()"
      [closeOnEscape]="true"
    >
      @if (log) {
        <div>
          <div class="field"><b>ID：</b>{{ log.id }}</div>
          <div class="field"><b>操作类型：</b>{{ log.code }}</div>
          <div class="field"><b>用户ID：</b>{{ log.user_id }}</div>
          <div class="field"><b>类型ID：</b>{{ log.type_id }}</div>
          <div class="field">
            <b>创建时间：</b>{{ log.create_time | date: 'yyyy-MM-dd HH:mm:ss' }}
          </div>
          <div class="field">
            <b>更新时间：</b>{{ log.update_time | date: 'yyyy-MM-dd HH:mm:ss' }}
          </div>
          <div class="field">
            <b>内容：</b>
            <pre style="white-space: pre-wrap; word-break: break-all;">{{ log.content }}</pre>
          </div>
        </div>
      }
      <ng-template pTemplate="footer">
        <p-button label="关闭" icon="pi pi-times" (click)="onClose()"></p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .field {
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--p-content-border-color);
        padding-bottom: 1rem;

        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
      }
    `
  ]
})
export class OperateLogDetailComponent {
  @Input() log: OperateLogEntity | null = null
  @Input() visible = signal(false)
  @Output() closed = new EventEmitter<void>()

  onClose() {
    this.visible.set(false)
    this.closed.emit()
  }
}
