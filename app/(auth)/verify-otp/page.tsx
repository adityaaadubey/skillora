'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, KeyRound, Loader2, ArrowLeft } from 'lucide-react'

function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(30)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendCooldown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim() || token.trim().length < 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: token.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(returnTo)
        router.refresh()
      }, 700)
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired verification code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return
    setResending(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to resend code')
      }

      setResendCooldown(45)
    } catch (err: any) {
      setError(err?.message || 'Could not resend OTP.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="glass-panel" style={{
      width: '100%',
      maxWidth: '440px',
      padding: '2.5rem 2rem',
      position: 'relative',
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
          }}
        >
          <ArrowLeft size={14} />
          <span>Change email</span>
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--accent-indigo), #4f46e5)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          marginBottom: '1rem',
        }}>
          <KeyRound size={24} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
          Enter Verification Code
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          We sent a 6-digit code to{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{email || 'your email'}</strong>
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
          <span>Success! Setting up your workspace...</span>
        </div>
      )}

      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label className="form-label" htmlFor="otp-input" style={{ textAlign: 'center', display: 'block' }}>
            6-Digit Code
          </label>
          <input
            id="otp-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={8}
            autoFocus
            placeholder="123456"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
            className="form-input"
            style={{
              textAlign: 'center',
              fontSize: '1.5rem',
              letterSpacing: '0.3em',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              padding: '0.75rem',
            }}
            disabled={loading || success}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          disabled={loading || success || token.length < 6}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Verifying Token...</span>
            </>
          ) : (
            <span>Verify & Continue</span>
          )}
        </button>
      </form>

      <div style={{
        marginTop: '1.75rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}>
        <span>Didn&apos;t get the code? </span>
        {resendCooldown > 0 ? (
          <span style={{ color: 'var(--text-muted)' }}>Resend in {resendCooldown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-indigo)',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
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
          <p style={{ color: 'var(--text-secondary)' }}>Loading verification screen...</p>
        </div>
      }>
        <VerifyOtpForm />
      </Suspense>
    </div>
  )
}
