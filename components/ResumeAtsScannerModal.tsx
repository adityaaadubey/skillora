'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  TrendingUp,
  BrainCircuit,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
} from 'lucide-react'

interface ResumeAtsScannerModalProps {
  isOpen: boolean
  onClose: () => void
  opportunity: {
    id: string
    title: string
    organization: string
    category: string
    skills?: string[]
    description?: string
    eligibility_text?: string
    mode?: string
  } | null
  onApplyWithPitch?: (pitch: string) => void
}

interface ScanResult {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  actionVerbsCount: number
  metricsCount: number
  recommendations: string[]
  tailoredPitch: string
}

const ACTION_VERBS = [
  'built', 'developed', 'architected', 'engineered', 'led', 'designed', 'deployed',
  'optimized', 'implemented', 'scaled', 'automated', 'integrated', 'refactored',
  'managed', 'created', 'analyzed', 'spearheaded', 'orchestrated', 'mentored'
]

export function ResumeAtsScannerModal({
  isOpen,
  onClose,
  opportunity,
  onApplyWithPitch,
}: ResumeAtsScannerModalProps) {
  const [resumeText, setResumeText] = useState('')
  const [profileData, setProfileData] = useState<any>(null)
  const [usingProfile, setUsingProfile] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [copiedPitch, setCopiedPitch] = useState(false)

  // Fetch student profile on mount
  useEffect(() => {
    if (!isOpen) return
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setProfileData(data.profile)
          // Default synthetic resume text from profile if empty
          if (!resumeText) {
            const p = data.profile
            const synthesized = [
              `Name: ${p.full_name || 'Candidate'}`,
              `College: ${p.college || 'Engineering'} | Degree: ${p.degree || 'B.Tech'} (${p.graduation_year || 2026})`,
              `Bio: ${p.bio || ''}`,
              `Skills & Tech Stack: ${(p.career_interests || []).join(', ')}`,
              `Focus Domains: ${(p.preferred_categories || []).join(', ')}`,
            ].filter(Boolean).join('\n')
            setResumeText(synthesized)
          }
        }
      })
      .catch(() => {})
  }, [isOpen])

  if (!isOpen || !opportunity) return null

  const handleScan = () => {
    setIsScanning(true)

    setTimeout(() => {
      const oppSkills: string[] = opportunity.skills || []
      const textToScan = resumeText.toLowerCase()

      // 1. Skill Matching
      const matched: string[] = []
      const missing: string[] = []

      oppSkills.forEach((skill) => {
        const clean = skill.trim().toLowerCase()
        if (textToScan.includes(clean)) {
          matched.push(skill)
        } else {
          missing.push(skill)
        }
      })

      // 2. Action Verbs Detection
      let verbsCount = 0
      ACTION_VERBS.forEach((verb) => {
        const regex = new RegExp(`\\b${verb}\\b`, 'gi')
        const matches = textToScan.match(regex)
        if (matches) verbsCount += matches.length
      })

      // 3. Metric / Impact Detection (numbers, %, $, x speedup, etc.)
      const metricMatches = textToScan.match(/(\d+%\b|\$\d+|\d+x\b|\b\d+\s+(users|clients|projects|ms|seconds|stars))/gi) || []
      const metricsCount = metricMatches.length

      // 4. Score Calculation (0 - 100)
      let calculatedScore = 50
      if (oppSkills.length > 0) {
        const matchRatio = matched.length / oppSkills.length
        calculatedScore = Math.round(matchRatio * 60) // Up to 60 pts from skills
      } else {
        calculatedScore = 65
      }

      // Action verbs bonus (up to 20 pts)
      calculatedScore += Math.min(20, verbsCount * 4)

      // Metrics / quantifiable impact bonus (up to 20 pts)
      calculatedScore += Math.min(20, metricsCount * 5)

      calculatedScore = Math.min(98, Math.max(25, calculatedScore))

      // 5. Recommendations
      const recommendations: string[] = []
      if (missing.length > 0) {
        recommendations.push(`Add missing keywords: ${missing.slice(0, 3).join(', ')} to pass ATS filtering.`)
      }
      if (metricsCount < 2) {
        recommendations.push('Include quantifiable metrics (e.g., "improved latency by 35%", "500+ active users").')
      }
      if (verbsCount < 3) {
        recommendations.push('Strengthen bullet points using powerful action verbs like "architected", "deployed", "scaled".')
      }
      if (recommendations.length === 0) {
        recommendations.push('Excellent alignment! Your profile demonstrates strong technical depth and impact.')
      }

      // 6. Tailored Pitch Generation
      const topSkills = matched.length > 0 ? matched.slice(0, 3).join(', ') : 'software engineering and modern tech stacks'
      const orgName = opportunity.organization || 'your team'
      const roleTitle = opportunity.title || 'this role'

      const tailoredPitch = `Hi ${orgName} team, I am eager to apply for ${roleTitle}. With hands-on proficiency in ${topSkills}, I have engineered scalable solutions with high technical rigor. I am confident in creating immediate impact and collaborating seamlessly with your engineers.`

      setResult({
        score: calculatedScore,
        matchedSkills: matched,
        missingSkills: missing,
        actionVerbsCount: verbsCount,
        metricsCount,
        recommendations,
        tailoredPitch,
      })

      setIsScanning(false)
    }, 600)
  }

  const handleCopyPitch = () => {
    if (!result?.tailoredPitch) return
    navigator.clipboard.writeText(result.tailoredPitch)
    setCopiedPitch(true)
    setTimeout(() => setCopiedPitch(false), 2000)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(5, 7, 13, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          position: 'relative',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          aria-label="Close scanner"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <BrainCircuit size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              AI Resume & ATS Match Scanner
            </h2>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Scan against <strong style={{ color: 'var(--text-primary)' }}>{opportunity.title}</strong> at {opportunity.organization}
            </p>
          </div>
        </div>

        {/* Input Mode / Resume Textarea */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Resume Text / Profile Skills
            </label>
            {profileData && (
              <button
                type="button"
                onClick={() => {
                  const p = profileData
                  const synthesized = [
                    `Name: ${p.full_name || 'Candidate'}`,
                    `College: ${p.college || 'Engineering'} | Degree: ${p.degree || 'B.Tech'} (${p.graduation_year || 2026})`,
                    `Bio: ${p.bio || ''}`,
                    `Skills & Tech Stack: ${(p.career_interests || []).join(', ')}`,
                    `Focus Domains: ${(p.preferred_categories || []).join(', ')}`,
                  ].filter(Boolean).join('\n')
                  setResumeText(synthesized)
                }}
                style={{
                  background: 'transparent',
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
                <RefreshCw size={12} /> Auto-fill from Profile
              </button>
            )}
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={5}
            placeholder="Paste your resume experience, project bullet points, or skills list here..."
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />

          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleScan}
              disabled={isScanning || !resumeText.trim()}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                fontSize: '0.875rem',
              }}
            >
              {isScanning ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Scanning Keywords...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run ATS Diagnosis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scan Results View */}
        {result && (
          <div
            style={{
              animation: 'fadeIn 0.3s ease-in-out',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.25rem',
            }}
          >
            {/* Score & Gauge */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  background: 'var(--bg-surface)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  ATS Match Score
                </div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color:
                      result.score >= 75
                        ? '#10b981'
                        : result.score >= 50
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                >
                  {result.score}%
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {result.score >= 75 ? '🔥 High Match' : result.score >= 50 ? '⚡ Good Potential' : '⚠️ Needs Tuning'}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Action Verbs
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>
                  {result.actionVerbsCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Power words used
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Impact Metrics
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {result.metricsCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Quantified results
                </div>
              </div>
            </div>

            {/* Keyword Pills */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Matched Skills ({result.matchedSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                {result.matchedSkills.length > 0 ? (
                  result.matchedSkills.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#6ee7b7',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <CheckCircle2 size={12} /> {s}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No exact skill matches detected in text.</span>
                )}
              </div>

              {result.missingSkills.length > 0 && (
                <>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#f87171' }}>
                    Missing Critical Keywords ({result.missingSkills.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {result.missingSkills.map((s) => (
                      <span
                        key={s}
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: '#fca5a5',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <AlertTriangle size={12} /> {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Recommendations */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.875rem 1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                💡 Actionable Recommendations
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {result.recommendations.map((rec, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Tailored Pitch */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08))',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>
                  <Sparkles size={16} /> 1-Click Tailored Pitch Note
                </div>
                <button
                  onClick={handleCopyPitch}
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  {copiedPitch ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedPitch ? 'Copied!' : 'Copy Pitch'}</span>
                </button>
              </div>

              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{result.tailoredPitch}"
              </p>

              {onApplyWithPitch && (
                <div style={{ marginTop: '0.875rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      onApplyWithPitch(result.tailoredPitch)
                      onClose()
                    }}
                    className="btn btn-primary"
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <Zap size={14} /> Use This Pitch in Direct Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
