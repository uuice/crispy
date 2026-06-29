import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = () => {
  revalidateTag('global_site-settings')
  revalidatePath('/', 'layout')
}
