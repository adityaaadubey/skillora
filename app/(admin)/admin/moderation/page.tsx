'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star,
  Flag,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from 'lucide-react'

export default function ModerationQueuePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)
  const [rejectModalId, setRejectModalId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const loadData = () => {
    fetch('/api/admin/moderation')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApprove = async (id: string) => {
    setActingId(id)
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved', is_verified: true }),
      })
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          opportunities: prev.opportunities.map((o: any) =>
            o.id === id ? { ...o, status: 'approved', is_verified: true } : o
          ),
        }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setActingId(id)
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected', moderation_reason: rejectReason }),
      })
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          opportunities: prev.opportunities.map((o: any) =>
            o.id === id ? { ...o, status: 'rejected', moderation_reason: rejectReason } : o
          ),
        }))
        setRejectModalId(null)
        setRejectReason('')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActingId(null)
    }
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved', is_featured: !currentFeatured }),
      })
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          opportunities: prev.opportunities.map((o: any) =>
            o.id === id ? { ...o, is_featured: !currentFeatured } : o
          ),
        }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading moderation items...</p>
      </div>
    )
  }

  const opps = data?.opportunities || []
  const reports = data?.reports || []

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Admin Console</span>
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Moderation & Compliance Queue
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Review pending student submissions, apply verified certifications, and resolve flags.
        </p>
      </div>

      {/* Flagged Reports Section */}
      {reports.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Flag size={20} color="#f43f5e" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Student Reports ({reports.length})</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reports.map((r: any) => (
              <div
                key={r.id}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="badge badge-rose">Reason: {r.reason}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Reported {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginTop: '0.5rem' }}>
                  Listing: {r.opportunities?.title} ({r.opportunities?.organization})
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Student details: &quot;{r.details}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities Queue Table */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          All Submitted & Ingested Listings ({opps.length})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {opps.map((opp: any) => {
            const isApproved = opp.status === 'approved'
            const isRejected = opp.status === 'rejected'
            return (
              <div
                key={opp.id}
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span className={`badge ${isApproved ? 'badge-emerald' : isRejected ? 'badge-rose' : 'badge-amber'}`}>
                      Status: {opp.status}
                    </span>
                    <span className="badge badge-indigo">{opp.category}</span>
                    {opp.is_verified && <span className="badge badge-cyan">Verified</span>}
                    {opp.is_featured && <span className="badge badge-amber">★ Featured</span>}
                  </div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>
                    <Link href={`/opportunities/${opp.id}`}>{opp.title}</Link>
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {opp.organization} • {opp.mode} • Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling'}
                  </div>
                  {opp.moderation_reason && (
                    <div style={{ fontSize: '0.75rem', color: '#fda4af', marginTop: '0.25rem' }}>
                      Reason: {opp.moderation_reason}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleToggleFeatured(opp.id, !!opp.is_featured)}
                    title={opp.is_featured ? 'Remove featured' : 'Make featured'}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.6rem', color: opp.is_featured ? '#f59e0b' : 'var(--text-muted)' }}
                  >
                    <Star size={15} fill={opp.is_featured ? 'currentColor' : 'none'} />
                  </button>

                  <a
                    href={opp.canonical_url || opp.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.6rem' }}
                  >
                    <ExternalLink size={15} />
                  </a>

                  {!isApproved && (
                    <button
                      onClick={() => handleApprove(opp.id)}
                      disabled={actingId === opp.id}
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                    >
                      <CheckCircle size={14} />
                      <span>Approve</span>
                    </button>
                  )}

                  {!isRejected && (
                    <button
                      onClick={() => setRejectModalId(opp.id)}
                      disabled={actingId === opp.id}
                      className="btn btn-danger"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 100,
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reject Opportunity</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Specify the rationale for rejection for audit records.
            </p>

            <div className="form-group">
              <label className="form-label">Moderation Reason</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Unverified organization, missing compensation details, or duplicate listing..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setRejectModalId(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rejectReason.trim()}
                onClick={() => handleReject(rejectModalId)}
                className="btn btn-danger"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
