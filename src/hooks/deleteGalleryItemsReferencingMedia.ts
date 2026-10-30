import type { CollectionBeforeDeleteHook } from 'payload'

/**
 * gallery-items.image is required (NOT NULL) while the FK is ON DELETE SET NULL.
 * Permanently deleting media would null image_id and violate the constraint.
 * Remove referencing gallery items first, including rows already in trash.
 * Soft-delete (trash) is an update of deletedAt and does not run this hook.
 */
export const deleteGalleryItemsReferencingMedia: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const items = await req.payload.find({
    collection: 'gallery-items',
    depth: 0,
    limit: 0,
    overrideAccess: true,
    pagination: false,
    req,
    trash: true,
    where: {
      image: {
        equals: id,
      },
    },
  })

  for (const item of items.docs) {
    await req.payload.delete({
      collection: 'gallery-items',
      id: item.id,
      overrideAccess: true,
      req,
      trash: true,
    })
  }
}
