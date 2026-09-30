'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  GraduationCap,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  School,
  Globe,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = (searchParams.get('role') === 'organizer' ? 'organizer' : 'student') as 'student' | 'organizer'

  // Account Type
  const [role, setRole] = useState<'student' | 'organizer'>(initialRole)

  // Shared Fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Student Fields
  const [college, setCollege] = useState('')
  const [degree, setDegree] = useState('')
  const [graduationYear, setGraduationYear] = useState<number | ''>(2026)

  // Organizer Fields
  const [organizationName, setOrganizationName] = useState('')
  const [organizationType, setOrganizationType] = useState('Tech Company')
  const [website, setWebsite] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)

    try {
      const payload: Record<string, any> = {
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        role,
      }

      if (role === 'student') {
        if (college) payload.college = college.trim()
        if (degree) payload.degree = degree.trim()
        if (graduationYear) payload.graduationYear = Number(graduationYear)
      } else {
        if (organizationName) payload.organizationName = organizationName.trim()
        if (organizationType) payload.organizationType = organizationType
        if (website) payload.website = website.trim()
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      setSuccess('Account created successfully! Redirecting...')
      try {
        window.dispatchEvent(new Event('auth-change'))
      } catch {}
      setTimeout(() => {
        router.push('/opportunities')
        router.refresh()
      }, 700)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong during account creation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel" style={{
      width: '100%',
      maxWidth: '520px',
      padding: '2.5rem 2rem',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          marginBottom: '1rem',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
        }}>
          <Sparkles size={24} />
        </div>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
          Create your Skillora Account
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Join students and organizers discovering verified opportunities.
        </p>
      </div>

      {/* Account Type Selector (Student vs Opportunity Provider) */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" style={{ marginBottom: '0.625rem', fontWeight: 700 }}>
          Select Account Type
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* Student Card */}
          <div
            onClick={() => setRole('student')}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: role === 'student' ? '2px solid var(--accent-indigo)' : '1px solid var(--border-medium)',
              background: role === 'student' ? 'var(--accent-indigo-subtle)' : 'var(--bg-surface)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.375rem',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
              <GraduationCap size={22} style={{ color: 'var(--accent-indigo)' }} />
              {role === 'student' && <CheckCircle2 size={16} style={{ color: 'var(--accent-indigo)' }} />}
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Student
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Find internships, hackathons & scholarships
            </div>
          </div>

          {/* Organizer Card */}
          <div
            onClick={() => setRole('organizer')}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: role === 'organizer' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-medium)',
              background: role === 'organizer' ? 'var(--accent-cyan-subtle)' : 'var(--bg-surface)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.375rem',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
              <Building2 size={22} style={{ color: 'var(--accent-cyan)' }} />
              {role === 'organizer' && <CheckCircle2 size={16} style={{ color: 'var(--accent-cyan)' }} />}
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Opportunity Provider
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Post listings & hire verified talent
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--accent-rose-subtle)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#fda4af',
          fontSize: '0.875rem',
          marginBottom: '1.25rem',
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--accent-emerald-subtle)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#6ee7b7',
          fontSize: '0.875rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <ShieldCheck size={16} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" htmlFor="full-name">
            {role === 'student' ? 'Full Name' : 'Organizer / Contact Name'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="full-name"
              type="text"
              required
              placeholder={role === 'student' ? 'e.g. Alex Morgan' : 'e.g. Sarah Connor'}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              disabled={loading}
            />
            <User
              size={18}
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" htmlFor="register-email">
            {role === 'student' ? 'Email Address' : 'Official / Work Email'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="register-email"
              type="email"
              required
              placeholder={role === 'student' ? 'name@university.edu or you@example.com' : 'recruiter@company.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              autoComplete="email"
              disabled={loading}
            />
            <Mail
              size={18}
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" htmlFor="register-password">
            Password (min 6 characters)
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              autoComplete="new-password"
              disabled={loading}
            />
            <Lock
              size={18}
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Role Specific Fields */}
        {role === 'student' ? (
          <>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="college-input">
                College / University
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="college-input"
                  type="text"
                  placeholder="e.g. Stanford University, IIT, BITS"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  disabled={loading}
                />
                <School
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="degree-input">
                  Degree & Major
                </label>
                <input
                  id="degree-input"
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="grad-input">
                  Grad Year
                </label>
                <input
                  id="grad-input"
                  type="number"
                  min={2022}
                  max={2032}
                  placeholder="2026"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : '')}
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="org-name-input">
                Organization / Company Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="org-name-input"
                  type="text"
                  required
                  placeholder="e.g. Google Developers, Acme Corp, Coding Club"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  disabled={loading}
                />
                <Building2
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="org-type-select">
                  Organization Type
                </label>
                <select
                  id="org-type-select"
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="Tech Company">Tech Company</option>
                  <option value="Startup">Startup</option>
                  <option value="University / College">University / College</option>
                  <option value="Student Club">Student Club</option>
                  <option value="Non-Profit / NGO">Non-Profit / NGO</option>
                  <option value="Open Source Org">Open Source Org</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="org-website-input">
                  Official Website
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="org-website-input"
                    type="url"
                    placeholder="https://acme.org"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.25rem' }}
                    disabled={loading}
                  />
                  <Globe
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.8125rem', fontSize: '0.9375rem', marginTop: '0.5rem' }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create {role === 'organizer' ? 'Organizer' : 'Student'} Account</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div style={{
        marginTop: '1.75rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 700, textDecoration: 'none' }}>
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 68px - 100px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
    }}>
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <Loader2 size={20} className="animate-spin" />
          <span>Loading portal...</span>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
