'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import type { NavItem } from '../data/types'

type Props = {
  menu: NavItem[]
}

export function MobileNav({ menu }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="cms-mobile-nav">
      <button
        aria-expanded={open}
        aria-label="打开菜单"
        className="cms-mobile-nav-trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>
      {open ? (
        <>
          <button
            aria-label="关闭菜单"
            className="cms-mobile-nav-backdrop"
            onClick={() => setOpen(false)}
            type="button"
          />
          <nav aria-label="移动端导航" className="cms-mobile-nav-panel">
            {menu.map((item) => (
              <Link
                href={item.url}
                key={item.url + item.title}
                onClick={() => setOpen(false)}
                target={item.target || '_self'}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </>
      ) : null}
    </div>
  )
}
