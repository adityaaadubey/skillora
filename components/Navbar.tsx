'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase/client'
import { SkilloraLogo } from './SkilloraLogo'
import { Sidebar } from './Sidebar'
import { PostOpportunityModal } from './PostOpportunityModal'
import {
  Compass,
  Bookmark,
  LayoutDashboard,
  Shield,
  LogIn,
  LogOut,
  User,
  Sun,
  Moon,
  Menu,
  PlusCircle,
  Zap,
} from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [postModalOpen, setPostModalOpen] = useState(false)

  useEffect(() => {
    const activeTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    setTheme(activeTheme)

    const supabase = createClient()
    let isMounted = true

    async function loadUser() {
      // 1. Primary: Check server session endpoint (reliable with SSR HTTP-only cookies)
      try {
        const res = await fetch('/api/auth/session')
        const sessionData = await res.json()
        if (!isMounted) return
        if (sessionData?.authenticated && sessionData?.user) {
          setUser(sessionData.user)
          setProfile(sessionData.user.profile || null)
          setLoading(false)
          return
        }
      } catch (err) {
        console.error('Session sync error:', err)
      }

      // 2. Fallback: Supabase browser client
      try {
        const { data: { user: browserUser } } = await supabase.auth.getUser()
        if (!isMounted) return
        setUser(browserUser)
        if (browserUser) {
          const { data } = await supabase
            .from('profiles')
            .select('full_name, role, avatar_url')
            .eq('id', browserUser.id)
            .single()
          if (isMounted) setProfile(data)
        } else {
          setProfile(null)
        }
      } catch {
        if (isMounted) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!isMounted) return
      if (session?.user) {
        setUser(session.user)
        supabase
          .from('profiles')
          .select('full_name, role, avatar_url')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (isMounted) setProfile(data)
          })
      } else {
        loadUser()
      }
    })

    const handleAuthEvent = () => {
      loadUser()
    }

    window.addEventListener('auth-change', handleAuthEvent)
    window.addEventListener('storage', handleAuthEvent)

    return () => {
      isMounted = false
      subscription.unsubscribe()
      window.removeEventListener('auth-change', handleAuthEvent)
      window.removeEventListener('storage', handleAuthEvent)
    }
  }, [pathname])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    try {
      localStorage.setItem('skillora-theme', nextTheme)
    } catch {}
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    try {
      window.dispatchEvent(new Event('auth-change'))
    } catch {}
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/opportunities', label: 'Explore', icon: Compass },
    { href: '/opportunities?direct=true', label: 'Direct Apply', icon: Zap, authOnly: true },
    { href: '/saved', label: 'Saved', icon: Bookmark, authOnly: true },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, authOnly: true },
  ]

  const isAdmin = profile?.role === 'admin'

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
          }}
        >
          {/* Left: Official Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SkilloraLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', gap: '1.25rem', alignItems: 'center' }} className="desktop-nav">
            <style jsx>{`
              @media (min-width: 820px) {
                .desktop-nav {
                  display: flex !important;
                }
              }
            `}</style>
            {navLinks.map((link) => {
              if (link.authOnly && !user) return null
              const Icon = link.icon
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: isActive ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-fast)',
                    background: isActive ? 'var(--accent-indigo-subtle)' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {isAdmin && (
              <Link
                href="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#f59e0b',
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  textDecoration: 'none',
                }}
              >
                <Shield size={16} />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Right Actions: Post Opportunity, Theme, Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Post Opportunity Button */}
            <button
              onClick={() => setPostModalOpen(true)}
              className="btn btn-secondary"
              style={{
                display: 'none',
                padding: '0.45rem 0.875rem',
                fontSize: '0.8125rem',
                gap: '0.375rem',
                alignItems: 'center',
              }}
              id="desktop-host-btn"
            >
              <PlusCircle size={15} />
              <span>Host / Post</span>
            </button>
            <style jsx>{`
              @media (min-width: 640px) {
                #desktop-host-btn {
                  display: inline-flex !important;
                }
              }
            `}</style>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
            </button>

            {/* User Auth state */}
            {loading ? (
              <div
                style={{
                  width: '78px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                }}
              />
            ) : user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  href="/dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <User size={15} color="var(--accent-indigo)" />
                  <span style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  aria-label="Sign out"
                  title="Sign Out"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  href="/login"
                  className="btn btn-primary"
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Collapsible Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Global Post Opportunity Modal */}
      <PostOpportunityModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
      />
    </>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let isMounted = true
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (!isMounted) return
        if (data?.authenticated && data?.user) {
          setUser(data.user)
          return
        }
      } catch {}
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        if (isMounted) setUser(data?.user ?? null)
      } catch {
        if (isMounted) setUser(null)
      }
    }

    checkAuth()

    const handleAuth = () => checkAuth()
    window.addEventListener('auth-change', handleAuth)
    window.addEventListener('storage', handleAuth)

    return () => {
      isMounted = false
      window.removeEventListener('auth-change', handleAuth)
      window.removeEventListener('storage', handleAuth)
    }
  }, [pathname])

  const links = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/opportunities', label: 'Explore', icon: Compass },
    ...(user ? [{ href: '/opportunities?direct=true', label: 'Direct', icon: Zap }] : []),
    { href: '/post-opportunity', label: 'Post', icon: PlusCircle },
    { href: user ? '/dashboard' : '/login', label: user ? 'Track' : 'Sign In', icon: user ? LayoutDashboard : LogIn },
  ]

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40,
        padding: '0 0.5rem',
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
      {links.map((item) => {
        const Icon = item.icon
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              color: isActive ? 'var(--accent-indigo)' : 'var(--text-muted)',
              fontSize: '0.6875rem',
              fontWeight: isActive ? 700 : 500,
              textDecoration: 'none',
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

