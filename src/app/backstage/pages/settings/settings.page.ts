import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TabViewModule } from 'primeng/tabview'
import { CardModule } from 'primeng/card'
import { InputTextModule } from 'primeng/inputtext'
import { InputSwitchModule } from 'primeng/inputswitch'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api'
import { DividerModule } from 'primeng/divider'

interface SiteSettings {
  siteName: string
  siteDescription: string
  siteKeywords: string
  siteLogo: string
  siteFavicon: string
  siteFooter: string
  allowRegistration: boolean
  allowComment: boolean
  commentAudit: boolean
  defaultLanguage: string
  timezone: string
  dateFormat: string
  timeFormat: string
}

interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  smtpSecure: boolean
  fromEmail: string
  fromName: string
  enableEmailNotification: boolean
}

interface StorageSettings {
  storageType: 'local' | 'oss' | 'cos'
  accessKey: string
  secretKey: string
  bucket: string
  region: string
  domain: string
  uploadPath: string
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TabViewModule,
    CardModule,
    InputTextModule,
    InputSwitchModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DividerModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="container mx-auto p-4">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">系统配置</h1>
        <div class="flex gap-2">
          <button
            pButton
            label="保存配置"
            icon="pi pi-save"
            class="p-button-success"
            (click)="saveSettings()"
          ></button>
          <button
            pButton
            label="重置"
            icon="pi pi-refresh"
            class="p-button-secondary"
            (click)="confirmReset()"
          ></button>
        </div>
      </div>

      <p-tabView>
        <!-- 基本设置 -->
        <p-tabPanel header="基本设置">
          <div class="grid">
            <div class="col-12 md:col-6">
              <p-card>
                <ng-template pTemplate="title">网站信息</ng-template>
                <ng-template pTemplate="content">
                  <div class="field">
                    <label for="siteName" class="block text-sm font-medium text-gray-700 mb-2"
                      >网站名称</label
                    >
                    <input
                      id="siteName"
                      type="text"
                      pInputText
                      [(ngModel)]="siteSettings.siteName"
                      class="w-full"
                    />
                  </div>

                  <div class="field mt-4">
                    <label
                      for="siteDescription"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >网站描述</label
                    >
                    <textarea
                      id="siteDescription"
                      pInputTextarea
                      [(ngModel)]="siteSettings.siteDescription"
                      [rows]="3"
                      class="w-full"
                    ></textarea>
                  </div>

                  <div class="field mt-4">
                    <label for="siteKeywords" class="block text-sm font-medium text-gray-700 mb-2"
                      >网站关键词</label
                    >
                    <input
                      id="siteKeywords"
                      type="text"
                      pInputText
                      [(ngModel)]="siteSettings.siteKeywords"
                      class="w-full"
                    />
                  </div>

                  <div class="field mt-4">
                    <label for="siteLogo" class="block text-sm font-medium text-gray-700 mb-2"
                      >网站 Logo</label
                    >
                    <input
                      id="siteLogo"
                      type="text"
                      pInputText
                      [(ngModel)]="siteSettings.siteLogo"
                      class="w-full"
                    />
                  </div>

                  <div class="field mt-4">
                    <label for="siteFavicon" class="block text-sm font-medium text-gray-700 mb-2"
                      >网站图标</label
                    >
                    <input
                      id="siteFavicon"
                      type="text"
                      pInputText
                      [(ngModel)]="siteSettings.siteFavicon"
                      class="w-full"
                    />
                  </div>

                  <div class="field mt-4">
                    <label for="siteFooter" class="block text-sm font-medium text-gray-700 mb-2"
                      >页脚信息</label
                    >
                    <textarea
                      id="siteFooter"
                      pInputTextarea
                      [(ngModel)]="siteSettings.siteFooter"
                      [rows]="3"
                      class="w-full"
                    ></textarea>
                  </div>
                </ng-template>
              </p-card>
            </div>

