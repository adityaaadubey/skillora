'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase/client'
import { Compass, Bookmark, LayoutDashboard, Shield, LogIn, LogOut, User, Bell } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role, avatar_url')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase
          .from('profiles')
          .select('full_name, role, avatar_url')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setProfile(data))
      } else {
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/opportunities', label: 'Explore', icon: Compass },
    { href: '/saved', label: 'Saved', icon: Bookmark, authOnly: true },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, authOnly: true },
  ]

  const isAdmin = profile?.role === 'admin'

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.125rem',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            S
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Skill<span style={{ color: 'var(--accent-indigo)' }}>ora</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
          <style jsx>{`
            @media (min-width: 768px) {
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
                }}
              >
                <Icon size={17} />
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
              }}
            >
              <Shield size={16} />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        {/* Right Action Profile / Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {!loading && (
            <>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link
                    href="/reminders"
                    title="Reminders"
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Bell size={17} />
                  </Link>
                  <Link
                    href="/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.625rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--accent-indigo-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-indigo)',
                    }}>
                      <User size={15} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                  >
                    <LogOut size={15} />
                    <span style={{ display: 'none' }} className="logout-text">Sign Out</span>
                    <style jsx>{`
                      @media (min-width: 640px) {
                        .logout-text { display: inline !important; }
                      }
                    `}</style>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.125rem' }}>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
