'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SkilloraLogo } from './SkilloraLogo'
import { PostOpportunityModal } from './PostOpportunityModal'
import {
  Compass,
  Sparkles,
  Zap,
  Briefcase,
  Trophy,
  GraduationCap,
  Award,
  PlusCircle,
  Bookmark,
  LayoutDashboard,
  User,
  Mail,
  Copy,
  Radio,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Users,
} from 'lucide-react'

import { createClient } from '../lib/supabase/client'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [showPostModal, setShowPostModal] = useState(false)
  const [copied, setCopied] = useState(false)
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
  }, [])

  const copyFounderContact = () => {
    navigator.clipboard.writeText('skillora.aditya@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const primaryNav = [
    { href: '/opportunities', label: 'All Opportunities', icon: Compass, badge: 'Live' },
    { href: '/squads', label: 'Skillora Squads', icon: Users, badge: 'Community' },
    ...(user ? [{ href: '/opportunities?direct=true', label: '1-Click Direct Apply', icon: Zap, badge: 'Zero-Redirect' }] : []),
    { href: user ? '/dashboard' : '/login', label: 'AI Smart Matcher', icon: Sparkles, badge: 'Deterministic' },
  ]

  const trackNav = [
    { href: '/opportunities?category=internship', label: 'Engineering Internships', icon: Briefcase },
    { href: '/opportunities?category=hackathon', label: 'Global Hackathons', icon: Trophy },
    { href: '/opportunities?category=fellowship', label: 'Fellowships & Grants', icon: GraduationCap },
    { href: '/opportunities?category=competition', label: 'Competitions & Quizzes', icon: Award },
  ]

  const userNav = [
    { href: '/saved', label: 'Saved Bookmarks', icon: Bookmark },
    { href: '/dashboard', label: 'My Applications', icon: LayoutDashboard },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 60,
          }}
          className="sidebar-backdrop"
        />
      )}

      {/* Floating or Fixed Sidebar Drawer */}
      <aside
        className={`skillora-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-subtle)',
          zIndex: 70,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: isOpen ? '0 20px 40px rgba(0, 0, 0, 0.4)' : 'none',
          overflowY: 'auto',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            height: '68px',
            padding: '0 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}
        >
          <SkilloraLogo size="md" />
          <button
            onClick={onToggle}
            aria-label="Close sidebar"
            style={{
              width: '32px',
              height: '32px',
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
            <X size={16} />
          </button>
        </div>

        {/* Live Ingestion Pipeline Telemetry Pill */}
        <div style={{ padding: '0.875rem 1.25rem 0.5rem' }}>
          <div
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#10b981',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                animation: 'pulse 2s infinite',
              }}
            />
            <span>10+ Global Pipes Active & Synced</span>
          </div>
        </div>

        {/* Host an Opportunity Quick CTA */}
        <div style={{ padding: '0.5rem 1.25rem' }}>
          <button
            onClick={() => setShowPostModal(true)}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.65rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <PlusCircle size={16} />
            <span>Post an Opportunity</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
          {/* Section: Discovery */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.375rem' }}>
              Discovery & Intelligence
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {primaryNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onToggle}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.625rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-indigo-subtle)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <Icon size={17} color={isActive ? 'var(--accent-indigo)' : 'var(--text-muted)'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          padding: '0.125rem 0.375rem',
                          borderRadius: 'var(--radius-full)',
                          background: item.badge === 'Live' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: item.badge === 'Live' ? '#10b981' : 'var(--accent-indigo)',
                          fontWeight: 700,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Section: Tracks */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.375rem' }}>
              Opportunity Tracks
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {trackNav.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onToggle}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.45rem 0.625rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                    }}
                  >
                    <Icon size={16} color="var(--text-muted)" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Section: User Workspace */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.375rem' }}>
              My Workspace
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {userNav.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onToggle}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.45rem 0.625rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                    }}
                  >
                    <Icon size={16} color="var(--text-muted)" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Founder Card at Bottom */}
        <div
          style={{
            padding: '1rem',
            margin: '0.75rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
                flexShrink: 0,
              }}
            >
              AD
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                Aditya Dubey
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Founder & Architect
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
            Empowering every student with transparent, spam-free global opportunity matching.
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a
              href="mailto:skillora.aditya@gmail.com"
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.75rem', justifyContent: 'center', gap: '0.35rem' }}
              title="skillora.aditya@gmail.com"
            >
              <Mail size={13} />
              <span>Email</span>
            </a>
            <button
              onClick={copyFounderContact}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              title="Copy official email"
            >
              {copied ? <CheckCircle2 size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Post Opportunity Modal */}
      <PostOpportunityModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
      />
    </>
  )
}
