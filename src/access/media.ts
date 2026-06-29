import type { Access } from 'payload'

import { isAuthorOrAbove, isEditor } from './roles'

/** Authors may upload media for posts; only editors can delete. */
export const mediaCreateAccess: Access = isAuthorOrAbove

export const mediaUpdateAccess: Access = isAuthorOrAbove

export const mediaDeleteAccess: Access = isEditor
