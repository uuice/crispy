import type { GlobalConfig } from 'payload'

import { hideUnlessAnyPermission } from '@/access/adminHidden'
import { link } from '@/fields/link'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { frontendNavPathHint } from '@/utilities/mapGlobalNavItems'

export const Header: GlobalConfig = {
  slug: 'header',
  label: adminLabels.header,
  admin: {
    group: adminLabels.configGroup,
    description: '控制前台顶栏导航。',
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
          RowLabel: '@/globals/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
}
