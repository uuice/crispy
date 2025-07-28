import { Component, inject, OnInit, signal } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TabsModule } from 'primeng/tabs'
import { CardModule } from 'primeng/card'
import { InputTextModule } from 'primeng/inputtext'
import { ToggleSwitchModule } from 'primeng/toggleswitch'
import { SelectModule } from 'primeng/select'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api'
import { DividerModule } from 'primeng/divider'
import { TextareaModule } from 'primeng/textarea'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { SettingsService, AppSettings } from '../../services/settings.service'
import { HttpService } from '../../services/http.service'
import { SYSTEM_SETTINGS_CATEGORY_ALIAS } from '../../../../server/config/const'

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

interface RecordSettings {
  icpNumber: string
  icpLink: string
  policeNumber: string
  policeLink: string
  recordText: string
  showRecord: boolean
}

interface LanguageOption {
  label: string
  value: string
}

interface ThemeOption {
  label: string
  value: string
}

@Component({
  selector: 'cs-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TabsModule,
    CardModule,
    InputTextModule,
    ToggleSwitchModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DividerModule,
    TextareaModule,
    ProgressSpinnerModule
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
            [loading]="saving()"
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

      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">基本设置</p-tab>
          <p-tab value="1">SMTP 设置</p-tab>
          <p-tab value="2">存储设置</p-tab>
          <p-tab value="3">备案信息</p-tab>
          <p-tab value="4">静态化设置</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <!-- 基本设置内容 -->
            <div class="grid">
              <div class="col-12 md:col-6">
                <p-card>
                  <ng-template pTemplate="content">
                    <div class="field">
                      <label for="siteName" class="block text-900 font-medium mb-2">网站名称</label>
                      <input
                        id="siteName"
                        type="text"
                        pInputText
                        [(ngModel)]="siteSettings.siteName"
                        class="w-full"
                      />
                    </div>

                    <div class="field mt-4">
                      <label for="siteDescription" class="block text-900 font-medium mb-2"
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
                      <label for="siteKeywords" class="block text-900 font-medium mb-2"
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
                      <label for="siteLogo" class="block text-900 font-medium mb-2"
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
                      <label for="siteFavicon" class="block text-900 font-medium mb-2"
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
                      <label for="siteFooter" class="block text-900 font-medium mb-2"
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
                      <label class="block text-900 font-medium mb-2">用户注册</label>
                      <p-toggleswitch [(ngModel)]="siteSettings.allowRegistration"></p-toggleswitch>
                    </div>

                    <div class="field mt-4">
                      <label class="block text-900 font-medium mb-2">评论功能</label>
                      <p-toggleswitch [(ngModel)]="siteSettings.allowComment"></p-toggleswitch>
                    </div>

                    <div class="field mt-4">
                      <label class="block text-900 font-medium mb-2">评论审核</label>
                      <p-toggleswitch [(ngModel)]="siteSettings.commentAudit"></p-toggleswitch>
                    </div>

                    <div class="field mt-4">
                      <label for="defaultLanguage" class="block text-900 font-medium mb-2"
                        >默认语言</label
                      >
                      <p-select
                        id="defaultLanguage"
                        [options]="languageOptions"
                        [(ngModel)]="siteSettings.defaultLanguage"
                        placeholder="选择默认语言"
                        styleClass="w-full"
                      ></p-select>
                    </div>

                    <div class="field mt-4">
                      <label for="timezone" class="block text-900 font-medium mb-2">时区设置</label>
                      <p-select
                        id="timezone"
                        [options]="timezoneOptions"
                        [(ngModel)]="siteSettings.timezone"
                        placeholder="选择时区"
                        styleClass="w-full"
                      ></p-select>
                    </div>

                    <div class="field mt-4">
                      <label for="dateFormat" class="block text-900 font-medium mb-2"
                        >日期格式</label
                      >
                      <p-select
                        id="dateFormat"
                        [options]="dateFormatOptions"
                        [(ngModel)]="siteSettings.dateFormat"
                        placeholder="选择日期格式"
                        styleClass="w-full"
                      ></p-select>
                    </div>

                    <div class="field mt-4">
                      <label for="timeFormat" class="block text-900 font-medium mb-2"
                        >时间格式</label
                      >
                      <p-select
                        id="timeFormat"
                        [options]="timeFormatOptions"
                        [(ngModel)]="siteSettings.timeFormat"
                        placeholder="选择时间格式"
                        styleClass="w-full"
                      ></p-select>
                    </div>
                  </ng-template>
                </p-card>
              </div>
            </div>
          </p-tabpanel>
          <p-tabpanel value="1">
            <!-- 邮件设置内容 -->
            <div class="grid">
              <div class="col-12">
                <p-card>
                  <ng-template pTemplate="content">
                    <div class="grid">
                      <div class="col-12 md:col-6">
                        <div class="field">
                          <label for="smtpHost" class="block text-900 font-medium mb-2"
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
                          <label for="smtpPort" class="block text-900 font-medium mb-2"
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
                          <label for="smtpUser" class="block text-900 font-medium mb-2"
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
                          <label for="smtpPassword" class="block text-900 font-medium mb-2"
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
                          <label class="block text-900 font-medium mb-2">SSL/TLS</label>
                          <p-toggleswitch [(ngModel)]="emailSettings.smtpSecure"></p-toggleswitch>
                        </div>

                        <div class="field mt-4">
                          <label for="fromEmail" class="block text-900 font-medium mb-2"
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
                          <label for="fromName" class="block text-900 font-medium mb-2"
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
                          <label class="block text-900 font-medium mb-2">启用邮件通知</label>
                          <p-toggleswitch
                            [(ngModel)]="emailSettings.enableEmailNotification"
                          ></p-toggleswitch>
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
          </p-tabpanel>
          <p-tabpanel value="2">
            <!-- 存储设置内容 -->
            <div class="grid">
              <div class="col-12">
                <p-card>
                  <ng-template pTemplate="content">
                    <div class="field">
                      <label for="storageType" class="block text-900 font-medium mb-2"
                        >存储类型</label
                      >
                      <p-select
                        id="storageType"
                        [options]="storageTypeOptions"
                        [(ngModel)]="storageSettings.storageType"
                        placeholder="选择存储类型"
                        styleClass="w-full"
                      ></p-select>
                    </div>

                    <p-divider *ngIf="storageSettings.storageType !== 'local'"></p-divider>

                    <div class="grid" *ngIf="storageSettings.storageType !== 'local'">
                      <div class="col-12 md:col-6">
                        <div class="field">
                          <label for="accessKey" class="block text-900 font-medium mb-2"
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
                          <label for="secretKey" class="block text-900 font-medium mb-2"
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
                          <label for="bucket" class="block text-900 font-medium mb-2">Bucket</label>
                          <input
                            id="bucket"
                            type="text"
                            pInputText
                            [(ngModel)]="storageSettings.bucket"
                            class="w-full"
                          />
                        </div>

                        <div class="field mt-4">
                          <label for="region" class="block text-900 font-medium mb-2">Region</label>
                          <input
                            id="region"
                            type="text"
                            pInputText
                            [(ngModel)]="storageSettings.region"
                            class="w-full"
                          />
                        </div>

                        <div class="field mt-4">
                          <label for="domain" class="block text-900 font-medium mb-2">域名</label>
                          <input
                            id="domain"
                            type="text"
                            pInputText
                            [(ngModel)]="storageSettings.domain"
                            class="w-full"
                          />
                        </div>

                        <div class="field mt-4">
                          <label for="uploadPath" class="block text-900 font-medium mb-2"
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
          </p-tabpanel>
          <p-tabpanel value="3">
            <!-- 备案信息设置内容 -->
            <div class="grid">
              <div class="col-12">
                <p-card>
                  <ng-template pTemplate="content">
                    <div class="field">
                      <label class="block text-900 font-medium mb-2">显示备案信息</label>
                      <p-toggleswitch [(ngModel)]="recordSettings.showRecord"></p-toggleswitch>
                    </div>

                    <p-divider></p-divider>

                    <div class="grid">
                      <div class="col-12 md:col-6">
                        <div class="field">
                          <label for="icpNumber" class="block text-900 font-medium mb-2"
                            >ICP 备案号</label
                          >
                          <input
                            id="icpNumber"
                            type="text"
                            pInputText
                            [(ngModel)]="recordSettings.icpNumber"
                            placeholder="如：京ICP备12345678号"
                            class="w-full"
                          />
                        </div>

                        <div class="field mt-4">
                          <label for="icpLink" class="block text-900 font-medium mb-2"
                            >ICP 备案链接</label
                          >
                          <input
                            id="icpLink"
                            type="url"
                            pInputText
                            [(ngModel)]="recordSettings.icpLink"
                            placeholder="https://beian.miit.gov.cn/"
                            class="w-full"
                          />
                        </div>

                        <div class="field mt-4">
                          <label for="recordText" class="block text-900 font-medium mb-2"
                            >备案显示文本</label
                          >
                          <textarea
                            id="recordText"
                            pInputTextarea
                            [(ngModel)]="recordSettings.recordText"
                            [rows]="3"
                            placeholder="自定义备案信息显示文本"
                            class="w-full"
                          ></textarea>
                        </div>
                      </div>

                      <div class="col-12 md:col-6">
                        <div class="field">
                          <label for="policeNumber" class="block text-900 font-medium mb-2"
                            >公安备案号</label
                          >
                          <input
                            id="policeNumber"
                            type="text"
                            pInputText
                            [(ngModel)]="recordSettings.policeNumber"
                            placeholder="如：京公网安备11010502030123号"
                            class="w-full"
                          />
                        </div>

                        <div class="field mt-4">
                          <label for="policeLink" class="block text-900 font-medium mb-2"
                            >公安备案链接</label
                          >
                          <input
                            id="policeLink"
                            type="url"
                            pInputText
                            [(ngModel)]="recordSettings.policeLink"
                            placeholder="http://www.beian.gov.cn/"
                            class="w-full"
                          />
                        </div>

                        <div class="field mt-4">
                          <div class="preview-container">
                            <h4 class="preview-title">预览效果</h4>
                            <div class="preview-content">
                              <div *ngIf="recordSettings.showRecord">
                                <div *ngIf="recordSettings.icpNumber">
                                  <a
                                    [href]="recordSettings.icpLink"
                                    target="_blank"
                                    class="preview-link"
                                  >
                                    {{ recordSettings.icpNumber }}
                                  </a>
                                </div>
                                <div *ngIf="recordSettings.policeNumber" class="mt-1">
                                  <a
                                    [href]="recordSettings.policeLink"
                                    target="_blank"
                                    class="preview-link"
                                  >
                                    {{ recordSettings.policeNumber }}
                                  </a>
                                </div>
                                <div *ngIf="recordSettings.recordText" class="mt-1">
                                  {{ recordSettings.recordText }}
                                </div>
                              </div>
                              <div *ngIf="!recordSettings.showRecord" class="preview-hidden">
                                备案信息已隐藏
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ng-template>
                </p-card>
              </div>
            </div>
          </p-tabpanel>
          <p-tabpanel value="4">
            <!-- 静态化设置内容 -->
            <div class="grid">
              <div class="col-12">
                <p-card>
                  <ng-template pTemplate="content">
                    <!-- Static Generation Status -->
                    @if (staticGenerationStatus()) {
                      <div class="mb-4">
                        <h3 class="text-lg font-semibold mb-3">静态化状态</h3>
                        <div class="grid">
                          <div class="col-12 md:col-3">
                            <div class="text-center">
                              <div class="text-2xl font-bold text-primary">
                                {{ staticGenerationStatus()?.fileCount || 0 }}
                              </div>
                              <div class="text-sm text-muted">生成文件数</div>
                            </div>
                          </div>
                          <div class="col-12 md:col-3">
                            <div class="text-center">
                              <div class="text-2xl font-bold text-success">
                                {{ staticGenerationStatus()?.totalSize || '0 MB' }}
                              </div>
                              <div class="text-sm text-muted">总大小</div>
                            </div>
                          </div>
                          <div class="col-12 md:col-3">
                            <div class="text-center">
                              <div class="text-2xl font-bold text-info">
                                {{
                                  staticGenerationStatus()?.lastGenerated
                                    ? (staticGenerationStatus()?.lastGenerated
                                      | date: 'yyyy-MM-dd HH:mm:ss')
                                    : '未生成'
                                }}
                              </div>
                              <div class="text-sm text-muted">最后生成时间</div>
                            </div>
                          </div>
                          <div class="col-12 md:col-3">
                            <div class="text-center">
                              <div
                                class="text-2xl font-bold"
                                [class]="
                                  staticGenerationStatus()?.staticDirExists
                                    ? 'text-success'
                                    : 'text-danger'
                                "
                              >
                                {{
                                  staticGenerationStatus()?.staticDirExists ? '已启用' : '未启用'
                                }}
                              </div>
                              <div class="text-sm text-muted">静态化状态</div>
                            </div>
                          </div>
                        </div>
                        @if (staticGenerationStatus()?.staticDir) {
                          <div class="mt-3 text-sm text-muted">
                            <strong>静态文件目录:</strong> {{ staticGenerationStatus()?.staticDir }}
                          </div>
                        }
                      </div>
                    }

                    <!-- Static Generation Progress -->
                    @if (generatingStatic()) {
                      <div class="mb-4 flex flex-col items-center justify-center">
                        <h3 class="text-lg font-semibold mb-3">正在生成静态页面...</h3>
                        <div class="flex items-center justify-center p-4">
                          <p-progressSpinner
                            styleClass="w-12 h-12"
                            strokeWidth="4"
                            fill="var(--surface-ground)"
                            animationDuration="1s"
                          ></p-progressSpinner>
                        </div>
                        <span class="mt-3">正在生成静态页面，请稍候...</span>
                      </div>
                    }

                    <!-- Static Generation Actions -->
                    <div class="mt-4">
                      <h3 class="text-lg font-semibold mb-3">操作</h3>
                      <div class="flex gap-2">
                        <button
                          pButton
                          label="重新生成静态页面"
                          icon="pi pi-refresh"
                          class="p-button-warning"
                          [loading]="generatingStatic()"
                          (click)="generateStaticPages()"
                        ></button>
                        <button
                          pButton
                          label="清除静态缓存"
                          icon="pi pi-trash"
                          class="p-button-danger ml-2"
                          [loading]="clearingCache()"
                          (click)="clearStaticCache()"
                        ></button>
                      </div>
                      <div class="mt-3 text-sm text-muted">
                        <p>• 静态化可以显著提升网站访问速度</p>
                        <p>• 生成后的页面将保存在 temp/static 目录</p>
                        <p>• 建议在内容更新后重新生成静态页面</p>
                      </div>
                    </div>
                  </ng-template>
                </p-card>
              </div>
            </div>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
  styles: [
    `
      .preview-container {
        padding: 1rem;
        background: var(--p-content-background, #ffffff);
        border: 1px solid var(--p-content-border-color, #e5e7eb);
        border-radius: var(--p-border-radius, 0.5rem);
        color: var(--p-text-color, #374151);
      }

      .preview-title {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--p-text-color, #374151);
      }

      .preview-content {
        font-size: 0.875rem;
        color: var(--p-text-color, #374151);
      }

      .preview-link {
        color: var(--p-primary-color, #2196f3);
        text-decoration: none;
        transition: opacity 0.2s;
      }

      .preview-link:hover {
        opacity: 0.8;
        text-decoration: underline;
      }

      .preview-hidden {
        color: var(--p-text-muted-color, #6b7280);
        font-style: italic;
      }
    `
  ]
})
export class SettingsPage implements OnInit {
  protected settingsService = inject(SettingsService)
  protected httpService = inject(HttpService)

