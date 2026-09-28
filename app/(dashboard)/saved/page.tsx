'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, ExternalLink, Trash2, Edit3, Check, Loader2, ArrowRight } from 'lucide-react'

export default function SavedPipelinePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [noteContent, setNoteContent] = useState('')

  const statuses = [
    { label: 'All', value: 'all' },
    { label: 'Saved', value: 'saved' },
    { label: 'Applied', value: 'applied' },
    { label: 'Interviewing', value: 'interviewing' },
    { label: 'Offer', value: 'offer' },
    { label: 'Rejected', value: 'rejected' },
  ]

  const loadSaved = () => {
    fetch('/api/user/export')
      .then((r) => r.json())
      .then((data) => {
        if (data.savedOpportunities) {
          setItems(data.savedOpportunities)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSaved()
  }, [])

  const handleStatusChange = async (opportunityId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.opportunity_id === opportunityId ? { ...item, status: newStatus } : item
          )
        )
      }
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

  const filtered = activeTab === 'all' ? items : items.filter((item) => item.status === activeTab)

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Application Pipeline Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Organize your saved opportunities, update submission stages, and track private notes.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        marginBottom: '2rem',
        paddingBottom: '0.5rem',
      }}>
        {statuses.map((s) => {
          const isSelected = activeTab === s.value
          const count = s.value === 'all' ? items.length : items.filter((i) => i.status === s.value).length
          return (
            <button
              key={s.value}
              onClick={() => setActiveTab(s.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: isSelected ? 700 : 500,
                background: isSelected ? 'var(--accent-indigo)' : 'var(--bg-surface)',
                border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{s.label}</span>
              <span style={{
                fontSize: '0.75rem',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-elevated)',
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading your saved opportunities...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Bookmark size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No opportunities in this stage
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
            Bookmark programs from the discovery page to track them in your personal application pipeline.
          </p>
          <Link href="/opportunities" className="btn btn-primary">
            <span>Explore Opportunities</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((item) => {
            const opp = item.opportunities
            return (
              <div
                key={item.id}
                className="glass-panel"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      <span className="badge badge-indigo">{opp?.category || 'Opportunity'}</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Saved on {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                      <Link href={`/opportunities/${item.opportunity_id}`}>
                        {opp?.title || 'Opportunity'}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {opp?.organization}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Status Dropdown */}
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.opportunity_id, e.target.value)}
                      className="form-select"
                      style={{
                        width: 'auto',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    >
                      <option value="saved">Status: Saved</option>
                      <option value="applied">Status: Applied</option>
                      <option value="interviewing">Status: Interviewing</option>
                      <option value="offer">Status: Offer</option>
                      <option value="rejected">Status: Rejected</option>
                      <option value="archived">Status: Archived</option>
                    </select>

                    <Link
                      href={`/opportunities/${item.opportunity_id}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                    >
                      <span>View</span>
                      <ExternalLink size={13} />
                    </Link>

                    <button
                      onClick={() => handleDelete(item.opportunity_id)}
                      title="Remove from pipeline"
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.625rem', color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Private Notes Section */}
                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  {editingNoteId === item.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Add a private note (e.g. Applied with resume v2, referral from Alex)..."
                        className="form-input"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveNote(item.opportunity_id)}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                      >
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
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-indigo)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
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
    </div>
  )
}
