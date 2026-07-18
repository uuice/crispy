import { permanentRedirect } from 'next/navigation'

import { getGalleriesPath } from '@/utilities/frontendPaths'

/** Legacy flat gallery route → galleries list. */
export default function GalleryItemsLegacyPage() {
  permanentRedirect(getGalleriesPath())
}