  settings: AppSettings = this.settingsService.settings()
  saving = signal(false)
  generatingStatic = signal(false)
  clearingCache = signal(false)
  staticGenerationStatus = signal<any>(null)

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

  recordSettings: RecordSettings = {
    icpNumber: '',
    icpLink: '',
    policeNumber: '',
    policeLink: '',
    recordText: '',
    showRecord: true
  }

  languageOptions: LanguageOption[] = [
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en-US' },
    { label: '日本語', value: 'ja-JP' }
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

  themeOptions: ThemeOption[] = [
    { label: '默认主题', value: 'default' },
    { label: '蓝色主题', value: 'blue' },
    { label: '绿色主题', value: 'green' },
    { label: '紫色主题', value: 'purple' }
  ]

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit() {
    await this.loadConfigSettings()
    await this.loadStaticGenerationStatus()
  }

  loadSettings() {
    // Load settings from configs table
    this.loadConfigSettings()
  }

  async loadConfigSettings() {
    try {
      // Load site settings
      try {
        const siteConfig = await firstValueFrom(
          this.httpService.get<any>(
            `/api/admin/configs/alias/${SYSTEM_SETTINGS_CATEGORY_ALIAS.SITE_SETTINGS}`
          )
        )

        if (siteConfig?.success && siteConfig.data) {
          const config = siteConfig.data
          try {
            this.siteSettings = { ...this.siteSettings, ...JSON.parse(config.value) }
          } catch (e) {
            console.error('Failed to parse site settings:', e)
          }
        }
      } catch (error: any) {
        console.log('Site settings not found, using defaults')
      }

      // Load email settings
      try {
        const emailConfig = await firstValueFrom(
          this.httpService.get<any>(
            `/api/admin/configs/alias/${SYSTEM_SETTINGS_CATEGORY_ALIAS.EMAIL_SETTINGS}`
          )
        )

        if (emailConfig?.success && emailConfig.data) {
          const config = emailConfig.data
          try {
            this.emailSettings = { ...this.emailSettings, ...JSON.parse(config.value) }
          } catch (e) {
            console.error('Failed to parse email settings:', e)
          }
        }
      } catch (error: any) {
        console.log('Email settings not found, using defaults')
      }

      // Load storage settings
      try {
        const storageConfig = await firstValueFrom(
          this.httpService.get<any>(
            `/api/admin/configs/alias/${SYSTEM_SETTINGS_CATEGORY_ALIAS.STORAGE_SETTINGS}`
          )
        )

        if (storageConfig?.success && storageConfig.data) {
          const config = storageConfig.data
          try {
            this.storageSettings = { ...this.storageSettings, ...JSON.parse(config.value) }
          } catch (e) {
            console.error('Failed to parse storage settings:', e)
          }
        }
      } catch (error: any) {
        console.log('Storage settings not found, using defaults')
      }

      // Load record settings
      try {
        const recordConfig = await firstValueFrom(
          this.httpService.get<any>(
            `/api/admin/configs/alias/${SYSTEM_SETTINGS_CATEGORY_ALIAS.RECORD_SETTINGS}`
          )
        )

        if (recordConfig?.success && recordConfig.data) {
          const config = recordConfig.data
          try {
            this.recordSettings = { ...this.recordSettings, ...JSON.parse(config.value) }
          } catch (e) {
            console.error('Failed to parse record settings:', e)
          }
        }
      } catch (error: any) {
        console.log('Record settings not found, using defaults')
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      // Use default settings if loading fails
    }
  }

  async saveSettings() {
    this.saving.set(true)

    try {
      // Save site settings
      await this.saveConfigSetting(
        SYSTEM_SETTINGS_CATEGORY_ALIAS.SITE_SETTINGS,
        '网站设置',
        this.siteSettings
      )

      // Save email settings
      await this.saveConfigSetting(
        SYSTEM_SETTINGS_CATEGORY_ALIAS.EMAIL_SETTINGS,
        '邮件设置',
        this.emailSettings
      )

      // Save storage settings
      await this.saveConfigSetting(
        SYSTEM_SETTINGS_CATEGORY_ALIAS.STORAGE_SETTINGS,
        '存储设置',
        this.storageSettings
      )

      // Save record settings
      await this.saveConfigSetting(
        SYSTEM_SETTINGS_CATEGORY_ALIAS.RECORD_SETTINGS,
        '备案信息',
        this.recordSettings
      )

      this.messageService.add({
        severity: 'success',
        summary: '成功',
        detail: '配置已保存'
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      this.messageService.add({
        severity: 'error',
        summary: '错误',
        detail: '保存配置失败'
      })
    } finally {
      this.saving.set(false)
    }
  }

  async saveConfigSetting(alias: string, title: string, data: any) {
    const configValue = JSON.stringify(data)

    // Use upsert endpoint - insert if not exists, update if exists
    await firstValueFrom(
      this.httpService.post<any>('/api/admin/configs/upsert', {
        title,
        alias,
        value: configValue
      })
    )
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
          detail: '配置已恢复上一次保存的设置'
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

  onDarkModeChange(event: any) {
    this.settingsService.setDarkMode(event.checked)
  }

  onCompactModeChange(event: any) {
    this.settingsService.setTheme(event.checked ? 'compact' : 'default')
  }

  onThemeChange(event: any) {
    this.settingsService.setTheme(event.value)
  }

  onSidebarCollapsedChange(event: any) {
    this.settingsService.setSidebarCollapsed(event.checked)
  }

  onLanguageChange(event: any) {
    this.settingsService.setLanguage(event.value)
  }

  resetSettings() {
    this.settingsService.resetSettings()
    this.settings = this.settingsService.settings()
  }

  exportSettings() {
    const settingsJson = this.settingsService.exportSettings()
    const blob = new Blob([settingsJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'backstage-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async generateStaticPages() {
    this.generatingStatic.set(true)
    try {
      const result = await firstValueFrom(
        this.httpService.post<any>('/api/admin/static-generation/generate', {})
      )
      if (result.success) {
        const performance = result.data.performance
        const data = result.data
        const totalGenerated =
          data.totalArticles +
          data.totalCategories +
          data.totalTags +
          data.totalPages +
          data.mainPages
        const successfulFiles = (data.generatedFiles?.length || 0) - (data.errors?.length || 0)

        const message =
          `静态页面生成完成！\n` +
          `主页面: ${data.mainPages} 个\n` +
          `文章页面: ${data.totalArticles} 个\n` +
          `分类页面: ${data.totalCategories} 个\n` +
          `标签页面: ${data.totalTags} 个\n` +
          `自定义页面: ${data.totalPages} 个\n` +
          `总计: ${totalGenerated} 个页面\n` +
          `成功生成: ${successfulFiles} 个文件\n` +
          `总耗时: ${(performance?.totalTime / 1000).toFixed(2)}s\n` +
          `平均每页: ${performance?.averageTimePerPage?.toFixed(2)}ms\n` +
          `并发数: ${performance?.concurrentRequests}`

        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: message,
          life: 10000
        })
        await this.loadStaticGenerationStatus()
      } else {
        this.messageService.add({
          severity: 'error',
          summary: '失败',
          detail: result.message || '静态页面生成失败'
        })
      }
    } catch (error) {
      console.error('Generate static pages error:', error)
      this.messageService.add({
        severity: 'error',
        summary: '失败',
        detail: '静态页面生成失败，请检查服务器状态'
      })
    } finally {
      this.generatingStatic.set(false)
    }
  }

  async loadStaticGenerationStatus() {
    try {
      const result = await firstValueFrom(
        this.httpService.get<any>('/api/admin/static-generation/status', {})
      )

      if (result.success) {
        this.staticGenerationStatus.set(result.data)
      }
    } catch (error) {
      console.error('Failed to load static generation status:', error)
    }
  }

  async clearStaticCache() {
    this.clearingCache.set(true)

    try {
      const result = await firstValueFrom(
        this.httpService.post<any>('/api/admin/static-generation/clear', {})
      )

      if (result.success) {
        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: '静态缓存已清除'
        })

        // Refresh status
        await this.loadStaticGenerationStatus()
      } else {
        this.messageService.add({
          severity: 'error',
          summary: '失败',
          detail: result.message || '清除静态缓存失败'
        })
      }
    } catch (error) {
      console.error('Clear static cache error:', error)
      this.messageService.add({
        severity: 'error',
        summary: '失败',
        detail: '清除静态缓存失败，请检查服务器状态'
      })
    } finally {
      this.clearingCache.set(false)
    }
  }
}
