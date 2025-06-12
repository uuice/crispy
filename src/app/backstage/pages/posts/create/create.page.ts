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
import { EditorModule } from 'primeng/editor'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'

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
    EditorModule,
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
                <p-editor
                  id="content"
                  formControlName="content"
                  [style]="{ height: '400px' }"
                  [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('content') }"
                ></p-editor>
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
    private messageService: MessageService
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
}
