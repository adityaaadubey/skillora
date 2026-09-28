'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2, Plus, X, GraduationCap, Code, Briefcase } from 'lucide-react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form State
  const [fullName, setFullName] = useState('')
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
  const [preferredCategories, setPreferredCategories] = useState<string[]>([])
  const [preferredModes, setPreferredModes] = useState<string[]>([])

  // Skills Taxonomy State
  const [skills, setSkills] = useState<{ name: string; level: string }[]>([])
  const [newSkillInput, setNewSkillInput] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState('intermediate')
  const [availableTaxonomy, setAvailableTaxonomy] = useState<string[]>([])

  const categoryOptions = ['internship', 'hackathon', 'scholarship', 'fellowship', 'research', 'competition']
  const modeOptions = ['remote', 'hybrid', 'offline']

  useEffect(() => {
    Promise.all([
      fetch('/api/user/profile').then((r) => r.json()),
      fetch('/api/user/skills').then((r) => r.json()),
    ])
      .then(([profData, skillsData]) => {
        if (profData.profile) {
          const p = profData.profile
          setFullName(p.full_name || '')
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
          setPreferredCategories(p.preferred_categories || [])
          setPreferredModes(p.preferred_modes || [])
        }
        if (skillsData.skills) {
          setSkills(skillsData.skills)
        }
        if (skillsData.availableTaxonomy) {
          setAvailableTaxonomy(skillsData.availableTaxonomy)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

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
          preferred_categories: preferredCategories,
          preferred_modes: preferredModes,
        }),
      })

      if (!profRes.ok) {
        const err = await profRes.json()
        throw new Error(err.error || 'Failed to update profile')
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

      setSuccessMsg('Profile and skills taxonomy updated successfully!')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading student profile...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '840px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Student Profile & Skills Taxonomy
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Your profile directly powers Skillora&apos;s deterministic relevance matching algorithm.
        </p>
      </div>

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
          <span>{successMsg}</span>
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
              <label className="form-label">Full Name</label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                placeholder="Jane Doe"
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
          </div>
        </div>

        {/* Section 2: Technical Skills Taxonomy */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Code size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Technical Stack & Skills</h2>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Add programming languages, frameworks, libraries, and tools you have experience with.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="e.g. TypeScript, React, Python, PostgreSQL..."
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
                No skills added yet. Add at least 3 skills to enable matching!
              </span>
            )}
          </div>
        </div>

        {/* Section 3: Opportunity Preferences */}
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

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <span>Save & Update Matching</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
