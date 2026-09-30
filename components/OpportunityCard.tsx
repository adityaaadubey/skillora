'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Opportunity } from '../lib/database.types'
import { formatDeadline, getCategoryBadgeClass, formatCompensation, getSanitizedWorkingUrl } from '../lib/utils'
import { DirectApplyModal } from './DirectApplyModal'
import { CalendarSyncButton } from './CalendarSyncButton'
import { Bookmark, Clock, MapPin, ExternalLink, CheckCircle, Sparkles, Zap, Flame } from 'lucide-react'

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
  const [showDirectModal, setShowDirectModal] = useState(false)

  const deadline = formatDeadline(opportunity.deadline)
  const compensation = formatCompensation(opportunity)
  const safeUrl = getSanitizedWorkingUrl(opportunity.application_url, opportunity.organization, opportunity.title)

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
        setSaved(!nextState)
      } else {
        onSaveToggle?.(opportunity.id, nextState)
      }
    } catch {
      setSaved(!nextState)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div
        className="glass-panel glass-panel-hover"
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1.35rem',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Badges & Save Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <span className={`badge ${getCategoryBadgeClass(opportunity.category)}`}>
              {opportunity.category}
            </span>

            {/* Direct In-App Application Badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-indigo)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
              title="Apply directly within Skillora with zero redirection"
            >
              <Zap size={11} />
              <span>Direct Apply</span>
            </span>

            {opportunity.is_verified && (
              <span className="badge badge-emerald" title="Verified by Skillora">
                <CheckCircle size={11} />
                <span>Verified</span>
              </span>
            )}

            {opportunity.mode && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  textTransform: 'capitalize',
                }}
              >
                {opportunity.mode}
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
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title & Organization */}
        <div style={{ marginBottom: '0.75rem', flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.35rem' }}>
            <Link
              href={`/opportunities/${opportunity.id}`}
              style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
              className="hover:text-indigo-400"
            >
              {opportunity.title}
            </Link>
          </h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {opportunity.organization}
          </div>
        </div>

        {/* Explainable Match Pill if present */}
        {matchScore !== undefined && matchScore > 0 && (
          <div
            style={{
              padding: '0.4rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              marginBottom: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-indigo)', fontWeight: 700 }}>
              <Sparkles size={13} />
              <span>{matchScore}% Profile Fit</span>
            </div>
            {matchReasons && matchReasons.length > 0 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                {matchReasons[0]}
              </span>
            )}
          </div>
        )}

        {/* Meta Bar: Location, Compensation, Deadline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            marginBottom: '0.875rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} color="var(--text-muted)" />
            <span style={{ maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {opportunity.location || (opportunity.mode === 'remote' ? 'Remote' : 'India')}
            </span>
          </div>

          <div style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
            {compensation.label}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: deadline.urgency === 'soon' ? '#f59e0b' : 'var(--text-muted)',
              fontWeight: deadline.urgency === 'soon' ? 700 : 500,
            }}
          >
            {deadline.urgency === 'soon' ? <Flame size={13} color="#f59e0b" /> : <Clock size={13} />}
            <span>{deadline.text}</span>
          </div>
        </div>

        {/* Skills & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: '50%' }}>
            {(opportunity.skills || []).slice(0, 2).map((s) => (
              <span
                key={s}
                style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)',
                }}
              >
                {s}
              </span>
            ))}
            {(opportunity.skills || []).length > 2 && (
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                +{opportunity.skills!.length - 2}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            {/* 1-Click Calendar Sync */}
            <CalendarSyncButton
              compact
              event={{
                title: opportunity.title,
                description: opportunity.description,
                deadline: opportunity.deadline,
                location: opportunity.mode === 'remote' ? 'Remote' : opportunity.location,
                url: safeUrl,
              }}
            />

            {/* 1-Click In-App Direct Apply */}
            <button
              onClick={() => setShowDirectModal(true)}
              className="btn btn-primary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                gap: '0.25rem',
                borderRadius: 'var(--radius-md)',
              }}
              title="Instant Direct Apply on Skillora (No redirection)"
            >
              <Zap size={12} />
              <span>Apply</span>
            </button>

            {/* View Details */}
            <Link
              href={`/opportunities/${opportunity.id}`}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
            >
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* In-App Direct Apply Modal */}
      <DirectApplyModal
        opportunity={opportunity}
        isOpen={showDirectModal}
        onClose={() => setShowDirectModal(false)}
      />
    </>
  )
}
