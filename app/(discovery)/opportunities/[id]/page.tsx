'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDeadline, getCategoryBadgeClass, formatCompensation } from '../../../../lib/utils'
import {
  ArrowLeft,
  Bookmark,
  Bell,
  Flag,
  ExternalLink,
  ShieldCheck,
  Calendar,
  MapPin,
  DollarSign,
  Award,
  Sparkles,
  CheckCircle2,
  Building2,
  Clock,
  Loader2,
} from 'lucide-react'

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // Reminder modal state
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [reminderDays, setReminderDays] = useState('3')
  const [settingReminder, setSettingReminder] = useState(false)
  const [reminderSaved, setReminderSaved] = useState(false)

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('scam')
  const [reportDetails, setReportDetails] = useState('')
  const [submittingReport, setSubmittingReport] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Opportunity not found')
        return res.json()
      })
      .then((json) => {
        setData(json)
        setSaved(json.isSaved)
        if (json.reminder) setReminderSaved(true)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleToggleSave = async () => {
    setSaving(true)
    const nextState = !saved
    setSaved(nextState)

    try {
      const res = await fetch(`/api/opportunities/${id}/save`, {
        method: nextState ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) setSaved(!nextState)
    } catch {
      setSaved(!nextState)
    } finally {
      setSaving(false)
    }
  }

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingReminder(true)

    try {
      const days = parseInt(reminderDays, 10)
      const targetTime = new Date()
      targetTime.setDate(targetTime.getDate() + days)

      const res = await fetch(`/api/opportunities/${id}/remind`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remind_at: targetTime.toISOString(),
          channel: 'in_app',
        }),
      })

      if (res.ok) {
        setReminderSaved(true)
        setShowReminderModal(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSettingReminder(false)
    }
  }

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingReport(true)

    try {
      const res = await fetch(`/api/opportunities/${id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reportReason,
          details: reportDetails,
        }),
      })

      if (res.ok) {
        setReportSubmitted(true)
        setTimeout(() => setShowReportModal(false), 1200)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingReport(false)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading opportunity intelligence...</p>
      </div>
    )
  }

  if (error || !data?.opportunity) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Opportunity Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          This listing may have been unlisted, expired, or removed by moderation.
        </p>
        <Link href="/opportunities" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Opportunities</span>
        </Link>
      </div>
    )
  }

  const opp = data.opportunity
  const relevance = data.relevance

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/opportunities"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Explore</span>
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
      }}>
        <style jsx>{`
          @media (min-width: 992px) {
            .detail-layout {
              display: grid !important;
              grid-template-columns: 2fr 1fr !important;
              gap: 2rem !important;
            }
          }
        `}</style>
        <div className="detail-layout">
          {/* Main Column */}
          <div>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              {/* Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className={`badge ${getCategoryBadgeClass(opp.category)}`}>{opp.category}</span>
                {opp.platform && (
                  <span
                    className={`badge-platform badge-platform-${opp.platform.toLowerCase().replace(/\s+/g, '-')}`}
                    title={`Opportunity hosted on ${opp.platform}`}
                  >
                    {opp.platform}
                  </span>
                )}
                {opp.is_verified && (
                  <span className="badge badge-emerald">
                    <ShieldCheck size={13} /> Verified
                  </span>
                )}
                {opp.is_featured && <span className="badge badge-amber">Featured</span>}
                <span className="badge badge-cyan">{opp.mode}</span>
                {opp.pricing_type === 'free' && <span className="badge badge-emerald">100% Free</span>}
              </div>

              {/* Title & Organization */}
              <h1 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 800,
                lineHeight: 1.25,
                marginBottom: '0.5rem',
              }}>
                {opp.title}
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
              }}>
                <Building2 size={18} color="var(--accent-indigo)" />
                <span style={{ fontWeight: 600 }}>{opp.organization}</span>
              </div>

              {/* Meta Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                padding: '1.25rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '2rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Deadline
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}>
                    <Calendar size={15} color="var(--accent-indigo)" />
                    <span>{formatDeadline(opp.deadline).formattedDate}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Location
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}>
                    <MapPin size={15} color="var(--accent-cyan)" />
                    <span>{opp.mode === 'remote' ? 'Remote (Worldwide)' : opp.location || 'Multiple Cities'}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Compensation / Reward
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, color: '#6ee7b7' }}>
                    {(() => {
                      const comp = formatCompensation(opp)
                      if (comp.type === 'stipend') {
                        return (
                          <>
                            <DollarSign size={15} />
                            <span>{comp.label}</span>
                          </>
                        )
                      }
                      if (comp.type === 'prize') {
                        return (
                          <>
                            <Award size={15} color="#fcd34d" />
                            <span style={{ color: '#fcd34d' }}>{comp.label}</span>
                          </>
                        )
                      }
                      return <span>{comp.label}</span>
                    })()}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Duration
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}>
                    <Clock size={15} color="var(--text-secondary)" />
                    <span>{opp.duration || 'Flexible timeline'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Overview</h2>
                <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                  {opp.description}
                </div>
              </div>

              {/* Skills */}
              {opp.skills && opp.skills.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Skills & Technologies</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {opp.skills.map((skill: string) => (
                      <span
                        key={skill}
                        style={{
                          padding: '0.35rem 0.75rem',
                          background: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#a5b4fc',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility */}
              {opp.eligibility_text && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Eligibility Criteria</h2>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {opp.eligibility_text}
                  </p>
                </div>
              )}

              {/* Source Provenance */}
              <div style={{
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={15} color="var(--accent-emerald)" />
                  <span>Verified Provenance & Audit Trail</span>
                </div>
                <div>Source: {opp.opportunity_sources?.name || 'Verified Partner Feed'} • Trust Score: {Math.round((opp.opportunity_sources?.trust_score || 0.95) * 100)}%</div>
                <div style={{ wordBreak: 'break-all', marginTop: '0.25rem' }}>Canonical URL: {opp.canonical_url || opp.application_url}</div>
              </div>
            </div>
          </div>

          {/* Sidebar Action Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Action Box */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <a
                href={opp.canonical_url || opp.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginBottom: '0.75rem' }}
              >
                <span>Apply on {opp.platform || 'Official Site'}</span>
                <ExternalLink size={18} />
              </a>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  onClick={handleToggleSave}
                  disabled={saving}
                  className="btn btn-secondary"
                  style={{ padding: '0.625rem', fontSize: '0.875rem' }}
                >
                  <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} color={saved ? 'var(--accent-indigo)' : undefined} />
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => setShowReminderModal(true)}
                  className="btn btn-secondary"
                  style={{ padding: '0.625rem', fontSize: '0.875rem' }}
                >
                  <Bell size={16} color={reminderSaved ? 'var(--accent-amber)' : undefined} />
                  <span>{reminderSaved ? 'Reminded' : 'Remind'}</span>
                </button>
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  padding: '0.25rem',
                }}
              >
                <Flag size={14} />
                <span>Report issue or broken link</span>
              </button>
            </div>

            {/* Match Breakdown Card */}
            {relevance && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700 }}>
                    <Sparkles size={16} color="var(--accent-indigo)" />
                    <span>Relevance Intelligence</span>
                  </div>
                  <span style={{
                    fontSize: '1.125rem',
                    fontWeight: 800,
                    color: relevance.totalScore >= 75 ? 'var(--accent-emerald)' : 'var(--accent-indigo)',
                  }}>
                    {relevance.totalScore}%
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Skill Match</span>
                      <span style={{ fontWeight: 600 }}>{relevance.skillScore} / 35</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(relevance.skillScore / 35) * 100}%`, height: '100%', background: 'var(--accent-indigo)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Track Alignment</span>
                      <span style={{ fontWeight: 600 }}>{relevance.categoryScore} / 20</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(relevance.categoryScore / 20) * 100}%`, height: '100%', background: 'var(--accent-cyan)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Location & Mode</span>
                      <span style={{ fontWeight: 600 }}>{relevance.locationScore} / 15</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(relevance.locationScore / 15) * 100}%`, height: '100%', background: 'var(--accent-emerald)' }} />
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8125rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Explanation factors:</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {relevance.explanationTags.map((tag: string, i: number) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 size={14} color="var(--accent-emerald)" />
                        <span>{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Set Application Reminder</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              We will notify you before this opportunity closes so you don&apos;t miss the deadline.
            </p>

            <form onSubmit={handleCreateReminder}>
              <div className="form-group">
                <label className="form-label">Remind me</label>
                <select
                  value={reminderDays}
                  onChange={(e) => setReminderDays(e.target.value)}
                  className="form-select"
                >
                  <option value="1">1 day before deadline</option>
                  <option value="3">3 days before deadline</option>
                  <option value="7">1 week before deadline</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowReminderModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={settingReminder}
                  className="btn btn-primary"
                >
                  {settingReminder ? 'Saving...' : 'Set Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Report Listing Issue</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Help keep Skillora verified and spam-free for all students.
            </p>

            {reportSubmitted ? (
              <div style={{ padding: '1rem', background: 'var(--accent-emerald-subtle)', color: '#6ee7b7', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                Thank you! Your report has been dispatched to moderation.
              </div>
            ) : (
              <form onSubmit={handleSubmitReport}>
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="form-select"
                  >
                    <option value="scam">Scam / Fraudulent asking for fees</option>
                    <option value="expired">Opportunity deadline has passed</option>
                    <option value="wrong_link">Application link is broken or 404</option>
                    <option value="misleading">Misleading compensation or criteria</option>
                    <option value="duplicate">Duplicate listing</option>
                    <option value="other">Other issue</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide specific details to assist our moderator audit..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport || reportDetails.length < 5}
                    className="btn btn-primary"
                  >
                    {submittingReport ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
