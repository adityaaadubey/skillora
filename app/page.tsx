import Link from 'next/link'
import { createClient } from '../lib/supabase/server'
import { OpportunityCard } from '../components/OpportunityCard'
import { Compass, Sparkles, ShieldCheck, ArrowRight, Trophy, GraduationCap, Briefcase } from 'lucide-react'

export const revalidate = 60 // Revalidate home page every 60s

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch verified & featured opportunities
  const { data: featured } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(6)

  // Count stats
  const [oppCountRes, sourceCountRes] = await Promise.all([
    supabase.from('opportunities').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('opportunity_sources').select('*', { count: 'exact', head: true }),
  ])

  const totalOpps = oppCountRes.count || 20
  const totalSources = sourceCountRes.count || 4

  const categories = [
    { name: 'Internships', slug: 'internship', icon: Briefcase, color: 'var(--accent-indigo)' },
    { name: 'Hackathons', slug: 'hackathon', icon: Trophy, color: 'var(--accent-amber)' },
    { name: 'Scholarships', slug: 'scholarship', icon: GraduationCap, color: 'var(--accent-emerald)' },
    { name: 'Fellowships', slug: 'fellowship', icon: Sparkles, color: 'var(--accent-cyan)' },
  ]

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '880px' }}>
          {/* Trust Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.875rem',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#a5b4fc',
            marginBottom: '1.75rem',
          }}>
            <Sparkles size={14} color="var(--accent-indigo)" />
            <span>Deterministic Match Intelligence for University Students</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
          }}>
            Stop scrolling spam. Find opportunities that{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              match your tech stack.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '680px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Skillora audits thousands of collegiate internships, hackathons, and fellowships. Get matched based on your skills, degree, and location with 100% explainable scoring.
          </p>

          {/* Search Box & Quick CTA */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              width: '100%',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              <Link href="/opportunities" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
                <Compass size={18} />
                <span>Explore Opportunities</span>
              </Link>
              <Link href="/login" className="btn btn-secondary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
                <span>Sign In / Join</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Social Proof Metric Counters */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalOpps}+</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Vetted Opportunities</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>100%</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Spam-Free Verified</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{totalSources} Feeds</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Automated Ingestion</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>₹10L+</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Prizes & Stipends</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Fast Filters */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                Explore by Track
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Hand-picked pipelines tailored for university engineers
              </p>
            </div>
            <Link href="/opportunities" style={{ color: 'var(--accent-indigo)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            {categories.map((c) => {
              const Icon = c.icon
              return (
                <Link
                  key={c.slug}
                  href={`/opportunities?category=${c.slug}`}
                  className="glass-panel glass-panel-hover"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: `${c.color}18`,
                    border: `1px solid ${c.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: c.color,
                  }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Explore track →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Verified Opportunities */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--accent-emerald)', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              <ShieldCheck size={16} />
              <span>CURRENTLY OPEN & VERIFIED</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Trending Opportunities
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {(featured || []).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/opportunities" className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
              <span>Browse All {totalOpps} Verified Opportunities</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Explaining Deterministic Relevance Architecture */}
      <section style={{
        padding: '4.5rem 0',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Why Skillora Scoring is 100% Explainable
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              No opaque black-box recommendations. We show you the exact math behind every single percentage score.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-indigo)', marginBottom: '0.5rem' }}>35%</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Skill Match Weight</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Direct intersection of your verified skills (Python, TypeScript, PyTorch) with the program requirements.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>20%</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Category Alignment</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Prioritizes tracks you explicitly care about—whether hackathons, internships, or academic research.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>15%</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Location & Mode Fit</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Rewards remote friendly listings or local hubs matching your university campus location.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>30%</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Urgency & Trust Bonus</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Prioritizes closing-soon deadlines so you never miss an application cutoff, plus verified provider boost.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
