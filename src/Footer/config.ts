import type { GlobalConfig } from 'payload'

import { hideUnlessAnyPermission } from '@/access/adminHidden'
import { link } from '@/fields/link'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { frontendNavPathHint } from '@/utilities/mapGlobalNavItems'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: adminLabels.footer,
  admin: {
    group: adminLabels.configGroup,
    description: '控制前台页脚导航链接（blog / cms 主题均读取此配置）。',
    hidden: hideUnlessAnyPermission('settings:site'),
  },
  access: {
    read: () => true,
    update: requirePermission('settings:site'),
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: adminLabels.navItems,
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        description: frontendNavPathHint,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
}
