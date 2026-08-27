import type { Payload, PayloadRequest } from 'payload'

import { can } from '@/access/can'

export async function canUseAi(
  user: PayloadRequest['user'],
  reqOrPayload: PayloadRequest | Payload,
): Promise<boolean> {
  return can(user, 'ai:use', reqOrPayload)
}
