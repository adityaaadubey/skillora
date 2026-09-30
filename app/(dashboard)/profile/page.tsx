'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Check,
  Loader2,
  Plus,
  X,
  GraduationCap,
  Code,
  Briefcase,
  Globe,
  FileText,
  Sparkles,
  Camera,
  User,
  ShieldCheck,
} from 'lucide-react'
import { ProfileScoreboard } from '../../../components/ProfileScoreboard'
import { AvatarPickerModal } from '../../../components/AvatarPickerModal'
import { calculateScoreboard, AVATAR_PRESETS } from '../../../lib/gamification'

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  // Profile Form State
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('⚡')
  const [bio, setBio] = useState('')
  const [college, setCollege] = useState('')
  const [degree, setDegree] = useState('')
  const [branch, setBranch] = useState('')
  const [graduationYear, setGraduationYear] = useState<number | ''>('')
  const [currentYear, setCurrentYear] = useState<number | ''>('')
  const [cgpa, setCgpa] = useState<number | ''>('')
  const [location, setLocation] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [resumeReference, setResumeReference] = useState('')
  const [preferredCategories, setPreferredCategories] = useState<string[]>([])
  const [preferredModes, setPreferredModes] = useState<string[]>([])
  const [profileCompletionPct, setProfileCompletionPct] = useState(0)

  // Gamification Stats
  const [appliedCount, setAppliedCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)

  // Skills Taxonomy State
  const [skills, setSkills] = useState<{ name: string; level: string }[]>([])
  const [newSkillInput, setNewSkillInput] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState('intermediate')
  const [availableTaxonomy, setAvailableTaxonomy] = useState<string[]>([])

  const categoryOptions = ['internship', 'hackathon', 'scholarship', 'fellowship', 'research', 'competition']
  const modeOptions = ['remote', 'hybrid', 'offline']

  const loadProfileData = useCallback(async () => {
    try {
      const [profRes, skillsRes, exportRes] = await Promise.all([
        fetch('/api/user/profile').then((r) => r.json()),
        fetch('/api/user/skills').then((r) => r.json()),
        fetch('/api/user/export').then((r) => r.json()),
      ])

      if (profRes.profile) {
        const p = profRes.profile
        setFullName(p.full_name || '')
        setAvatarUrl(p.avatar_url || '⚡')
        setBio(p.bio || '')
        setCollege(p.college || '')
        setDegree(p.degree || '')
        setBranch(p.branch || '')
        setGraduationYear(p.graduation_year || '')
        setCurrentYear(p.current_year || '')
        setCgpa(p.cgpa || '')
        setLocation(p.location || '')
        setLinkedinUrl(p.linkedin_url || '')
        setGithubUrl(p.github_url || '')
        setPortfolioUrl(p.portfolio_url || '')
        setResumeReference(p.resume_reference || '')
        setPreferredCategories(p.preferred_categories || [])
        setPreferredModes(p.preferred_modes || [])
        setProfileCompletionPct(p.profile_completion_pct || 0)
      }

      if (skillsRes.skills) {
        setSkills(skillsRes.skills)
      }
      if (skillsRes.availableTaxonomy) {
        setAvailableTaxonomy(skillsRes.availableTaxonomy)
      }

      if (exportRes.savedOpportunities) {
        const applied = exportRes.savedOpportunities.filter(
          (item: any) => item.status === 'applied' || item.status === 'interviewing' || item.status === 'offer' || item.status === 'offered'
        ).length
        const saved = exportRes.savedOpportunities.filter(
          (item: any) => item.status === 'saved' || !item.status
        ).length
        setAppliedCount(applied)
        setSavedCount(saved)
      }
    } catch (err) {
      console.error('Error fetching profile details:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfileData()

    const handlePointsRefresh = () => {
      loadProfileData()
    }
    window.addEventListener('points-awarded', handlePointsRefresh)
    window.addEventListener('storage', handlePointsRefresh)

    return () => {
      window.removeEventListener('points-awarded', handlePointsRefresh)
      window.removeEventListener('storage', handlePointsRefresh)
    }
  }, [loadProfileData])

  const toggleCategory = (cat: string) => {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const toggleMode = (m: string) => {
    setPreferredModes((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    )
  }

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim()
    if (!trimmed) return
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkillInput('')
      return
    }
    setSkills([...skills, { name: trimmed, level: newSkillLevel }])
    setNewSkillInput('')
  }

  const handleRemoveSkill = (name: string) => {
    setSkills(skills.filter((s) => s.name !== name))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      // 1. Save profile details
      const profRes = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          avatar_url: avatarUrl || null,
          bio,
          college,
          degree,
          branch,
          graduation_year: graduationYear === '' ? null : Number(graduationYear),
          current_year: currentYear === '' ? null : Number(currentYear),
          cgpa: cgpa === '' ? null : Number(cgpa),
          location,
          linkedin_url: linkedinUrl || null,
          github_url: githubUrl || null,
          portfolio_url: portfolioUrl || null,
          resume_reference: resumeReference || null,
          preferred_categories: preferredCategories,
          preferred_modes: preferredModes,
        }),
      })

      if (!profRes.ok) {
        const err = await profRes.json()
        throw new Error(err.error || 'Failed to update profile')
      }

      const profJson = await profRes.json()
      if (profJson.profile?.profile_completion_pct !== undefined) {
        setProfileCompletionPct(profJson.profile.profile_completion_pct)
      }

      // 2. Save skills taxonomy
      const skillRes = await fetch('/api/user/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: skills.map((s) => s.name),
          interests: preferredCategories,
        }),
      })

      if (!skillRes.ok) {
        const err = await skillRes.json()
        throw new Error(err.error || 'Failed to update skills')
      }

      setSuccessMsg('Profile, social links & skills updated successfully! XP points recalculated.')
      setTimeout(() => setSuccessMsg(null), 3500)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving changes')
    } finally {
      setSaving(false)
    }
  }

  // Calculate live scoreboard metrics
  const scoreboard = calculateScoreboard({
    appliedCount,
    savedCount,
    skillsCount: skills.length,
    profileCompletionPct,
  })

  // Current avatar preset lookup
  const activePreset = AVATAR_PRESETS.find((p) => p.emoji === avatarUrl)

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1.25rem' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600 }}>
          Loading your student profile & live scoreboard...
        </p>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '860px' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-indigo)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <Sparkles size={13} />
          <span>Student Dossier & Verification Hub</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Student Profile & Career Scoreboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Track your application XP points, customize your student avatar, and manage your verified credentials.
        </p>
      </div>

      {/* Live Gamification Career Scoreboard */}
      <ProfileScoreboard
        scoreboard={scoreboard}
        stats={{
          appliedCount,
          savedCount,
          skillsCount: skills.length,
          profileCompletionPct,
        }}
      />

      {/* Interactive Student Avatar Header */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          background: 'var(--bg-glass-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            onClick={() => setShowAvatarModal(true)}
            style={{
              position: 'relative',
              cursor: 'pointer',
            }}
            title="Click to change avatar"
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: activePreset ? activePreset.gradient : 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: avatarUrl.length <= 4 ? '2.4rem' : '1rem',
                border: '3px solid rgba(99, 102, 241, 0.5)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                overflow: 'hidden',
              }}
            >
              {avatarUrl.length > 4 && avatarUrl.startsWith('http') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                avatarUrl
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--accent-indigo)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-surface)',
              }}
            >
              <Camera size={12} />
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
              {fullName || 'Student Applicant'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {activePreset ? activePreset.name : 'Custom Identity'}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-indigo)', fontWeight: 600 }}>
                {college || 'Student Developer'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAvatarModal(true)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <Camera size={14} />
          <span>Choose Avatar Preset</span>
        </button>
      </div>

      {/* Success & Error Banners */}
      {successMsg && (
        <div style={{
          padding: '1rem',
          background: 'var(--accent-emerald-subtle)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#6ee7b7',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
        }}>
          <Check size={18} />
          <span style={{ fontWeight: 600 }}>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{
          padding: '1rem',
          background: 'var(--accent-rose-subtle)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#fda4af',
          marginBottom: '1.5rem',
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Academic Background */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <GraduationCap size={20} color="var(--accent-indigo)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Academic Identity</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                placeholder="e.g. Aditya Dubey"
              />
            </div>

            <div className="form-group">
              <label className="form-label">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="form-input"
                placeholder="e.g. Pune University, IIT Bombay, BITS Pilani"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degree</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="form-input"
                placeholder="e.g. B.Tech, B.E., BS Computer Science"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Major / Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="form-input"
                placeholder="e.g. Computer Science, AI & Data Science"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                min="2020"
                max="2035"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value === '' ? '' : Number(e.target.value))}
                className="form-input"
                placeholder="2026"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Academic Year</label>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(e.target.value === '' ? '' : Number(e.target.value))}
                className="form-select"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year (Final)</option>
                <option value="5">5th Year (Dual Degree)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">CGPA / Percentage</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value === '' ? '' : Number(e.target.value))}
                className="form-input"
                placeholder="e.g. 8.75"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current City / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
                placeholder="e.g. Pune, Bangalore, Mumbai"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Professional Links & Resume Vault */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <FileText size={20} color="var(--accent-indigo)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Professional Links & Resume Vault</h2>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Add your social profiles and resume link so organizers can review your track record with 1 click.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* LinkedIn */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#0284c7', display: 'flex' }}><LinkedinIcon /></span>
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="form-input"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            {/* GitHub */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#cbd5e1', display: 'flex' }}><GithubIcon /></span>
                <span>GitHub Profile URL</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="form-input"
                placeholder="https://github.com/username"
              />
            </div>

            {/* Resume Link */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={15} color="#10b981" />
                <span>Resume Link / PDF URL</span>
              </label>
              <input
                type="url"
                value={resumeReference}
                onChange={(e) => setResumeReference(e.target.value)}
                className="form-input"
                placeholder="https://drive.google.com/... or resume URL"
              />
            </div>

            {/* Portfolio URL */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={15} color="var(--accent-cyan)" />
                <span>Portfolio / Personal Website</span>
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="form-input"
                placeholder="https://yourportfolio.dev"
              />
            </div>
          </div>

          {/* Bio / Pitch */}
          <div className="form-group">
            <label className="form-label">Professional Pitch / Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="form-input"
              placeholder="e.g. 3rd-year CS student passionate about distributed backends, algorithmic trading, and open-source."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Section 3: Technical Skills Taxonomy */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Code size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Technical Stack & Skills</h2>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Add languages, frameworks, and tools. Each verified skill awards +10 XP to your live scoreboard!
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="e.g. TypeScript, React, Python, PostgreSQL, Rust, PyTorch..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill()
                }
              }}
              className="form-input"
              style={{ flex: '1 1 240px' }}
            />

            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>

            <button
              type="button"
              onClick={handleAddSkill}
              className="btn btn-secondary"
            >
              <Plus size={16} />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Current Skills Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '44px' }}>
            {skills.map((s) => (
              <span
                key={s.name}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.35rem 0.75rem',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#a5b4fc',
                }}
              >
                <span>{s.name}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>({s.level})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s.name)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                  }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No skills added yet. Add at least 3 skills to earn points and boost match accuracy!
              </span>
            )}
          </div>
        </div>

        {/* Section 4: Opportunity Preferences */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Briefcase size={20} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Opportunity Preferences</h2>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Preferred Tracks
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categoryOptions.map((cat) => {
                const active = preferredCategories.includes(cat)
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: active ? 700 : 500,
                      border: active ? '1px solid var(--accent-indigo)' : '1px solid var(--border-medium)',
                      background: active ? 'var(--accent-indigo)' : 'var(--bg-surface)',
                      color: active ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Preferred Work Modes
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {modeOptions.map((m) => {
                const active = preferredModes.includes(m)
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMode(m)}
                    style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: active ? 700 : 500,
                      border: active ? '1px solid var(--accent-cyan)' : '1px solid var(--border-medium)',
                      background: active ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                      color: active ? '#000' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '0.8rem 2.25rem', fontSize: '1rem', fontWeight: 700 }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Profile & XP...</span>
              </>
            ) : (
              <span>Save & Update Profile</span>
            )}
          </button>
        </div>
      </form>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={avatarUrl}
        onSelectAvatar={(selected) => setAvatarUrl(selected)}
      />
    </div>
  )
}
