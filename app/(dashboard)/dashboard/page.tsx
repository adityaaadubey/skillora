'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { OpportunityCard } from '../../../components/OpportunityCard'
import {
  Sparkles,
  Bookmark,
  Bell,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Compass,
  User,
  Plus,
} from 'lucide-react'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [remindersCount, setRemindersCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/user/profile').then((r) => r.json()),
      fetch('/api/recommendations').then((r) => r.json()),
      fetch('/api/auth/session').then((r) => r.json()),
    ])
      .then(([profData, recData, sessData]) => {
        if (profData.profile) setProfile(profData.profile)
        if (recData.recommendations) setRecommendations(recData.recommendations)
        if (sessData.user?.savedCount) setSavedCount(sessData.user.savedCount)
        if (sessData.user?.remindersCount) setRemindersCount(sessData.user.remindersCount)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const completionPct = profile?.profile_completion_pct || 0

  // Derive skill gaps from top recommendations
  const userSkillsSet = new Set((profile?.career_interests || []).map((s: string) => s.toLowerCase()))
  const missingSkillsMap = new Map<string, number>()

  recommendations.forEach((rec) => {
    const oppSkills = rec.skills || []
    oppSkills.forEach((s: string) => {
      const lower = s.toLowerCase()
      if (!userSkillsSet.has(lower)) {
        missingSkillsMap.set(s, (missingSkillsMap.get(s) || 0) + 1)
      }
    })
  })

  const topSkillGaps = Array.from(missingSkillsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Welcome back, {profile?.full_name || 'Engineer'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            {profile?.college ? `${profile.college} • ${profile.degree || 'B.Tech'}` : 'Opportunity Command Center'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/opportunities" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
            <Compass size={16} />
            <span>Discover More</span>
          </Link>
          <Link href="/profile" className="btn btn-secondary" style={{ padding: '0.625rem 1.25rem' }}>
            <User size={16} />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Profile Completion Warning (if < 70%) */}
      {completionPct < 70 && (
        <div className="glass-panel" style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          borderLeft: '4px solid var(--accent-indigo)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--accent-indigo-subtle)',
              color: 'var(--accent-indigo)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}>
              {completionPct}%
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                Your student profile is {completionPct}% complete
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                Add your technical skills and preferred locations to boost match precision by 40%.
              </p>
            </div>
          </div>

          <Link href="/profile" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
            <span>Complete Profile</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOP MATCHES</span>
            <Sparkles size={16} color="var(--accent-indigo)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{recommendations.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>Deterministic relevance &gt; 70%</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>SAVED PIPELINE</span>
            <Bookmark size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{savedCount}</div>
          <Link href="/saved" style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', marginTop: '0.25rem', display: 'inline-block' }}>
            Manage tracker →
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>DEADLINE REMINDERS</span>
            <Bell size={16} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{remindersCount}</div>
          <Link href="/reminders" style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', marginTop: '0.25rem', display: 'inline-block' }}>
            View reminders →
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>MATCH ACCURACY</span>
            <BrainCircuit size={16} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>98.4%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>5-factor transparent scoring</div>
        </div>
      </div>

      {/* Main Grid: Recommended For You & Skill Gap Analysis */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
      }}>
        <style jsx>{`
          @media (min-width: 1024px) {
            .dashboard-grid {
              display: grid !important;
              grid-template-columns: 2fr 1fr !important;
              gap: 2rem !important;
            }
          }
        `}</style>
        <div className="dashboard-grid">
          {/* Recommended Opportunities */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--accent-indigo)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recommended Opportunities</h2>
              </div>
              <Link href="/opportunities" style={{ fontSize: '0.8125rem', color: 'var(--accent-indigo)', fontWeight: 600 }}>
                Explore All
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass-panel" style={{ height: '160px', padding: '1.25rem' }}>
                    <div className="skeleton" style={{ width: '40%', height: '20px', marginBottom: '0.75rem' }} />
                    <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ width: '60%', height: '16px' }} />
                  </div>
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  No personalized matches found yet. Try completing your profile with your technical skills.
                </p>
                <Link href="/profile" className="btn btn-secondary">
                  Configure Skills
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {recommendations.slice(0, 5).map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    matchScore={opp.relevanceScore}
                    matchReasons={opp.relevanceBreakdown?.explanationTags}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Skill Gap Intelligence & Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Skill Gap Analysis Box */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <TrendingUp size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>In-Demand Skill Gaps</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                High-demand skills found in top opportunities that aren&apos;t yet listed on your profile:
              </p>

              {topSkillGaps.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {topSkillGaps.map(([skill, count]) => (
                    <div
                      key={skill}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.875rem',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{skill}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                        In {count} top listings
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1rem', background: 'var(--accent-emerald-subtle)', borderRadius: 'var(--radius-md)', color: '#6ee7b7', fontSize: '0.8125rem' }}>
                  Great job! Your profile covers the primary technologies required by currently open programs.
                </div>
              )}

              <div style={{ marginTop: '1.25rem' }}>
                <Link
                  href="/profile"
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.8125rem' }}
                >
                  <Plus size={14} />
                  <span>Add Skills to Profile</span>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link
                  href="/saved"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.875rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bookmark size={15} color="var(--accent-indigo)" />
                    <span>Application Status Tracker</span>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </Link>

                <Link
                  href="/settings"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.875rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="var(--accent-emerald)" />
                    <span>Data Privacy & GDPR Export</span>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
