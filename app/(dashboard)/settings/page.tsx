'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Download, Trash2, CheckCircle2, Loader2, Lock, AlertTriangle, X } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
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
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  // Account Deletion State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  const handleDeleteAccount = async () => {
    setDeleting(true)
    setDeleteError(null)

    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account')
      }

      router.push('/?accountDeleted=true')
      router.refresh()
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete account. Please try again.')
      setDeleting(false)
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
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Lock size={20} color="var(--accent-amber)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Account Security</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          Your account is secured with standard email and password authentication. You can update your preferences or manage your account directly at any time.
        </p>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Registered email: <strong style={{ color: 'var(--text-primary)' }}>{profile?.email || 'Authenticated User'}</strong>
        </div>
      </div>

      {/* Danger Zone: Permanent Account Deletion */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        background: 'rgba(244, 63, 94, 0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <AlertTriangle size={20} color="var(--accent-rose)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-rose)' }}>Danger Zone</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Permanently delete your Skillora account. All your student profile data, bookmarks, custom preferences, and application tracking history will be immediately wiped from our servers. This action cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="btn"
          style={{
            background: 'var(--accent-rose)',
            color: '#ffffff',
            boxShadow: '0 2px 10px rgba(244, 63, 94, 0.3)',
            padding: '0.625rem 1.25rem',
          }}
        >
          <Trash2 size={16} />
          <span>Delete Account Permanently</span>
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '460px',
            width: '100%',
            padding: '2rem',
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            position: 'relative',
          }}>
            <button
              onClick={() => { if (!deleting) { setShowDeleteModal(false); setDeleteError(null); } }}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose)',
              marginBottom: '1rem',
            }}>
              <AlertTriangle size={24} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Permanently Delete Account?
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you completely sure? This will permanently erase your user profile (<strong style={{ color: 'var(--text-primary)' }}>{profile?.email}</strong>), your bookmarked opportunities, and preferences. You will not be able to recover this account.
            </p>

            {deleteError && (
              <div style={{
                padding: '0.625rem 0.875rem',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-sm)',
                color: '#fda4af',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
              }}>
                {deleteError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setShowDeleteModal(false); setDeleteError(null); }}
                disabled={deleting}
                className="btn btn-outline"
                style={{ padding: '0.625rem 1.125rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="btn"
                style={{
                  background: 'var(--accent-rose)',
                  color: '#ffffff',
                  padding: '0.625rem 1.125rem',
                }}
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Yes, Delete My Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
