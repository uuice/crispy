import Link from 'next/link'
import React from 'react'

import type { SidebarCategory } from '../data/types'

type Props = {
  categories: SidebarCategory[]
}

export function Sidebar({ categories }: Props) {
  if (categories.length === 0) return null

  return (
    <aside aria-label="文档分类" className="kb-sidebar">
      <p className="kb-sidebar-heading">分类</p>
      <nav className="kb-sidebar-nav">
        <ul>
          {categories.map((item) => (
            <li key={item.id}>
              <Link className="kb-sidebar-link" href={item.url} prefetch={false}>
                <span>{item.title}</span>
                {item.count > 0 ? <span className="kb-sidebar-count">{item.count}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
