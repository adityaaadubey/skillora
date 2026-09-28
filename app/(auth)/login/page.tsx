'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&returnTo=${encodeURIComponent(returnTo)}`)
      }, 800)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please check your email and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel" style={{
      width: '100%',
      maxWidth: '440px',
      padding: '2.5rem 2rem',
      position: 'relative',
    }}>
      {/* Header Icon */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          marginBottom: '1rem',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
        }}>
          <Sparkles size={24} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
          Sign in to Skillora
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Passwordless. Enter your email to receive a 6-digit one-time code.
        </p>
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
          <span>Code sent! Redirecting to verification...</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email-input">
            Academic or Personal Email
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="email-input"
              type="email"
              required
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              autoComplete="email"
              disabled={loading || success}
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

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          disabled={loading || success}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Sending OTP Code...</span>
            </>
          ) : (
            <>
              <span>Continue with Email OTP</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div style={{
        marginTop: '2rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
      }}>
        <span>By signing in, you accept our </span>
        <Link href="/settings" style={{ color: 'var(--text-link)', textDecoration: 'underline' }}>Terms</Link>
        <span> & </span>
        <Link href="/settings" style={{ color: 'var(--text-link)', textDecoration: 'underline' }}>Privacy Policy</Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 68px - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
    }}>
      <Suspense fallback={
        <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem', textAlign: 'center' }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-indigo)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading authentication portal...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