            <div class="col-12 md:col-6">
              <p-card>
                <ng-template pTemplate="title">功能设置</ng-template>
                <ng-template pTemplate="content">
                  <div class="field">
                    <label class="block text-sm font-medium text-gray-700 mb-2">用户注册</label>
                    <p-inputSwitch [(ngModel)]="siteSettings.allowRegistration"></p-inputSwitch>
                  </div>

                  <div class="field mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">评论功能</label>
                    <p-inputSwitch [(ngModel)]="siteSettings.allowComment"></p-inputSwitch>
                  </div>

                  <div class="field mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">评论审核</label>
                    <p-inputSwitch [(ngModel)]="siteSettings.commentAudit"></p-inputSwitch>
                  </div>

                  <div class="field mt-4">
                    <label
                      for="defaultLanguage"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >默认语言</label
                    >
                    <p-dropdown
                      id="defaultLanguage"
                      [options]="languageOptions"
                      [(ngModel)]="siteSettings.defaultLanguage"
                      placeholder="选择默认语言"
                      styleClass="w-full"
                    ></p-dropdown>
                  </div>

                  <div class="field mt-4">
                    <label for="timezone" class="block text-sm font-medium text-gray-700 mb-2"
                      >时区设置</label
                    >
                    <p-dropdown
                      id="timezone"
                      [options]="timezoneOptions"
                      [(ngModel)]="siteSettings.timezone"
                      placeholder="选择时区"
                      styleClass="w-full"
                    ></p-dropdown>
                  </div>

                  <div class="field mt-4">
                    <label for="dateFormat" class="block text-sm font-medium text-gray-700 mb-2"
                      >日期格式</label
                    >
                    <p-dropdown
                      id="dateFormat"
                      [options]="dateFormatOptions"
                      [(ngModel)]="siteSettings.dateFormat"
                      placeholder="选择日期格式"
                      styleClass="w-full"
                    ></p-dropdown>
                  </div>

                  <div class="field mt-4">
                    <label for="timeFormat" class="block text-sm font-medium text-gray-700 mb-2"
                      >时间格式</label
                    >
                    <p-dropdown
                      id="timeFormat"
                      [options]="timeFormatOptions"
                      [(ngModel)]="siteSettings.timeFormat"
                      placeholder="选择时间格式"
                      styleClass="w-full"
                    ></p-dropdown>
                  </div>
                </ng-template>
              </p-card>
            </div>
          </div>
        </p-tabPanel>

        <!-- 邮件设置 -->
        <p-tabPanel header="邮件设置">
          <div class="grid">
            <div class="col-12">
              <p-card>
                <ng-template pTemplate="title">SMTP 设置</ng-template>
                <ng-template pTemplate="content">
                  <div class="grid">
                    <div class="col-12 md:col-6">
                      <div class="field">
                        <label for="smtpHost" class="block text-sm font-medium text-gray-700 mb-2"
                          >SMTP 服务器</label
                        >
                        <input
                          id="smtpHost"
                          type="text"
                          pInputText
                          [(ngModel)]="emailSettings.smtpHost"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <label for="smtpPort" class="block text-sm font-medium text-gray-700 mb-2"
                          >SMTP 端口</label
                        >
                        <input
                          id="smtpPort"
                          type="number"
                          pInputText
                          [(ngModel)]="emailSettings.smtpPort"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <label for="smtpUser" class="block text-sm font-medium text-gray-700 mb-2"
                          >SMTP 用户名</label
                        >
                        <input
                          id="smtpUser"
                          type="text"
                          pInputText
                          [(ngModel)]="emailSettings.smtpUser"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <label
                          for="smtpPassword"
                          class="block text-sm font-medium text-gray-700 mb-2"
                          >SMTP 密码</label
                        >
                        <input
                          id="smtpPassword"
                          type="password"
                          pInputText
                          [(ngModel)]="emailSettings.smtpPassword"
                          class="w-full"
                        />
                      </div>
                    </div>

