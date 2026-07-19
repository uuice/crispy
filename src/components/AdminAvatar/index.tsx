'use client'

import { useAuth, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import type { Media, User } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import './index.scss'

function resolveAvatarSrc(user: User | null | undefined): string | null {
  const avatar = user?.avatar
  if (!avatar || typeof avatar !== 'object') return null

  const media = avatar as Media
  const raw = media.sizes?.thumbnail?.url || media.thumbnailURL || media.url || null
  if (!raw) return null
  return getMediaUrl(raw, media.updatedAt)
}

const FallbackIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg
    className={['graphic-account', active && 'graphic-account--active'].filter(Boolean).join(' ')}
    height="25"
    viewBox="0 0 25 25"
    width="25"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle className="graphic-account__bg" cx="12.5" cy="12.5" r="11.5" />
    <circle className="graphic-account__head" cx="12.5" cy="10.73" r="3.98" />
    <path
      className="graphic-account__body"
      d="M12.5,24a11.44,11.44,0,0,0,7.66-2.94c-.5-2.71-3.73-4.8-7.66-4.8s-7.16,2.09-7.66,4.8A11.44,11.44,0,0,0,12.5,24Z"
    />
  </svg>
)

const AdminAvatar: React.FC = () => {
  const { user } = useAuth()
  const {
    config: {
      admin: {
        routes: { account: accountRoute },
      },
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const pathname = usePathname()
  const isOnAccountPage =
    pathname ===
    formatAdminURL({
      adminRoute,
      path: accountRoute,
    })

  const src = resolveAvatarSrc(user as User | null | undefined)
  if (src) {
    return (
      <img
        alt=""
        className="crispy-admin-avatar"
        height={25}
        src={src}
        width={25}
      />
    )
  }

  return <FallbackIcon active={isOnAccountPage} />
}

export default AdminAvatar
