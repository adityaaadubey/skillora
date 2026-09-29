'use client'

import React, { useState } from 'react'
import {
  X,
  PlusCircle,
  Building2,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Mail,
  CheckCircle,
  Loader2,
  ShieldCheck,
  Globe,
  MapPin,
  Sparkles,
} from 'lucide-react'

interface PostOpportunityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function PostOpportunityModal({
  isOpen,
  onClose,
  onSuccess,
}: PostOpportunityModalProps) {
  const [title, setTitle] = useState('')
  const [organization, setOrganization] = useState('')
  const [category, setCategory] = useState<'internship' | 'hackathon' | 'fellowship' | 'scholarship' | 'competition'>('hackathon')
  const [mode, setMode] = useState<'remote' | 'hybrid' | 'on-site'>('remote')
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState('36 hours')
  const [description, setDescription] = useState('')
  const [eligibilityText, setEligibilityText] = useState('Open to all university students')
  const [stipendMax, setStipendMax] = useState('')
  const [prizePoolMax, setPrizePoolMax] = useState('50000')
  const [deadline, setDeadline] = useState('')
  const [skills, setSkills] = useState('React, Python, TypeScript')
  const [applicationUrl, setApplicationUrl] = useState('')
  const [organizerEmail, setOrganizerEmail] = useState('')
  const [directApplyEnabled, setDirectApplyEnabled] = useState(true)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        title,
        organization,
        category,
        mode,
        location: location || (mode === 'remote' ? 'Remote / Global' : 'India'),
        duration,
        description,
        eligibility_text: eligibilityText,
        stipend_max: stipendMax ? parseFloat(stipendMax) : null,
        prize_pool_max: prizePoolMax ? parseFloat(prizePoolMax) : null,
        deadline: deadline ? new Date(deadline).toISOString() : new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        skills: skillsArray,
        application_url: applicationUrl || 'https://skillora.in',
        organizer_email: organizerEmail,
        direct_apply_enabled: directApplyEnabled,
      }

      const res = await fetch('/api/opportunities/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to list opportunity.')
      }

      setSubmitted(true)
      onSuccess?.()
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while posting.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setTitle('')
    setOrganization('')
    setDescription('')
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 35px rgba(99, 102, 241, 0.25)',
          background: 'var(--bg-glass)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <CheckCircle size={42} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Opportunity Published Directly on Skillora!
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              Your listing for <strong style={{ color: 'var(--text-primary)' }}>{title}</strong> is now live on the Skillora network. Students can apply directly in-app with 1-click.
            </p>

            <button onClick={handleReset} className="btn btn-primary" style={{ padding: '0.75rem 2.25rem' }}>
              Done & Return to Homepage
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--accent-indigo)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                <Sparkles size={12} />
                <span>Host / List Directly on Skillora</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                Post an Opportunity or Hackathon
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Organize an event, hiring challenge, or internship. Students can register directly without external links.
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Opportunity / Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Innovation Sprint 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Organization / College Club / Startup *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Developer Group / IIT Club"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="input"
                    style={{ width: '100%' }}
                  >
                    <option value="hackathon">Hackathon</option>
                    <option value="internship">Internship</option>
                    <option value="fellowship">Fellowship</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="competition">Competition</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Mode *
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="input"
                    style={{ width: '100%' }}
                  >
                    <option value="remote">Remote / Virtual</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site Campus</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 36 hours / 3 months"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Prize Pool or Stipend (₹ INR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={category === 'internship' ? stipendMax : prizePoolMax}
                    onChange={(e) => {
                      if (category === 'internship') setStipendMax(e.target.value)
                      else setPrizePoolMax(e.target.value)
                    }}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Host Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="organizer@university.edu"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                  Target Tech Stack & Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Next.js, Python, PyTorch, Figma"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                  Description, Themes & Guidelines *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the opportunity, theme tracks, perks, evaluation criteria, and guidelines for students..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              {/* Direct Apply Switch */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                <input
                  type="checkbox"
                  id="direct-apply-check"
                  checked={directApplyEnabled}
                  onChange={(e) => setDirectApplyEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
                />
                <label htmlFor="direct-apply-check" style={{ fontSize: '0.875rem', cursor: 'pointer', flex: 1 }}>
                  <strong>Enable Skillora 1-Click In-App Applications:</strong> Students apply directly without being redirected to other platforms.
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={submitting}
                  style={{ padding: '0.625rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '0.625rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      <span>Publish Opportunity Directly</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
