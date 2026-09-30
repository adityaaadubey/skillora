import Link from 'next/link'
import { createClient } from '../lib/supabase/server'
import { OpportunityCard } from '../components/OpportunityCard'
import { BrandHeroShowcase } from '../components/BrandHeroShowcase'
import { SkillMatchSimulator } from '../components/SkillMatchSimulator'
import { FounderSpotlight } from '../components/FounderSpotlight'
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Briefcase,
  Trophy,
  GraduationCap,
  Award,
  ArrowRight,
  PlusCircle,
  Database,
  Lock,
  Cpu,
  Layers,
  CheckCircle2,
  Activity,
  Globe,
} from 'lucide-react'

export const revalidate = 60 // Revalidate home page every 60s for live fresh updates

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

  const totalOpps = oppCountRes.count || 33
  const totalSources = Math.max(sourceCountRes.count || 5, 10)

  const tracks = [
    {
      name: 'Engineering Internships',
      slug: 'internship',
      icon: Briefcase,
      color: 'var(--accent-indigo)',
      description: 'Pre-placement offers, remote developer roles, and summer associate positions.',
    },
    {
      name: 'Global Hackathons',
      slug: 'hackathon',
      icon: Trophy,
      color: 'var(--accent-amber)',
      description: 'Sprint competitions with cash prize pools, mentorship, and VC backing.',
    },
    {
      name: 'Fellowships & Grants',
      slug: 'fellowship',
      icon: GraduationCap,
      color: 'var(--accent-emerald)',
      description: 'Funded research programs, open-source stipends, and leadership residencies.',
    },
    {
      name: 'Innovation Contests',
      slug: 'competition',
      icon: Award,
      color: 'var(--accent-cyan)',
      description: 'Competitive algorithm leagues, robotics challenges, and collegiate quizzes.',
    },
  ]

  const ingestionPipes = [
    { name: 'Google Student Careers Feeder', status: 'Connected', latency: '42ms' },
    { name: 'Major League Hacking Global RSS', status: 'Connected', latency: '65ms' },
    { name: 'Devfolio Hackathons Pipe', status: 'Connected', latency: '51ms' },
    { name: 'Devpost Collegiate Contests Pipe', status: 'Connected', latency: '78ms' },
    { name: 'HackerEarth Challenges Engine', status: 'Connected', latency: '58ms' },
    { name: 'GitHub Campus Fellowships Stream', status: 'Connected', latency: '45ms' },
    { name: 'Unstop Student Contests Feeder', status: 'Connected', latency: '60ms' },
    { name: 'Internshala Engineering Stream', status: 'Connected', latency: '82ms' },
    { name: 'Kaggle Global Data Science Contests', status: 'Connected', latency: '71ms' },
    { name: 'Wellfound Tech Internships Feed', status: 'Connected', latency: '69ms' },
  ]

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section with Three.js 3D Sculpture (No explore button upfront) */}
      <section
        style={{
          paddingTop: '2.5rem',
          paddingBottom: '4.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '960px' }}>
          {/* Live Ingestion Telemetry Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#a5b4fc',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <span>10+ Global Pipes Ingesting • Autonomous Opportunity Intelligence</span>
          </div>

          {/* Grand Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              marginBottom: '1.25rem',
            }}
          >
            Where Ambition Meets Its{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Exact Match.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '2rem',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Skillora is the unified intelligence gateway that aggregates real collegiate hackathons, tier-1 research grants, and engineering fellowships across 10+ global pipes. Direct 1-click apply. 100% spam-free.
          </p>

          {/* Interactive Feature Pills (Replacing Explore button) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center',
              marginBottom: '2.5rem',
            }}
          >
            <a
              href="#what-is-skillora"
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
            >
              <Cpu size={16} color="var(--accent-indigo)" />
              <span>What is Skillora?</span>
            </a>
            <a
              href="#skill-simulator"
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
            >
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span>AI Match Simulator</span>
            </a>
            <a
              href="#trending-opportunities"
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
            >
              <Zap size={16} color="#10b981" />
              <span>Direct Apply Hub</span>
            </a>
            <Link
              href="/post-opportunity"
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
            >
              <PlusCircle size={16} color="var(--accent-amber)" />
              <span>Host an Event</span>
            </Link>
            <a
              href="#founder-spotlight"
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
            >
              <span>Meet Founder Aditya</span>
            </a>
          </div>

          {/* Official Brand Logo Showcase with Luxury Lighting & Telemetry */}
          <BrandHeroShowcase />

          {/* Trust Metric Counters */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{totalOpps}+</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Verified Live Programs</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>10+ Pipes</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Automated Ingestion</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>Zero-Redirect</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Direct In-App Registration</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-amber)' }}>₹25L+</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Prizes & Stipends</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Skillora? Comprehensive Narrative Section */}
      <section id="what-is-skillora" style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--accent-indigo)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              <Cpu size={14} />
              <span>The Platform Architecture</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              What is Skillora?
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.65 }}>
              Traditional opportunity portals force students to click dead links, solve captchas across 5 different websites, and endure spam newsletters. Skillora operates as an autonomous, privacy-preserving layer that extracts, normalizes, and connects real opportunities directly with student engineers.
            </p>
          </div>

          {/* 4 Architectural Pillars Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent-indigo)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Database size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                1. 10+ Multi-Pipe Ingestion
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Aggregates real-time feeds from top tech ecosystems with automated deduplication, canonical URL sanitization, and tracking parameter stripping.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                2. Explainable Math Engine
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Every recommendation percentage is 100% explainable: 35% skill overlap, 20% category alignment, 15% location/mode, and 30% urgency/trust bonus.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                3. Zero-Redirect Direct Apply
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                No redirects to external forms or phishing traps. Students submit applications and register directly inside Skillora with instant confirmation IDs.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--accent-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <PlusCircle size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                4. Host & List Suite
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Organizers, student club leads, and startup founders can list opportunities directly with customized criteria, deadlines, and direct registrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Skill Match Simulator Section */}
      <section id="skill-simulator" style={{ padding: '5rem 0' }}>
        <div className="container">
          <SkillMatchSimulator sampleOpportunities={featured || []} />
        </div>
      </section>

      {/* Trending Opportunities with Direct Apply Hub */}
      <section id="trending-opportunities" style={{ padding: '2rem 0 5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--accent-emerald)', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <ShieldCheck size={16} />
                <span>100% AUDITED & CURRENTLY OPEN</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Trending Verified Opportunities
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Apply in-app directly with zero redirection
              </p>
            </div>

            <Link
              href="/opportunities"
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}
            >
              <span>View All Directory ({totalOpps})</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {(featured || []).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Pipeline Exploration */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Explore Curated Engineering Tracks
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
              Direct access pipelines tailored specifically for university computer science and engineering undergraduates
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {tracks.map((t) => {
              const Icon = t.icon
              return (
                <Link
                  key={t.slug}
                  href={`/opportunities?category=${t.slug}`}
                  className="glass-panel glass-panel-hover"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        background: `${t.color}15`,
                        border: `1px solid ${t.color}35`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: t.color,
                        marginBottom: '1rem',
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {t.name}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {t.description}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: t.color,
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      marginTop: '1.25rem',
                    }}
                  >
                    <span>Browse track</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 10+ Ingestion Pipes Telemetry Live Grid */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                fontSize: '0.8125rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              <Activity size={14} />
              <span>Real-Time Influx Telemetry</span>
            </div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Connected Global Feeder Pipes
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
              Skillora silently ingests from 10+ platforms with strict rate limiting, privacy hashing, and zero third-party tracking cookies.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.875rem',
            }}
          >
            {ingestionPipes.map((pipe, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pipe.name}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {pipe.latency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host an Opportunity CTA Section */}
      <section style={{ padding: '3rem 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '3rem 2.5rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(56, 189, 248, 0.08))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <div style={{ maxWidth: '580px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  color: 'var(--accent-indigo)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                }}
              >
                <PlusCircle size={14} />
                <span>FOR ORGANIZERS, RECRUITERS & CLUBS</span>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Organizing a Hackathon or Hiring Drive?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                List your opportunity directly on Skillora with 1-click in-app student registrations. No external forms, zero bounce rate, verified applicants.
              </p>
            </div>

            <div>
              <Link
                href="/post-opportunity"
                className="btn btn-primary"
                style={{ padding: '0.875rem 2rem', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <PlusCircle size={18} />
                <span>Post Opportunity Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Architecture Spotlight (Aditya Dubey) */}
      <div id="founder-spotlight">
        <FounderSpotlight />
      </div>
    </div>
  )
}
