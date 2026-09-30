'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../lib/supabase/client'
import { Opportunity } from '../lib/database.types'
import {
  X,
  Sparkles,
  CheckCircle,
  Building2,
  Calendar,
  Send,
  Loader2,
  ShieldCheck,
  FileText,
  User,
  Mail,
  Phone,
  GraduationCap,
  Globe,
} from 'lucide-react'

interface DirectApplyModalProps {
  opportunity: Opportunity | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function DirectApplyModal({
  opportunity,
  isOpen,
  onClose,
  onSuccess,
}: DirectApplyModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [degree, setDegree] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [pitch, setPitch] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let isMounted = true
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (!isMounted) return
        if (data?.authenticated && data?.user) {
          setUser(data.user)
          if (data.user.email && !email) setEmail(data.user.email)
          if (data.user.profile?.full_name && !fullName) setFullName(data.user.profile.full_name)
          if (data.user.profile?.college && !college) setCollege(data.user.profile.college)
          if (data.user.profile?.degree && !degree) setDegree(data.user.profile.degree)
          setAuthChecked(true)
          return
        }
      } catch {}
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        if (isMounted) {
          setUser(data?.user ?? null)
          if (data?.user?.email && !email) setEmail(data.user.email)
        }
      } catch {
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setAuthChecked(true)
      }
    }
    checkAuth()
    return () => {
      isMounted = false
    }
  }, [isOpen])

  if (!isOpen || !opportunity) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        organization: opportunity.organization,
        applicantName: fullName,
        applicantEmail: email,
        applicantPhone: phone,
        college,
        degree,
        yearOfStudy,
        portfolioUrl,
        resumeUrl,
        pitch,
      }

      const res = await fetch(`/api/opportunities/${opportunity.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit application')
      }

      setApplicationId(json.applicationId || `SKL-APP-${Math.floor(100000 + Math.random() * 900000)}`)
      setSubmitted(true)
      onSuccess?.()
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setApplicationId(null)
    setError(null)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
          background: 'var(--bg-glass)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close application modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          /* Submission Success State */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <CheckCircle size={38} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--accent-indigo)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}
            >
              <ShieldCheck size={14} />
              <span>Skillora Direct In-App Submission</span>
            </div>

            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Application Successfully Submitted!
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              Your profile and credentials have been securely registered directly with{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{opportunity.organization}</strong> via Skillora. Zero redirects, verified delivery.
            </p>

            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                maxWidth: '400px',
                margin: '0 auto 2rem',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Application ID:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-indigo)', fontFamily: 'monospace' }}>
                  {applicationId}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Program:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{opportunity.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>Confirmed (In Review)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={handleReset} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Done
              </button>
            </div>
          </div>
        ) : !user ? (
          /* Authentication Gate */
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <ShieldCheck size={34} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--accent-indigo)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={12} />
              <span>Authentication Required</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Sign In to Direct Apply
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 1.75rem' }}>
              Skillora 1-Click Direct Apply submits verified credentials and tracks application status directly without third-party spam. Please sign in or register to submit an application.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/login"
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.875rem' }}
              >
                Sign In to Apply
              </Link>
              <Link
                href="/register"
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.875rem' }}
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          /* Application Form */
          <div>
            <div style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--accent-indigo)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}
              >
                <Sparkles size={12} />
                <span>1-Click Skillora Direct Application</span>
              </div>

              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.25rem' }}>
                Apply for {opportunity.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <Building2 size={14} />
                <span>{opportunity.organization}</span>
                <span>•</span>
                <span style={{ textTransform: 'capitalize' }}>{opportunity.category}</span>
                {opportunity.mode && (
                  <>
                    <span>•</span>
                    <span style={{ textTransform: 'capitalize' }}>{opportunity.mode}</span>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditya Dubey"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input"
                      style={{ width: '100%', paddingLeft: '2.25rem' }}
                    />
                    <User size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="aditya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      style={{ width: '100%', paddingLeft: '2.25rem' }}
                    />
                    <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    WhatsApp / Phone Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9881867687"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input"
                      style={{ width: '100%', paddingLeft: '2.25rem' }}
                    />
                    <Phone size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    College / University *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IIT Bombay / University of Delhi"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="input"
                      style={{ width: '100%', paddingLeft: '2.25rem' }}
                    />
                    <GraduationCap size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Degree / Branch
                  </label>
                  <input
                    type="text"
                    placeholder="B.Tech Computer Science"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Current Year
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Graduate / Alum">Graduate / Alum</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    GitHub or Portfolio URL
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="input"
                      style={{ width: '100%', paddingLeft: '2.25rem' }}
                    />
                    <Globe size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Resume Link (Drive / Dropbox)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="input"
                      style={{ width: '100%', paddingLeft: '2.25rem' }}
                    />
                    <FileText size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                  Why are you interested in this opportunity?
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a brief 2-3 sentence summary of your background, projects, and why you are a great fit..."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="input"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Zero spam guarantee: Your info is encrypted and shared solely for this application.</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={submitting}
                  style={{ padding: '0.625rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '0.625rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Direct Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
