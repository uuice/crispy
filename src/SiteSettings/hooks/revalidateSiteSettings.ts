import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ context }) => {
  if (context.disableRevalidate) {
    return
  }

  revalidateTag('global_site-settings', 'max')
  revalidatePath('/', 'layout')
}
