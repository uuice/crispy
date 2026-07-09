'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import type { NavItem } from '../data/types'

type Props = {
  menu: NavItem[]
  categories: Array<{ id: string; title: string; url: string; count: number }>
}

export function MobileNav({ menu, categories }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="kb-mobile-nav">
      <button
        aria-expanded={open}
        aria-label="打开菜单"
        className="kb-mobile-nav-trigger"
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
            className="kb-mobile-nav-backdrop"
            onClick={() => setOpen(false)}
            type="button"
          />
          <nav aria-label="移动端导航" className="kb-mobile-nav-panel">
            {menu.map((item) => (
              <Link
                href={item.url}
                key={item.url + item.title}
                onClick={() => setOpen(false)}
                prefetch={false}
                target={item.target || '_self'}
              >
                {item.title}
              </Link>
            ))}
            {categories.length > 0 ? (
              <>
                <p className="kb-mobile-nav-heading">分类</p>
                {categories.map((item) => (
                  <Link
                    href={item.url}
                    key={item.id}
                    onClick={() => setOpen(false)}
                    prefetch={false}
                  >
                    {item.title}
                    {item.count > 0 ? ` (${item.count})` : ''}
                  </Link>
                ))}
              </>
            ) : null}
          </nav>
        </>
      ) : null}
    </div>
  )
}
