import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { isEditor } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'

export const Header: GlobalConfig = {
  slug: 'header',
  label: adminLabels.header,
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
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
}
