import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { isEditor } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: adminLabels.footer,
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
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
