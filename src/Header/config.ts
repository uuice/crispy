import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { frontendNavPathHint } from '@/utilities/mapGlobalNavItems'

export const Header: GlobalConfig = {
  slug: 'header',
  label: adminLabels.header,
  admin: {
    group: adminLabels.configGroup,
    description: '控制前台顶栏导航（blog / cms 主题均读取此配置）。',
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
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
}
