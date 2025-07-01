import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { MultiSelectModule } from 'primeng/multiselect'
import { CalendarModule } from 'primeng/calendar'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { UploadAdapter } from '../../../../adapter'
import { HttpService } from '../../../services/http.service'

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    CKEditorModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-4">
      <p-toast></p-toast>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">新建文章</h1>
        <div class="flex gap-2">
          <button
            pButton
            label="取消"
            icon="pi pi-times"
            class="p-button-text"
            (click)="goBack()"
          ></button>
          <button
            pButton
            label="保存草稿"
            icon="pi pi-save"
            class="p-button-secondary"
            (click)="saveDraft()"
          ></button>
          <button
            pButton
            label="发布文章"
            icon="pi pi-check"
            class="p-button-success"
            (click)="publishPost()"
          ></button>
        </div>
      </div>

      <div class="card">
        <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="p-fluid">
          <div class="grid">
            <!-- 左侧主要内容 -->
            <div class="col-12 md:col-8">
              <div class="field">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input
                  id="title"
                  type="text"
                  pInputText
                  formControlName="title"
                  class="w-full"
                  [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('title') }"
                />
                <small class="p-error" *ngIf="isFieldInvalid('title')">请输入文章标题</small>
              </div>

              <div class="field mt-4">
                <label for="content" class="block text-sm font-medium text-gray-700 mb-2"
                  >内容</label
                >
                <ckeditor
                  id="content"
                  formControlName="content"
                  [config]="editorConfig"
                  [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('content') }"
                  (ready)="onReady($event)"
                ></ckeditor>
                <small class="p-error" *ngIf="isFieldInvalid('content')">请输入文章内容</small>
              </div>
            </div>

            <!-- 右侧边栏 -->
            <div class="col-12 md:col-4">
              <div class="card">
                <div class="field">
                  <label for="category" class="block text-sm font-medium text-gray-700 mb-2"
                    >分类</label
                  >
                  <p-dropdown
                    id="category"
                    [options]="categoryOptions"
                    formControlName="category"
                    placeholder="选择分类"
                    [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('category') }"
                  ></p-dropdown>
                  <small class="p-error" *ngIf="isFieldInvalid('category')">请选择文章分类</small>
                </div>

                <div class="field mt-4">
                  <label for="tags" class="block text-sm font-medium text-gray-700 mb-2"
                    >标签</label
                  >
                  <p-multiSelect
                    id="tags"
                    [options]="tagOptions"
                    formControlName="tags"
                    placeholder="选择标签"
                    [filter]="true"
                    [showClear]="true"
                  ></p-multiSelect>
                </div>

                <div class="field mt-4">
                  <label for="publishDate" class="block text-sm font-medium text-gray-700 mb-2"
                    >发布日期</label
                  >
                  <p-calendar
                    id="publishDate"
                    formControlName="publishDate"
                    [showTime]="true"
                    [showButtonBar]="true"
                    [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('publishDate') }"
                  ></p-calendar>
                  <small class="p-error" *ngIf="isFieldInvalid('publishDate')"
                    >请选择发布日期</small
                  >
                </div>

                <div class="field mt-4">
                  <label for="summary" class="block text-sm font-medium text-gray-700 mb-2"
                    >摘要</label
                  >
                  <textarea
                    id="summary"
                    pInputTextarea
                    formControlName="summary"
                    [rows]="4"
                    class="w-full"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreatePostPage {
  postForm: FormGroup

  // CKEditor 配置 - 显示 Classic Editor 支持的所有免费功能
  public Editor = ClassicEditor
  public editorConfig: any = {
    licenseKey: 'GPL', // 使用 GPL 许可证用于开源项目
    toolbar: {
      items: [
        // 标题和段落
        'heading',
        '|',
        // 基本格式
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'code',
        '|',
        // 字体样式 (Classic Build 支持)
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        // 段落对齐
        'alignment',
        '|',
        // 列表和缩进
        'bulletedList',
        'numberedList',
        'todoList',
        '|',
        'outdent',
        'indent',
        '|',
        // 插入内容
        'link',
        'imageUpload',
        'insertTable',
        'mediaEmbed',
        'blockQuote',
        'codeBlock',
        'horizontalLine',
        'pageBreak',
        'specialCharacters',
        '|',
        // 查找替换
        'findAndReplace',
        '|',
        // 撤销重做
        'undo',
        'redo',
        '|',
        // 源码编辑
        'sourceEditing'
      ],
      shouldNotGroupWhenFull: true // 防止工具栏项目被分组隐藏
    },
    // 标题配置
    heading: {
      options: [
        { model: 'paragraph', title: '段落', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: '标题 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: '标题 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: '标题 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: '标题 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: '标题 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: '标题 6', class: 'ck-heading_heading6' }
      ]
    },
    // 字体大小配置
    fontSize: {
      options: [9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
    },
    // 字体系列配置
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        '微软雅黑, Microsoft YaHei',
        '宋体, SimSun',
        '黑体, SimHei',
        '楷体, KaiTi'
      ]
    },
    // 对齐方式配置
    alignment: {
      options: ['left', 'center', 'right', 'justify']
    },
    // 图片配置
    image: {
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'imageStyle:alignLeft',
        'imageStyle:alignCenter',
        'imageStyle:alignRight',
        '|',
        'toggleImageCaption',
        'imageTextAlternative'
      ],
      styles: ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight']
    },
    // 表格配置
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties'
      ]
    },
    // 链接配置
    link: {
      decorators: {
        openInNewTab: {
          mode: 'manual',
          label: '在新标签页中打开',
          attributes: {
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        }
      }
    },
    // 代码块语言配置
    codeBlock: {
      languages: [
        { language: 'plaintext', label: '纯文本' },
        { language: 'c', label: 'C' },
        { language: 'cs', label: 'C#' },
        { language: 'cpp', label: 'C++' },
        { language: 'css', label: 'CSS' },
        { language: 'diff', label: 'Diff' },
        { language: 'html', label: 'HTML' },
        { language: 'java', label: 'Java' },
        { language: 'javascript', label: 'JavaScript' },
        { language: 'php', label: 'PHP' },
        { language: 'python', label: 'Python' },
        { language: 'ruby', label: 'Ruby' },
        { language: 'typescript', label: 'TypeScript' },
        { language: 'xml', label: 'XML' }
      ]
    },

    language: 'zh-cn'
  }

  categoryOptions = [
    { label: '技术', value: 'tech' },
    { label: '生活', value: 'life' },
    { label: '随笔', value: 'essay' }
  ]

  tagOptions = [
    { label: 'Angular', value: 'angular' },
    { label: 'TypeScript', value: 'typescript' },
    { label: '前端', value: 'frontend' },
    { label: '后端', value: 'backend' },
    { label: '教程', value: 'tutorial' }
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private httpService: HttpService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required],
      tags: [[]],
      publishDate: [new Date(), Validators.required],
      summary: ['']
    })
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.postForm.get(field)
    return formControl ? formControl.invalid && (formControl.dirty || formControl.touched) : false
  }

  onSubmit() {
    if (this.postForm.valid) {
      // TODO: Implement form submission
      console.log('Form submitted:', this.postForm.value)
      this.messageService.add({
        severity: 'success',
        summary: '成功',
        detail: '文章已保存'
      })
      // this.router.navigate(['../'], { relativeTo: this.router.routeConfig?.path })
    } else {
      this.messageService.add({
        severity: 'error',
        summary: '错误',
        detail: '请填写所有必填字段'
      })
    }
  }

  saveDraft() {
    // TODO: Implement draft saving
    this.messageService.add({
      severity: 'info',
      summary: '提示',
      detail: '草稿已保存'
    })
  }

  publishPost() {
    if (this.postForm.valid) {
      // TODO: Implement post publishing
      this.messageService.add({
        severity: 'success',
        summary: '成功',
        detail: '文章已发布'
      })
      // this.router.navigate(['../'], { relativeTo: this.router.routeConfig?.path })
    } else {
      this.messageService.add({
        severity: 'error',
        summary: '错误',
        detail: '请填写所有必填字段'
      })
    }
  }

  goBack() {
    // this.router.navigate(['../'], { relativeTo: this.router.routeConfig?.path })
  }

  // CKEditor 图片上传适配器
  onReady(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader, this.httpService, this.messageService)
    }
  }
}
