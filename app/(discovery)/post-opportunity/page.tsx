'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  PlusCircle,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  DollarSign,
  Globe,
  Tag,
  FileText,
  Mail,
  Zap,
} from 'lucide-react'

export default function PostOpportunityPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [organization, setOrganization] = useState('')
  const [category, setCategory] = useState<'internship' | 'hackathon' | 'fellowship' | 'scholarship' | 'competition'>('hackathon')
  const [mode, setMode] = useState<'remote' | 'hybrid' | 'on-site'>('remote')
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState('36 hours')
  const [description, setDescription] = useState('')
  const [eligibilityText, setEligibilityText] = useState('Open to all engineering & computer science students')
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
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while publishing.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            marginBottom: '1.75rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Homepage</span>
        </Link>

        {submitted ? (
          <div
            className="glass-panel"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)',
            }}
          >
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
              <CheckCircle2 size={42} />
            </div>

            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Opportunity Published Directly on Skillora!
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 2rem' }}>
              Your opportunity <strong style={{ color: 'var(--text-primary)' }}>{title}</strong> is now live across the network. Candidates can apply in 1 click directly through Skillora.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/opportunities" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Browse Live Directory
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 2rem' }}
              >
                Post Another
              </button>
            </div>
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--accent-indigo)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                <Zap size={14} />
                <span>Zero Redirection Host Network</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                Post an Opportunity on Skillora
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                List your hackathon, engineering internship, fellowship, or coding contest. Ambitious talent can register directly on Skillora with verified matching.
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.875rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Opportunity / Program Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next-Gen AI Hackathon 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Organization / College / Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Developer Student Club"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Category Track *
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
                    <option value="competition">Competition / Contest</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Execution Mode *
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
                    Duration / Format
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 48 hours / 3 months"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Prize Pool or Monthly Stipend (₹ INR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 100000"
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
                    Application Deadline
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
                    placeholder="organizer@community.org"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                  Target Skills & Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Python, PyTorch, Node.js, AI, Open Source"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  placeholder="e.g. Open to all college students graduating in 2025-2028"
                  value={eligibilityText}
                  onChange={(e) => setEligibilityText(e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                  Detailed Description & Evaluation Rules *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the challenge, problem statement, tracks, prizes, judging criteria, and requirements..."
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
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                <input
                  type="checkbox"
                  id="direct-apply-check-page"
                  checked={directApplyEnabled}
                  onChange={(e) => setDirectApplyEnabled(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
                />
                <label htmlFor="direct-apply-check-page" style={{ fontSize: '0.875rem', cursor: 'pointer', flex: 1 }}>
                  <strong>Enable 1-Click Skillora Direct Application:</strong> Candidates register directly without leaving Skillora. Submissions are saved securely.
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Link href="/" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 2.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
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
