'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Opportunity } from '../lib/database.types'
import { Bookmark, Clock, MapPin, DollarSign, Award, ExternalLink, CheckCircle, Sparkles } from 'lucide-react'

interface OpportunityCardProps {
  opportunity: Opportunity
  initialSaved?: boolean
  matchScore?: number
  matchReasons?: string[]
  onSaveToggle?: (id: string, isSaved: boolean) => void
}

export function OpportunityCard({
  opportunity,
  initialSaved = false,
  matchScore,
  matchReasons,
  onSaveToggle,
}: OpportunityCardProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [saving, setSaving] = useState(false)

  // Compute deadline urgency
  let deadlineText = 'Rolling'
  let urgencyLevel: 'normal' | 'soon' | 'expired' = 'normal'

  if (opportunity.deadline) {
    const deadlineDate = new Date(opportunity.deadline)
    const diffDays = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      deadlineText = 'Expired'
      urgencyLevel = 'expired'
    } else if (diffDays === 0) {
      deadlineText = 'Ends Today!'
      urgencyLevel = 'soon'
    } else if (diffDays <= 7) {
      deadlineText = `${diffDays}d left`
      urgencyLevel = 'soon'
    } else {
      deadlineText = deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSaving(true)
    const nextState = !saved
    setSaved(nextState)

    try {
      const res = await fetch(`/api/opportunities/${opportunity.id}/save`, {
        method: nextState ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        setSaved(!nextState) // revert
      } else {
        onSaveToggle?.(opportunity.id, nextState)
      }
    } catch {
      setSaved(!nextState)
    } finally {
      setSaving(false)
    }
  }

  const categoryColor = () => {
    switch (opportunity.category) {
      case 'internship': return 'badge-indigo'
      case 'hackathon': return 'badge-amber'
      case 'scholarship': return 'badge-emerald'
      case 'fellowship': return 'badge-cyan'
      default: return 'badge-indigo'
    }
  }

  return (
    <div className="glass-panel glass-panel-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Bar: Category, Verified, Save Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className={`badge ${categoryColor()}`}>
            {opportunity.category}
          </span>
          {opportunity.is_verified && (
            <span className="badge badge-emerald" title="Verified by Skillora">
              <CheckCircle size={12} /> Verified
            </span>
          )}
          {opportunity.is_featured && (
            <span className="badge badge-amber">
              Featured
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          aria-label={saved ? 'Remove bookmark' : 'Save opportunity'}
          title={saved ? 'Saved' : 'Save'}
          style={{
            background: saved ? 'var(--accent-indigo-subtle)' : 'transparent',
            border: '1px solid ' + (saved ? 'var(--accent-indigo)' : 'var(--border-subtle)'),
            color: saved ? 'var(--accent-indigo)' : 'var(--text-muted)',
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Main Info */}
      <div style={{ flex: 1, marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.35,
          marginBottom: '0.375rem',
        }}>
          <Link href={`/opportunities/${opportunity.id}`} style={{ transition: 'color 0.2s' }}>
            {opportunity.title}
          </Link>
        </h3>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          {opportunity.organization}
        </p>

        {/* Match Score & Reasons Pill */}
        {typeof matchScore === 'number' && matchScore > 0 && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.2rem 0.5rem',
            background: matchScore >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            border: `1px solid ${matchScore >= 75 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: matchScore >= 75 ? '#6ee7b7' : '#a5b4fc',
            marginBottom: '0.75rem',
          }}>
            <Sparkles size={13} />
            <span>{matchScore}% Match</span>
            {matchReasons && matchReasons.length > 0 && (
              <span style={{ fontWeight: 400, opacity: 0.85 }}>• {matchReasons[0]}</span>
            )}
          </div>
        )}

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {opportunity.description}
        </p>
      </div>

      {/* Meta tags: mode, location, stipend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        marginBottom: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <MapPin size={14} color="var(--text-muted)" />
          <span>{opportunity.mode === 'remote' ? 'Remote' : opportunity.location || 'Flexible'}</span>
        </div>

        {opportunity.stipend_max ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#6ee7b7' }}>
            <DollarSign size={14} />
            <span>
              {opportunity.currency || '₹'} {opportunity.stipend_min ? `${opportunity.stipend_min.toLocaleString()} - ` : ''}
              {opportunity.stipend_max.toLocaleString()}
            </span>
          </div>
        ) : opportunity.prize_pool_max ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#fcd34d' }}>
            <Award size={14} />
            <span>Prize {opportunity.currency || '₹'} {opportunity.prize_pool_max.toLocaleString()}</span>
          </div>
        ) : null}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          marginLeft: 'auto',
          color: urgencyLevel === 'soon' ? '#f87171' : 'var(--text-secondary)',
          fontWeight: urgencyLevel === 'soon' ? 700 : 500,
        }}>
          <Clock size={14} />
          <span>{deadlineText}</span>
        </div>
      </div>

      {/* Footer Skills & View Link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', maxWidth: '70%' }}>
          {(opportunity.skills || []).slice(0, 3).map((s) => (
            <span
              key={s}
              style={{
                fontSize: '0.7rem',
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-secondary)',
              }}
            >
              {s}
            </span>
          ))}
          {(opportunity.skills || []).length > 3 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              +{opportunity.skills!.length - 3}
            </span>
          )}
        </div>

        <Link
          href={`/opportunities/${opportunity.id}`}
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
        >
          <span>View</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  )
}
