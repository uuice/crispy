import React from 'react'
import type { Payload } from 'payload'

import { adminThemeHueCss, normalizeAdminThemeHue } from '@/brand/admin-theme'

type Props = {
  children?: React.ReactNode
  payload: Payload
}

const AdminThemeProvider = async ({ children, payload }: Props) => {
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
  })

  const hue = normalizeAdminThemeHue(
    typeof settings.adminThemeHue === 'number' ? settings.adminThemeHue : undefined,
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: adminThemeHueCss(hue) }} />
      {children}
    </>
  )
}

export default AdminThemeProvider
