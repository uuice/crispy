import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { AuthService } from '../../services/auth.service'
import { HttpService } from '../../services/http.service'
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="login-bg">
      <p-toast position="top-center"></p-toast>
      <div class="glass-card">
        <div class="login-logo">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="28" cy="28" r="28" fill="white" fill-opacity="0.15" />
            <path
              d="M16 32C20 28 36 28 40 32"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <path
              d="M20 24C23 21 33 21 36 24"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <path
              d="M24 16C25.5 15 30.5 15 32 16"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <h2 class="login-title">欢迎回来</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="input-group">
            <span class="input-icon pi pi-user"></span>
            <input
              id="user_name"
              type="text"
              pInputText
              formControlName="user_name"
              placeholder="用户名"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('user_name') }"
              autocomplete="username"
            />
          </div>
          <div class="input-group">
            <span class="input-icon pi pi-lock"></span>
            <input
              id="password"
              type="password"
              pInputText
              formControlName="password"
              placeholder="密码"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('password') }"
              autocomplete="current-password"
            />
          </div>
          <button
            pButton
            type="submit"
            class="login-btn"
            [loading]="loading"
            [disabled]="loginForm.invalid"
            label="登录"
          ></button>
        </form>
        <a class="forgot-link" href="#" (click)="onForgotPassword($event)">忘记密码？</a>
      </div>
    </div>
  `,
  styles: [
    `
      .login-bg {
        min-height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(ellipse 80% 80% at 60% 20%, #a259e6 0%, #3b2667 40%, #232946 100%),
          radial-gradient(ellipse 60% 60% at 20% 80%, #5bc0eb 0%, #3b2667 60%, #232946 100%);
        background-blend-mode: screen;
        overflow: auto;
      }
      .glass-card {
        width: 420px;
        max-width: 95vw;
        background: rgba(255, 255, 255, 0.13);
        border-radius: 24px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1.5px solid rgba(255, 255, 255, 0.18);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem 2.5rem 2.5rem 2.5rem;
        margin: 2rem 0;
      }
      .login-logo {
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .login-title {
        color: #fff;
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        text-align: center;
        letter-spacing: 0.01em;
      }
      .login-subtitle {
        color: #e0e0e0;
        font-size: 1rem;
        margin-bottom: 2.2rem;
        text-align: center;
      }
      .signup-link {
        color: #fff;
        text-decoration: underline;
        margin-left: 0.3em;
        font-weight: 500;
        transition: color 0.2s;
      }
      .signup-link:hover {
        color: #a259e6;
      }
      .login-form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        margin-bottom: 1.5rem;
      }
      .input-group {
        position: relative;
        width: 100%;
      }
      .input-icon {
        position: absolute;
        left: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        color: #bdbdbd;
        font-size: 1.2rem;
        z-index: 2;
      }
      input[pInputText] {
        width: 100%;
        padding: 0.9rem 1.2rem 0.9rem 3.2rem;
        border-radius: 2rem;
        border: none;
        outline: none;
        background: rgba(255, 255, 255, 0.18);
        color: #fff;
        font-size: 1.08rem;
        font-weight: 500;
        box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.05);
        transition:
          background 0.2s,
          box-shadow 0.2s;
      }
      input[pInputText]:focus {
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 4px 12px 0 rgba(31, 38, 135, 0.1);
      }
      input[pInputText]::placeholder {
        color: #bdbdbd;
        font-weight: 400;
      }
      input[pInputText].ng-invalid.ng-dirty {
        background: rgba(255, 107, 107, 0.2);
        border: 1px solid rgba(255, 107, 107, 0.5);
      }
      .login-btn {
        width: 100%;
        padding: 0.9rem;
        border-radius: 2rem;
        border: none;
        background: linear-gradient(135deg, #a259e6 0%, #5bc0eb 100%);
        color: #fff;
        font-size: 1.08rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 12px 0 rgba(162, 89, 230, 0.3);
      }
      .login-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px 0 rgba(162, 89, 230, 0.4);
      }
      .login-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      .forgot-link {
        color: #e0e0e0;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
      }
      .forgot-link:hover {
        color: #fff;
      }
      @media (max-width: 480px) {
        .glass-card {
          width: 90vw;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
        }
        .login-title {
          font-size: 1.5rem;
        }
      }
    `
  ]
})
export class LoginPage implements OnInit, OnDestroy {
  loginForm: FormGroup
  loading = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private httpService: HttpService
  ) {
    this.loginForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit() {
    // Set overflow hidden for login page
    document.body.style.overflow = 'hidden'
  }

  ngOnDestroy() {
    // Restore overflow when leaving login page
    document.body.style.overflow = ''
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.loginForm.get(field)
    return formControl ? formControl.invalid && formControl.dirty : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.loginForm.get(field)
    if (!formControl) return ''

    if (formControl.hasError('required')) {
      return `${field === 'user_name' ? '用户名' : '密码'}不能为空`
    }
    if (formControl.hasError('minlength')) {
      const requiredLength = field === 'user_name' ? 3 : 6
      return `${field === 'user_name' ? '用户名' : '密码'}至少需要${requiredLength}个字符`
    }
    return ''
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true

      const loginData = {
        user_name: this.loginForm.value.user_name,
        password: this.loginForm.value.password
      }

      // Call login API
      this.httpService
        .post<any>('/api/admin/login', loginData)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (response) => {
            // Check if response is successful
            if (response.success && response.data) {
              // Save token and user info
              this.authService.setToken(response.data.token)
              this.authService.setUser(response.data.user)
              this.authService.setMenu(response.data.menus)

              this.messageService.add({
                severity: 'success',
                summary: '登录成功',
                detail: response.message || '登录成功!'
              })

              // Navigate to dashboard after successful login
              setTimeout(() => {
                this.router.navigate(['/backstage/dashboard'])
              }, 1000)
            } else {
              this.messageService.add({
                severity: 'error',
                summary: '登录失败',
                detail: response.message || '登录失败，请重试'
              })
            }
          },
          error: (error) => {
            // Error handling is already done in HttpService
            console.error('Login failed:', error)
          }
        })
    } else {
      this.loginForm.markAllAsTouched()
    }
  }

  onForgotPassword(event: Event) {
    event.preventDefault()
    this.messageService.add({
      severity: 'info',
      summary: '忘记密码',
      detail: '请联系管理员重置密码'
    })
  }
}
