'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, CheckCircle, AlertTriangle, Rss, ArrowRight, Activity, Loader2 } from 'lucide-react'

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/moderation')
      .then((res) => {
        if (!res.ok) throw new Error('Admin authorization required')
        return res.json()
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Verifying administrative credentials...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <Shield size={48} color="var(--accent-amber)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Your user profile does not have the administrative role required to access this console.
        </p>
        <Link href="/dashboard" className="btn btn-secondary">
          Return to Student Dashboard
        </Link>
      </div>
    )
  }

  const opps = data?.opportunities || []
  const reports = data?.reports || []
  const auditLogs = data?.auditLogs || []

  const pendingCount = opps.filter((o: any) => o.status === 'pending').length
  const openReportsCount = reports.filter((r: any) => r.status === 'open').length

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#f59e0b', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            <Shield size={14} />
            <span>ROOT SECURITY PRIVILEGES</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Administrative Control Center
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/moderation" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            <span>Moderation Queue</span>
          </Link>
          <Link href="/admin/sources" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            <Rss size={16} />
            <span>Manage Feeds</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
            PENDING APPROVALS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: pendingCount > 0 ? '#f59e0b' : 'var(--text-primary)' }}>
            {pendingCount}
          </div>
          <Link href="/admin/moderation" style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', marginTop: '0.25rem', display: 'inline-block' }}>
            Review pending queue →
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
            OPEN USER REPORTS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: openReportsCount > 0 ? '#f43f5e' : 'var(--text-primary)' }}>
            {openReportsCount}
          </div>
          <Link href="/admin/moderation" style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', marginTop: '0.25rem', display: 'inline-block' }}>
            Audit reports →
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
            TOTAL AUDITED LISTINGS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>
            {opps.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>
            {opps.filter((o: any) => o.status === 'approved').length} Active Approved
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
            INGESTION SOURCES
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>
            4
          </div>
          <Link href="/admin/sources" style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', marginTop: '0.25rem', display: 'inline-block' }}>
            Run sync pipeline →
          </Link>
        </div>
      </div>

      {/* Recent Security & Moderation Audit Logs */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Activity size={18} color="var(--accent-indigo)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Security & Administrative Audit Trail</h2>
        </div>

        {auditLogs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent audit events recorded.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {auditLogs.map((log: any) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8125rem',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--accent-indigo)', marginRight: '0.5rem' }}>
                    {log.action}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    on {log.entity_type} {log.entity_id ? `(${log.entity_id.slice(0, 8)}...)` : ''}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
