'use client'

import React from 'react'
import { Sparkles, Trophy, Zap, Bookmark, Code, CheckCircle, TrendingUp } from 'lucide-react'
import { ScoreboardResult } from '../lib/gamification'

interface ProfileScoreboardProps {
  scoreboard: ScoreboardResult
  stats: {
    appliedCount: number
    savedCount: number
    skillsCount: number
    profileCompletionPct: number
  }
}

export function ProfileScoreboard({ scoreboard, stats }: ProfileScoreboardProps) {
  const { totalXP, currentTier, nextTier, progressToNext, breakdown } = scoreboard

  return (
    <div
      className="glass-panel"
      style={{
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        background: 'var(--bg-glass-card)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 30px rgba(99, 102, 241, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(56, 189, 248, 0.05) 50%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Banner: Rank & Points */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(99, 102, 241, 0.15)',
              border: `2px solid ${currentTier.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              boxShadow: `0 0 20px ${currentTier.color}33`,
            }}
          >
            {currentTier.badge}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Skillora Career Scoreboard
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                LIVE XP
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Level {currentTier.level} • {currentTier.title}
            </h3>
          </div>
        </div>

        {/* Total Points Big Badge */}
        <div
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(56, 189, 248, 0.15) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.4rem',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)',
          }}
        >
          <Sparkles size={16} color="var(--accent-indigo)" />
          <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>
            {totalXP}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            XP Points
          </span>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.45rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            {nextTier
              ? `${nextTier.minXP - totalXP} XP until ${nextTier.title} (${nextTier.badge})`
              : 'Max Tier Achieved • Skillora Legend'}
          </span>
          <span style={{ color: 'var(--accent-indigo)', fontWeight: 700 }}>
            {progressToNext}% to Next Rank
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressToNext}%`,
              height: '100%',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #10b981 100%)',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      </div>

      {/* Points Breakdown Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {/* Applied */}
        <div
          style={{
            padding: '0.75rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Direct Applied</span>
            <Zap size={13} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.appliedCount}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
              +{breakdown.appliedXP} XP
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>+50 XP per apply</span>
        </div>

        {/* Bookmarked */}
        <div
          style={{
            padding: '0.75rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Bookmarked</span>
            <Bookmark size={13} color="var(--accent-indigo)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.savedCount}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-indigo)', fontWeight: 700 }}>
              +{breakdown.savedXP} XP
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>+15 XP per save</span>
        </div>

        {/* Verified Skills */}
        <div
          style={{
            padding: '0.75rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Verified Skills</span>
            <Code size={13} color="var(--accent-cyan)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.skillsCount}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              +{breakdown.skillsXP} XP
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>+10 XP per skill</span>
        </div>

        {/* Profile Completeness */}
        <div
          style={{
            padding: '0.75rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Profile Score</span>
            <CheckCircle size={13} color="#f59e0b" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.profileCompletionPct}%
            </span>
            <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700 }}>
              +{breakdown.profileXP} XP
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>1 XP per 1% completed</span>
        </div>
      </div>
    </div>
  )
}
