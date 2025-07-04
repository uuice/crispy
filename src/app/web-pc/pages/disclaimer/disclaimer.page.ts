import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { DividerModule } from 'primeng/divider'
import { PanelModule } from 'primeng/panel'
import { AccordionModule } from 'primeng/accordion'
import { MessageModule } from 'primeng/message'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'cs-disclaimer',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    PanelModule,
    AccordionModule,
    MessageModule,
    RouterModule
  ],
  template: `
    <div class="disclaimer-page">
      <!-- Header Section -->
      <div class="page-header">
        <h1>
          <i class="pi pi-info-circle"></i>
          法律声明
        </h1>
        <p>本网站的重要法律信息和使用条款</p>
      </div>

      <!-- Important Notice -->
      <div class="notice-section">
        <p-message severity="warn" [closable]="false" styleClass="disclaimer-notice">
          <ng-template pTemplate>
            <div class="notice-content">
              <i class="pi pi-exclamation-triangle"></i>
              <div>
                <strong>重要提示：</strong> 请在使用我们的网站之前仔细阅读此免责声明。
                通过访问和使用本网站，您确认已阅读、理解并同意受这些条款的约束。
              </div>
            </div>
          </ng-template>
        </p-message>
      </div>

      <!-- Disclaimer Sections -->
      <div class="disclaimer-sections">
        <p-accordion [multiple]="true" [activeIndex]="[0]">
          <!-- Content Disclaimer -->
          <p-accordionTab header="内容免责声明" [selected]="true">
            <ng-template pTemplate="header">
              <span class="accordion-header">
                <i class="pi pi-file-edit"></i>
                内容免责声明
              </span>
            </ng-template>
            <p-card class="disclaimer-card">
              <p>
                本网站提供的信息仅供
                <strong>一般信息参考</strong>。虽然我们努力保持信息的及时性和准确性，
                但我们不对本网站所含信息、产品、服务或相关图形的完整性、准确性、
                可靠性、适用性或可用性做出任何明示或暗示的保证。
              </p>
              <p>
                因此，您对这些信息的任何依赖都
                <strong>完全由您自己承担风险</strong>。我们建议您在根据本网站
                获得的任何信息采取行动之前，与其他来源进行核实。
              </p>
            </p-card>
          </p-accordionTab>

          <!-- External Links -->
          <p-accordionTab header="外部链接">
            <ng-template pTemplate="header">
              <span class="accordion-header">
                <i class="pi pi-external-link"></i>
                外部链接
              </span>
            </ng-template>
            <p-card class="disclaimer-card">
              <p>
                我们的网站可能包含指向我们未提供或维护的外部网站的链接。
                请注意，我们不保证这些外部网站上任何信息的准确性、相关性、 及时性或完整性。
              </p>
              <p>
                这些链接仅为了方便而提供，并不构成我们对这些外部网站内容的认可。
                我们无法控制这些网站的性质、内容和可用性，也不对其内容或做法承担责任。
              </p>
            </p-card>
          </p-accordionTab>

          <!-- Liability Limitation -->
          <p-accordionTab header="责任限制">
            <ng-template pTemplate="header">
              <span class="accordion-header">
                <i class="pi pi-shield"></i>
                责任限制
              </span>
            </ng-template>
            <p-card class="disclaimer-card">
              <p>
                在任何情况下，我们都不对任何损失或损害承担责任，包括但不限于
                间接或后果性损失或损害，或因使用本网站而产生的任何损失或损害，
                包括数据或利润的损失。
              </p>
              <p>
                通过本网站，您可以链接到我们无法控制的其他网站。我们无法控制
                这些网站的性质、内容和可用性。包含任何链接并不一定意味着推荐 或认可其中表达的观点。
              </p>
            </p-card>
          </p-accordionTab>

          <!-- Copyright -->
          <p-accordionTab header="版权和知识产权">
            <ng-template pTemplate="header">
              <span class="accordion-header">
                <i class="pi pi-copyright"></i>
                版权和知识产权
              </span>
            </ng-template>
            <p-card class="disclaimer-card">
              <p>
                本网站上的所有内容，包括但不限于文本、图形、徽标、图像和软件，
                均为网站所有者或其内容供应商的财产，受国际版权法保护。
              </p>
              <p>
                未经我们明确书面许可，您不得复制、分发、展示或从本网站的任何内容
                创建衍生作品。未经授权使用任何内容可能违反版权、商标和其他法律。
              </p>
            </p-card>
          </p-accordionTab>

          <!-- Privacy -->
          <p-accordionTab header="隐私和数据保护">
            <ng-template pTemplate="header">
              <span class="accordion-header">
                <i class="pi pi-lock"></i>
                隐私和数据保护
              </span>
            </ng-template>
            <p-card class="disclaimer-card">
              <p>
                我们尊重您的隐私，并致力于保护您的个人数据。我们根据适用的数据
                保护法律和法规收集和处理个人信息。
              </p>
              <p>
                有关我们如何收集、使用、存储和保护您个人信息的详细信息，
                请参阅我们的隐私政策。使用本网站即表示您同意根据我们的隐私政策 收集和使用信息。
              </p>
            </p-card>
          </p-accordionTab>

          <!-- Changes to Disclaimer -->
          <p-accordionTab header="免责声明的变更">
            <ng-template pTemplate="header">
              <span class="accordion-header">
                <i class="pi pi-refresh"></i>
                免责声明的变更
              </span>
            </ng-template>
            <p-card class="disclaimer-card">
              <p>
                我们保留随时更新或更改免责声明的权利，恕不另行通知。
                您在本页面上发布任何修改后继续使用网站将构成您对修改的确认
                以及您同意遵守修改后的免责声明。
              </p>
              <p>我们建议您定期查看此免责声明以了解任何变更。最后修订日期 将在本页底部标明。</p>
            </p-card>
          </p-accordionTab>
        </p-accordion>
      </div>

      <p-divider></p-divider>

      <!-- Contact Section -->
      <section class="contact-section">
        <p-card class="contact-card">
          <ng-template pTemplate="header">
            <div class="contact-header">
              <i class="pi pi-envelope"></i>
              <h3>关于此免责声明的问题？</h3>
            </div>
          </ng-template>

          <div class="contact-content">
            <p>
              如果您对此免责声明有任何问题或需要对任何条款进行澄清，
              请随时联系我们。我们在这里帮助您并确保您了解自己的权利和责任。
            </p>

            <div class="contact-methods">
              <p-button
                label="联系我们"
                icon="pi pi-envelope"
                [raised]="true"
                (click)="sendEmail()"
              >
              </p-button>
              <p-button
                label="返回首页"
                icon="pi pi-home"
                severity="secondary"
                [outlined]="true"
                routerLink="/"
              >
              </p-button>
            </div>
          </div>

          <ng-template pTemplate="footer">
            <div class="disclaimer-footer">
              <p><strong>最后更新：</strong> {{ lastUpdated }}</p>
              <p><strong>生效日期：</strong> {{ effectiveDate }}</p>
            </div>
          </ng-template>
        </p-card>
      </section>
    </div>
  `,
  styles: [
    `
      .disclaimer-page {
        .page-header {
          text-align: center;
          margin-bottom: 3rem;

          h1 {
            font-size: 3rem;
            font-weight: 700;
            color: var(--p-text-color);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;

            i {
              color: var(--p-primary-color);
            }
          }

          p {
            font-size: 1.2rem;
            color: var(--p-text-color-secondary);
          }
        }

        .notice-section {
          margin-bottom: 3rem;

          ::ng-deep .disclaimer-notice {
            .p-message-wrapper {
              padding: 1.5rem;
            }

            .notice-content {
              display: flex;
              align-items: flex-start;
              gap: 1rem;

              i {
                font-size: 1.5rem;
                margin-top: 0.25rem;
              }

              div {
                flex: 1;
                line-height: 1.6;
              }
            }
          }
        }

        .disclaimer-sections {
          margin-bottom: 3rem;

          .accordion-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;

            i {
              color: var(--p-primary-color);
            }
          }

          .disclaimer-card {
            margin: 1rem 0;

            p {
              color: var(--p-text-color-secondary);
              line-height: 1.6;
              margin-bottom: 1rem;

              &:last-child {
                margin-bottom: 0;
              }

              strong {
                color: var(--p-text-color);
              }
            }
          }
        }

        .contact-section {
          .contact-card {
            .contact-header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 1rem;
              padding: 2rem;
              background: var(--p-primary-50);

              i {
                font-size: 2rem;
                color: var(--p-primary-color);
              }

              h3 {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--p-text-color);
                margin: 0;
              }
            }

            .contact-content {
              padding: 2rem;
              text-align: center;

              p {
                color: var(--p-text-color-secondary);
                line-height: 1.6;
                margin-bottom: 2rem;
                font-size: 1.1rem;
              }

              .contact-methods {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
              }
            }

            .disclaimer-footer {
              text-align: center;
              padding: 1rem;
              background: var(--p-surface-section);

              p {
                margin: 0.5rem 0;
                color: var(--p-text-color-secondary);
                font-size: 0.9rem;

                strong {
                  color: var(--p-text-color);
                }
              }
            }
          }
        }
      }

      @media (max-width: 768px) {
        .disclaimer-page {
          .page-header h1 {
            font-size: 2.5rem;
          }

          .notice-content {
            flex-direction: column !important;
            text-align: center;
          }

          .contact-methods {
            flex-direction: column !important;
          }
        }
      }
    `
  ]
})
export class DisclaimerPage {
  lastUpdated = '2024年3月15日'
  effectiveDate = '2024年1月1日'

  sendEmail(): void {
    window.location.href = 'mailto:legal@crispy-blog.com?subject=Disclaimer Inquiry'
  }
}