                    <div class="col-12 md:col-6">
                      <div class="field">
                        <label class="block text-sm font-medium text-gray-700 mb-2">SSL/TLS</label>
                        <p-inputSwitch [(ngModel)]="emailSettings.smtpSecure"></p-inputSwitch>
                      </div>

                      <div class="field mt-4">
                        <label for="fromEmail" class="block text-sm font-medium text-gray-700 mb-2"
                          >发件人邮箱</label
                        >
                        <input
                          id="fromEmail"
                          type="email"
                          pInputText
                          [(ngModel)]="emailSettings.fromEmail"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <label for="fromName" class="block text-sm font-medium text-gray-700 mb-2"
                          >发件人名称</label
                        >
                        <input
                          id="fromName"
                          type="text"
                          pInputText
                          [(ngModel)]="emailSettings.fromName"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2"
                          >启用邮件通知</label
                        >
                        <p-inputSwitch
                          [(ngModel)]="emailSettings.enableEmailNotification"
                        ></p-inputSwitch>
                      </div>

                      <div class="field mt-4">
                        <button
                          pButton
                          label="测试邮件发送"
                          icon="pi pi-send"
                          class="p-button-info"
                          (click)="testEmailSettings()"
                        ></button>
                      </div>
                    </div>
                  </div>
                </ng-template>
              </p-card>
            </div>
          </div>
        </p-tabPanel>

        <!-- 存储设置 -->
        <p-tabPanel header="存储设置">
          <div class="grid">
            <div class="col-12">
              <p-card>
                <ng-template pTemplate="title">存储配置</ng-template>
                <ng-template pTemplate="content">
                  <div class="field">
                    <label for="storageType" class="block text-sm font-medium text-gray-700 mb-2"
                      >存储类型</label
                    >
                    <p-dropdown
                      id="storageType"
                      [options]="storageTypeOptions"
                      [(ngModel)]="storageSettings.storageType"
                      placeholder="选择存储类型"
                      styleClass="w-full"
                    ></p-dropdown>
                  </div>

                  <p-divider *ngIf="storageSettings.storageType !== 'local'"></p-divider>

                  <div class="grid" *ngIf="storageSettings.storageType !== 'local'">
                    <div class="col-12 md:col-6">
                      <div class="field">
                        <label for="accessKey" class="block text-sm font-medium text-gray-700 mb-2"
                          >Access Key</label
                        >
                        <input
                          id="accessKey"
                          type="text"
                          pInputText
                          [(ngModel)]="storageSettings.accessKey"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <label for="secretKey" class="block text-sm font-medium text-gray-700 mb-2"
                          >Secret Key</label
                        >
                        <input
                          id="secretKey"
                          type="password"
                          pInputText
                          [(ngModel)]="storageSettings.secretKey"
                          class="w-full"
                        />
                      </div>
                    </div>

                    <div class="col-12 md:col-6">
                      <div class="field">
                        <label for="bucket" class="block text-sm font-medium text-gray-700 mb-2"
                          >Bucket</label
                        >
                        <input
                          id="bucket"
                          type="text"
                          pInputText
                          [(ngModel)]="storageSettings.bucket"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <label for="region" class="block text-sm font-medium text-gray-700 mb-2"
                          >Region</label
                        >
                        <input
                          id="region"
                          type="text"
                          pInputText
                          [(ngModel)]="storageSettings.region"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <label for="domain" class="block text-sm font-medium text-gray-700 mb-2"
                          >域名</label
                        >
                        <input
                          id="domain"
                          type="text"
                          pInputText
                          [(ngModel)]="storageSettings.domain"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <label for="uploadPath" class="block text-sm font-medium text-gray-700 mb-2"
                          >上传路径</label
                        >
                        <input
                          id="uploadPath"
                          type="text"
                          pInputText
                          [(ngModel)]="storageSettings.uploadPath"
                          class="w-full"
                        />
                      </div>

