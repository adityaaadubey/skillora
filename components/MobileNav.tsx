'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Bookmark, LayoutDashboard, User } from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()

  const tabs = [
    { href: '/opportunities', label: 'Explore', icon: Compass },
    { href: '/saved', label: 'Saved', icon: Bookmark },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="mobile-nav" aria-label="Mobile Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
