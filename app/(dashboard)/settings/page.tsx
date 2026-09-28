'use client'

import { useEffect, useState } from 'react'
import { Shield, Download, Bell, Trash2, CheckCircle2, Loader2, Lock } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [consents, setConsents] = useState<Record<string, boolean>>({
    terms_of_service: true,
    privacy_policy: true,
    analytics_cookies: false,
    email_notifications: true,
    marketing_communications: false,
  })
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [savingConsent, setSavingConsent] = useState(false)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/user/profile').then((r) => r.json()),
      fetch('/api/user/consents').then((r) => r.json()),
    ])
      .then(([profData, consentData]) => {
        if (profData.profile) setProfile(profData.profile)
        if (consentData.consents) {
          setConsents((prev) => {
            const map: Record<string, boolean> = { ...prev }
            consentData.consents.forEach((c: any) => {
              map[c.consent_type] = c.agreed
            })
            return map
          })
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleToggleConsent = async (type: string, currentValue: boolean) => {
    const nextVal = !currentValue
    setConsents({ ...consents, [type]: nextVal })
    setSavingConsent(true)

    try {
      await fetch('/api/user/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent_type: type,
          agreed: nextVal,
        }),
      })
      setSavedMsg('Privacy preferences updated')
      setTimeout(() => setSavedMsg(null), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingConsent(false)
    }
  }

  const handleExportData = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/user/export')
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `skillora-my-data-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading privacy settings...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '780px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Privacy, Security & Data Rights
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Manage your personal data portability, tracking consents, and account preferences.
        </p>
      </div>

      {savedMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--accent-emerald-subtle)',
          borderRadius: 'var(--radius-md)',
          color: '#6ee7b7',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
        }}>
          <CheckCircle2 size={16} />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* GDPR / DPDP Data Portability */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Download size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Data Portability & Export</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Download a complete, machine-readable JSON archive of all your Skillora records: academic profile, technical taxonomy, application clicks, bookmark history, and privacy consent logs.
        </p>
        <button
          onClick={handleExportData}
          disabled={exporting}
          className="btn btn-secondary"
          style={{ padding: '0.625rem 1.25rem' }}
        >
          {exporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating JSON Archive...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Download All My Data (JSON)</span>
            </>
          )}
        </button>
      </div>

      {/* Privacy Consents Toggles */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Shield size={20} color="var(--accent-indigo)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Consent Management</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Terms of Service & Data Usage</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Required to use Skillora matching services.</div>
            </div>
            <input type="checkbox" checked={consents.terms_of_service} disabled style={{ width: '18px', height: '18px', accentColor: 'var(--accent-indigo)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Privacy Policy Agreement</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Governs storage of verified academic attributes.</div>
            </div>
            <input type="checkbox" checked={consents.privacy_policy} disabled style={{ width: '18px', height: '18px', accentColor: 'var(--accent-indigo)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Deadline & In-App Reminders</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Receive timely alerts before application cutoffs.</div>
            </div>
            <input
              type="checkbox"
              checked={consents.email_notifications}
              onChange={() => handleToggleConsent('email_notifications', consents.email_notifications)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Anonymous Telemetry & Analytics</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Help improve search performance and filter relevance.</div>
            </div>
            <input
              type="checkbox"
              checked={consents.analytics_cookies}
              onChange={() => handleToggleConsent('analytics_cookies', consents.analytics_cookies)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Account Security Information */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Lock size={20} color="var(--accent-amber)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Account Security</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          Your account uses passwordless cryptographic email OTP tokens. There is zero risk of password leaks or credential stuffing attacks.
        </p>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Registered email: <strong style={{ color: 'var(--text-primary)' }}>{profile?.email || 'Authenticated User'}</strong>
        </div>
      </div>
    </div>
  )
}