                      <div class="field mt-4">
                        <button
                          pButton
                          label="测试连接"
                          icon="pi pi-link"
                          class="p-button-info"
                          (click)="testStorageConnection()"
                        ></button>
                      </div>
                    </div>
                  </div>
                </ng-template>
              </p-card>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div>
  `
})
export class SettingsPage implements OnInit {
  siteSettings: SiteSettings = {
    siteName: '',
    siteDescription: '',
    siteKeywords: '',
    siteLogo: '',
    siteFavicon: '',
    siteFooter: '',
    allowRegistration: true,
    allowComment: true,
    commentAudit: true,
    defaultLanguage: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss'
  }

  emailSettings: EmailSettings = {
    smtpHost: '',
    smtpPort: 465,
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: true,
    fromEmail: '',
    fromName: '',
    enableEmailNotification: false
  }

  storageSettings: StorageSettings = {
    storageType: 'local',
    accessKey: '',
    secretKey: '',
    bucket: '',
    region: '',
    domain: '',
    uploadPath: 'uploads'
  }

  languageOptions = [
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en-US' }
  ]

  timezoneOptions = [
    { label: 'Asia/Shanghai (GMT+8)', value: 'Asia/Shanghai' },
    { label: 'UTC (GMT+0)', value: 'UTC' },
    { label: 'America/New_York (GMT-5)', value: 'America/New_York' }
  ]

  dateFormatOptions = [
    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' }
  ]

  timeFormatOptions = [
    { label: 'HH:mm:ss', value: 'HH:mm:ss' },
    { label: 'hh:mm:ss A', value: 'hh:mm:ss A' }
  ]

  storageTypeOptions = [
    { label: '本地存储', value: 'local' },
    { label: '阿里云 OSS', value: 'oss' },
    { label: '腾讯云 COS', value: 'cos' }
  ]

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadSettings()
  }

  loadSettings() {
    // TODO: Implement API call to load settings
    // Mock data for now
    this.siteSettings = {
      siteName: '我的博客',
      siteDescription: '一个基于 Angular 的博客系统',
      siteKeywords: 'Angular, TypeScript, Blog',
      siteLogo: '/assets/images/logo.png',
      siteFavicon: '/assets/images/favicon.ico',
      siteFooter: '© 2024 我的博客. All rights reserved.',
      allowRegistration: true,
      allowComment: true,
      commentAudit: true,
      defaultLanguage: 'zh-CN',
      timezone: 'Asia/Shanghai',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss'
    }

    this.emailSettings = {
      smtpHost: 'smtp.example.com',
      smtpPort: 465,
      smtpUser: 'noreply@example.com',
      smtpPassword: '',
      smtpSecure: true,
      fromEmail: 'noreply@example.com',
      fromName: '我的博客',
      enableEmailNotification: true
    }

    this.storageSettings = {
      storageType: 'local',
      accessKey: '',
      secretKey: '',
      bucket: '',
      region: '',
      domain: '',
      uploadPath: 'uploads'
    }
  }

  saveSettings() {
    // TODO: Implement API call to save settings
    this.messageService.add({
      severity: 'success',
      summary: '成功',
      detail: '配置已保存'
    })
  }

  confirmReset() {
    this.confirmationService.confirm({
      message: '确定要重置所有配置吗？这将恢复默认设置。',
      header: '重置确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadSettings()
        this.messageService.add({
          severity: 'info',
          summary: '已重置',
          detail: '配置已恢复默认设置'
        })
      }
    })
  }

  testEmailSettings() {
    // TODO: Implement email test
    this.messageService.add({
      severity: 'info',
      summary: '测试邮件',
      detail: '测试邮件已发送，请查收'
    })
  }

  testStorageConnection() {
    // TODO: Implement storage connection test
    this.messageService.add({
      severity: 'info',
      summary: '连接测试',
      detail: '存储服务连接测试成功'
    })
  }
}
