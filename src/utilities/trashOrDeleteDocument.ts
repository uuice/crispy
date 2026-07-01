import type { CollectionSlug, PayloadRequest } from 'payload'

type TrashOrDeleteDocumentArgs = {
  req: PayloadRequest
  collection: CollectionSlug
  id: number | string
  overrideAccess?: boolean
}

/**
 * Soft-delete when the collection has trash enabled; otherwise hard-delete.
 * Payload trash uses update({ deletedAt }) — delete() always removes rows permanently.
 */
export async function trashOrDeleteDocument({
  req,
  collection,
  id,
  overrideAccess = false,
}: TrashOrDeleteDocumentArgs) {
  const collectionConfig = req.payload.collections[collection]?.config

  if (collectionConfig?.trash) {
    return req.payload.update({
      collection,
      id,
      data: {
        deletedAt: new Date().toISOString(),
      },
      overrideAccess,
      user: req.user,
    })
  }

  return req.payload.delete({
    collection,
    id,
    overrideAccess,
    user: req.user,
  })
}
