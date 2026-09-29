'use client'

import React, { useState } from 'react'
import { Sparkles, Check, Zap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react'
import { DirectApplyModal } from './DirectApplyModal'
import { Opportunity } from '../lib/database.types'

interface SkillMatchSimulatorProps {
  sampleOpportunities: Opportunity[]
}

const AVAILABLE_SKILLS = [
  'Python',
  'React',
  'TypeScript',
  'PyTorch',
  'Next.js',
  'FastAPI',
  'Node.js',
  'Docker',
  'PostgreSQL',
  'Solidity',
  'Figma',
  'Git',
]

export function SkillMatchSimulator({ sampleOpportunities }: SkillMatchSimulatorProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'React', 'TypeScript'])
  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null)

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill))
      }
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  // Calculate simulated deterministic match score for opportunities
  const scoredOpportunities = sampleOpportunities.map((opp) => {
    const oppSkills = opp.skills || []
    if (oppSkills.length === 0) return { opp, score: 68, matchedCount: 0, matchedSkills: [] as string[] }

    const matched = oppSkills.filter((s) =>
      selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())
    )
    const matchRatio = matched.length / Math.max(oppSkills.length, 1)

    // Formula: 35% Skill Match + 30% Verified Trust + 20% Category Weight + 15% Urgency
    const score = Math.min(
      99,
      Math.round(matchRatio * 50 + (opp.is_verified ? 25 : 15) + (opp.is_featured ? 15 : 10) + 10)
    )

    return {
      opp,
      score,
      matchedCount: matched.length,
      matchedSkills: matched,
    }
  })

  // Sort by highest match
  const topMatches = [...scoredOpportunities].sort((a, b) => b.score - a.score).slice(0, 3)

  return (
    <>
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          background: 'var(--bg-glass)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ maxWidth: '640px', marginBottom: '2rem' }}>
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
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
            }}
          >
            <Cpu size={13} />
            <span>Interactive Simulator</span>
          </div>

          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Test Skillora's Deterministic Match Algorithm
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Select your skills below. Watch how Skillora calculates 100% explainable compatibility scores without selling your data or pushing sponsored spam.
          </p>
        </div>

        {/* Skill Selector Chips */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            SELECT YOUR TECH STACK (CLICK TO TOGGLE):
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {AVAILABLE_SKILLS.map((skill) => {
              const isSelected = selectedSkills.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.45rem 0.875rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: isSelected
                      ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))'
                      : 'var(--bg-surface)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    border: isSelected
                      ? '1px solid transparent'
                      : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? '0 0 14px rgba(99, 102, 241, 0.4)' : 'none',
                  }}
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                  <span>{skill}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Top Matched Opportunities */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              LIVE REAL-TIME MATCH RESULTS ({selectedSkills.length} SKILLS ACTIVE):
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              <ShieldCheck size={14} />
              <span>100% Explainable Math</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {topMatches.map(({ opp, score, matchedSkills }) => (
              <div
                key={opp.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        background:
                          score >= 85
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(99, 102, 241, 0.15)',
                        color: score >= 85 ? '#10b981' : 'var(--accent-indigo)',
                        border:
                          score >= 85
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      {score}% Profile Fit
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {opp.category}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.25rem' }}>
                    {opp.title}
                  </h4>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {opp.organization}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {(matchedSkills || []).map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: '0.6875rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: 'var(--accent-indigo)',
                          fontWeight: 600,
                        }}
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => setSelectedOppForApply(opp)}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Zap size={13} />
                    <span>Direct Apply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Direct Apply Modal triggered from simulator */}
      <DirectApplyModal
        opportunity={selectedOppForApply}
        isOpen={Boolean(selectedOppForApply)}
        onClose={() => setSelectedOppForApply(null)}
      />
    </>
  )
}
