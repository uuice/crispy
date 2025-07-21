import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  forwardRef,
  signal,
  computed,
  AfterViewInit
} from '@angular/core'
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { MessageService } from 'primeng/api'
import { MessageModule } from 'primeng/message'
import { ToastModule } from 'primeng/toast'
/**
 * Vditor markdown editor Angular component
 * Supports PrimeNG theme auto switch (classic/dark)
 * Two-way binding for markdown content
 */
@Component({
  selector: 'vditor-editor',
  standalone: true,
  imports: [MessageModule, ToastModule],
  template: `
    <div [id]="vid()" class="vditor-theme"></div>
    <p-toast></p-toast>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VditorEditorComponent),
      multi: true
    }
  ]
})
export class VditorEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() set value(val: string) {
    this.valueSignal.set(val || '')
  }
  get value(): string {
    return this.valueSignal()
  }

  @Output() valueChange = new EventEmitter<string>()

  // Signals
  valueSignal = signal('')
  vditorInstance = signal<Vditor | undefined>(undefined)
  vid = signal('vditor-' + Math.random().toString(36).slice(2))

  // Computed values
  isDarkTheme = computed(() => document.body.classList.contains('p-component-dark'))

  private onChange = (v: string) => {}
  private onTouched = () => {}

  constructor(private messageService: MessageService) {
    // Watch for theme changes in constructor (injection context)
    // effect(() => {
    //   this.syncTheme()
    // })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const vditor = new Vditor(this.vid(), {
        value: this.valueSignal(),
        mode: 'sv',
        theme: this.isDarkTheme() ? 'dark' : 'classic',
        height: 400,
        toolbar: [
          'emoji',
          'headings',
          'bold',
          'italic',
          'strike',
          'link',
          '|',
          'list',
          'ordered-list',
          'check',
          'outdent',
          'indent',
          '|',
          'quote',
          'line',
          'code',
          'inline-code',
          'insert-after',
          'insert-before',
          '|',
          'upload',
          'table',
          'record',
          'undo',
          'redo',
          '|',
          'fullscreen',
          'edit-mode',
          'content-theme',
          'code-theme',
          'export',
          'preview',
          'info',
          'help'
        ],
        upload: {
          url: '/api/admin/upload/image',
          fieldName: 'image',
          multiple: false,
          accept: 'image/*',
          headers: {
            Authorization: localStorage.getItem('jwt_token')
              ? `Bearer ${localStorage.getItem('jwt_token')}`
              : ''
          },
          success: (_editor, msg) => {
            let url = ''
            try {
              const res = typeof msg === 'string' ? JSON.parse(msg) : msg
              if (res.success && res.data && res.data.url) {
                url = res.data.url
              }
            } catch (e) {
              this.messageService.add({
                severity: 'error',
                summary: '上传失败',
                detail: '上传失败，请重试'
              })
            }
            if (url && this.vditorInstance()) {
              this.vditorInstance()?.insertValue(`![](${url})`)
            }
          },
          error: (msg) => {
            this.messageService.add({
              severity: 'error',
              summary: '上传失败',
              detail: '上传失败，请重试'
            })
          }
        },
        input: (v: string) => {
          this.valueSignal.set(v)
          this.valueChange.emit(v)
          this.onChange(v)
        },
        blur: () => {
          this.onTouched()
        }
      })
      this.vditorInstance.set(vditor)
    }, 500)
  }

  ngOnDestroy() {
    this.vditorInstance()?.destroy()
  }

  writeValue(val: string) {
    this.valueSignal.set(val || '')
    const vditor = this.vditorInstance()
    if (vditor && val !== vditor.getValue()) {
      vditor.setValue(val || '')
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn
  }

  // syncTheme() {
  //   const vditor = this.vditorInstance()
  //   if (!vditor) return

  //   // Only call setTheme if vditor is fully initialized
  //   if (typeof vditor.setTheme === 'function') {
  //     const isDark = this.isDarkTheme()
  //     vditor.setTheme(isDark ? 'dark' : 'classic')
  //   }
  // }
}
