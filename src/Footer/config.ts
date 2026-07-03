import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { isEditor } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { frontendNavPathHint } from '@/utilities/mapGlobalNavItems'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: adminLabels.footer,
  admin: {
    description: '控制前台页脚导航链接（blog / cms 主题均读取此配置）。',
  },
  access: {
    read: () => true,
    update: isEditor,
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
