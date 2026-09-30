'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCategoryBadgeClass, formatDeadline, formatCompensation } from '../../../lib/utils'
import { CalendarSyncButton } from '../../../components/CalendarSyncButton'
import {
  Bookmark,
  ExternalLink,
  Trash2,
  Edit3,
  Check,
  Loader2,
  ArrowRight,
  Columns,
  List,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Trophy,
  ChevronRight,
  Plus,
  FileText,
} from 'lucide-react'
import { ApplicationSlipModal } from '../../../components/ApplicationSlipModal'

export default function SavedPipelinePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [activeTab, setActiveTab] = useState('all')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [noteContent, setNoteContent] = useState('')
  const [selectedSlip, setSelectedSlip] = useState<any>(null)

  const KANBAN_COLUMNS = [
    { key: 'saved', label: 'Saved / Shortlisted', icon: '📌', color: '#6366f1' },
    { key: 'applying', label: 'Drafting / In Progress', icon: '📝', color: '#06b6d4' },
    { key: 'applied', label: 'Submitted / Under Review', icon: '🚀', color: '#3b82f6' },
    { key: 'interviewing', label: 'Interview & Assessment', icon: '🎯', color: '#f59e0b' },
    { key: 'offer', label: 'Offer Received', icon: '🏆', color: '#10b981' },
  ]

  const loadSaved = () => {
    fetch('/api/user/export')
      .then((r) => r.json())
      .then((data) => {
        if (data.savedOpportunities) {
          // Normalize status
          const normalized = data.savedOpportunities.map((item: any) => ({
            ...item,
            status: item.status === 'offered' ? 'offer' : item.status || 'saved',
          }))
          setItems(normalized)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSaved()
  }, [])

  const handleStatusChange = async (opportunityId: string, newStatus: string) => {
    const updatedStatus = newStatus === 'offered' ? 'offer' : newStatus
    setItems((prev) =>
      prev.map((item) =>
        item.opportunity_id === opportunityId ? { ...item, status: updatedStatus } : item
      )
    )

    try {
      await fetch(`/api/opportunities/${opportunityId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveNote = async (opportunityId: string) => {
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteContent }),
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.opportunity_id === opportunityId ? { ...item, note: noteContent } : item
          )
        )
        setEditingNoteId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (opportunityId: string) => {
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/save`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.opportunity_id !== opportunityId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Summary Metrics
  const totalCount = items.length
  const interviewingCount = items.filter((i) => i.status === 'interviewing').length
  const offersCount = items.filter((i) => i.status === 'offer' || i.status === 'offered').length
  const appliedCount = items.filter((i) => i.status === 'applied').length

  const filtered = activeTab === 'all' ? items : items.filter((item) => item.status === activeTab)

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-indigo)', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Sparkles size={14} /> Application Pipeline Command Center
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            Visual Application Kanban
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.35rem' }}>
            Track each opportunity through your personal conversion funnel with 1-click stage progression.
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem',
            gap: '0.25rem',
          }}
        >
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.45rem 0.875rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: viewMode === 'kanban' ? 700 : 500,
              background: viewMode === 'kanban' ? 'var(--accent-indigo)' : 'transparent',
              color: viewMode === 'kanban' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Columns size={15} />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.45rem 0.875rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: viewMode === 'list' ? 700 : 500,
              background: viewMode === 'list' ? 'var(--accent-indigo)' : 'transparent',
              color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <List size={15} />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total in Pipeline
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {totalCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Under Review
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
            {appliedCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Interviews
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.25rem' }}>
            {interviewingCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Offers Received
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', marginTop: '0.25rem' }}>
            {offersCount}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Syncing your pipeline...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1.5rem', borderRadius: 'var(--radius-xl)' }}>
          <Bookmark size={40} color="var(--accent-indigo)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Your Application Pipeline is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Explore opportunities and bookmark them to organize your job & hackathon search with zero chaos.
          </p>
          <Link href="/opportunities" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Discover Opportunities</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            alignItems: 'start',
            overflowX: 'auto',
            paddingBottom: '1rem',
          }}
        >
          {KANBAN_COLUMNS.map((col, colIdx) => {
            const columnItems = items.filter((item) => {
              if (col.key === 'offer') return item.status === 'offer' || item.status === 'offered'
              return item.status === col.key
            })

            return (
              <div
                key={col.key}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '80vh',
                  minHeight: '400px',
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    padding: '0.875rem 1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: `3px solid ${col.color}`,
                    borderTopLeftRadius: 'var(--radius-lg)',
                    borderTopRightRadius: 'var(--radius-lg)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{col.icon}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {col.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {columnItems.length}
                  </span>
                </div>

                {/* Cards List in Column */}
                <div
                  style={{
                    padding: '0.875rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.875rem',
                    overflowY: 'auto',
                    flex: 1,
                  }}
                >
                  {columnItems.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      No opportunities here
                    </div>
                  ) : (
                    columnItems.map((item) => {
                      const opp = item.opportunities || {}
                      const nextCol = KANBAN_COLUMNS[colIdx + 1]

                      return (
                        <div
                          key={item.id}
                          className="glass-panel"
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.625rem',
                            background: 'var(--bg-glass)',
                          }}
                        >
                          {/* Card Category & Delete */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className={`badge ${getCategoryBadgeClass(opp.category)}`} style={{ fontSize: '0.6875rem' }}>
                              {opp.category || 'General'}
                            </span>
                            <button
                              onClick={() => handleDelete(item.opportunity_id)}
                              title="Remove from pipeline"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '0.2rem',
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Title & Organization */}
                          <div>
                            <Link
                              href={`/opportunities/${item.opportunity_id}`}
                              style={{
                                fontSize: '0.9375rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                textDecoration: 'none',
                                display: 'block',
                                lineHeight: 1.35,
                              }}
                            >
                              {opp.title || 'Untitled Opportunity'}
                            </Link>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                              {opp.organization}
                            </div>
                          </div>

                          {/* Deadline / Location */}
                          {opp.deadline && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              <Clock size={12} />
                              <span>{formatDeadline(opp.deadline).formattedDate}</span>
                            </div>
                          )}

                          {/* Private Note */}
                          {item.note && (
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                background: 'rgba(255, 255, 255, 0.03)',
                                padding: '0.35rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                borderLeft: '2px solid var(--accent-indigo)',
                              }}
                            >
                              {item.note}
                            </div>
                          )}

                          {/* Actions: Move Stage & Calendar */}
                          <div
                            style={{
                              borderTop: '1px solid var(--border-subtle)',
                              paddingTop: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.375rem',
                            }}
                          >
                            <CalendarSyncButton
                              compact
                              event={{
                                title: opp.title || 'Opportunity',
                                deadline: opp.deadline,
                                url: opp.application_url,
                              }}
                            />

                            {/* View & Download Official Application Slip */}
                            {item.status === 'applied' && (
                              <button
                                onClick={() => {
                                  let noteData: any = {}
                                  try { noteData = JSON.parse(item.note) } catch {}
                                  setSelectedSlip({
                                    applicationId: noteData.applicationId || `SKL-2026-${item.id.slice(0, 6).toUpperCase()}`,
                                    applicantName: noteData.applicantName || 'Applicant',
                                    applicantEmail: noteData.applicantEmail || 'applicant@skillora.internal',
                                    applicantPhone: noteData.applicantPhone || '+91 98765 43210',
                                    college: noteData.college || 'Engineering Institution',
                                    degree: noteData.degree || 'B.Tech / STEM',
                                    yearOfStudy: noteData.yearOfStudy || '3rd Year',
                                    portfolioUrl: noteData.portfolioUrl,
                                    appliedAt: noteData.appliedAt || item.updated_at || new Date().toISOString(),
                                    opportunity: opp,
                                  })
                                }}
                                className="btn btn-secondary"
                                style={{
                                  padding: '0.3rem 0.55rem',
                                  fontSize: '0.72rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                                title="View & Download Official Application Slip (PDF)"
                              >
                                <FileText size={12} color="var(--accent-indigo)" />
                                <span>Slip PDF</span>
                              </button>
                            )}

                            {nextCol && (
                              <button
                                onClick={() => handleStatusChange(item.opportunity_id, nextCol.key)}
                                className="btn btn-secondary"
                                style={{
                                  padding: '0.3rem 0.6rem',
                                  fontSize: '0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                                title={`Move to ${nextCol.label}`}
                              >
                                <span>Advance</span>
                                <ChevronRight size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((item) => {
            const opp = item.opportunities || {}
            return (
              <div
                key={item.id}
                className="glass-panel"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      <span className={`badge ${getCategoryBadgeClass(opp?.category)}`}>{opp?.category || 'Opportunity'}</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Saved on {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                      <Link href={`/opportunities/${item.opportunity_id}`}>{opp?.title || 'Opportunity'}</Link>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{opp?.organization}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.opportunity_id, e.target.value)}
                      className="form-select"
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    >
                      <option value="saved">Status: Saved</option>
                      <option value="applying">Status: In Progress</option>
                      <option value="applied">Status: Applied</option>
                      <option value="interviewing">Status: Interviewing</option>
                      <option value="offer">Status: Offer</option>
                      <option value="rejected">Status: Rejected</option>
                    </select>

                    <CalendarSyncButton
                      compact
                      event={{
                        title: opp.title,
                        deadline: opp.deadline,
                        url: opp.application_url,
                      }}
                    />

                    <Link href={`/opportunities/${item.opportunity_id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}>
                      <span>View</span>
                      <ExternalLink size={13} />
                    </Link>

                    <button onClick={() => handleDelete(item.opportunity_id)} title="Remove" className="btn btn-outline" style={{ padding: '0.4rem 0.625rem', color: 'var(--text-muted)' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Private Notes Section */}
                <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  {editingNoteId === item.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Add a private note..."
                        className="form-input"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                        autoFocus
                      />
                      <button onClick={() => handleSaveNote(item.opportunity_id)} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}>
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingNoteId(null)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: item.note ? 'var(--text-secondary)' : 'var(--text-muted)', fontStyle: item.note ? 'normal' : 'italic' }}>
                        {item.note ? `Note: ${item.note}` : 'No notes added yet'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingNoteId(item.id)
                          setNoteContent(item.note || '')
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-indigo)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Edit3 size={12} />
                        <span>{item.note ? 'Edit Note' : 'Add Note'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Official Application & Registration Slip Modal */}
      <ApplicationSlipModal
        isOpen={Boolean(selectedSlip)}
        onClose={() => setSelectedSlip(null)}
        data={selectedSlip}
      />
    </div>
  )
}
