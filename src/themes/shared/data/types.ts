export type PostListItem = {
  title: string
  url: string
  excerpt?: string
  pubDate: string
  categories: string[]
  tags: string[]
}

export type SidebarCategory = {
  id: string
  title: string
  url: string
  count: number
}

export type SidebarTag = {
  id: string
  title: string
  url: string
  count: number
}

export type NavItem = {
  title: string
  url: string
  target?: string | null
}

export type SidebarUser = {
  title: string
  excerpt?: string
  url: string
}

export type SidebarData = {
  categories: SidebarCategory[]
  tags: SidebarTag[]
  menu: NavItem[]
  footerMenu: NavItem[]
  user?: SidebarUser
}
