import Link from 'next/link'
import { SkilloraLogo } from './SkilloraLogo'
import { ShieldCheck, Database, Lock, Mail, Phone, Heart, Zap, PlusCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        marginTop: 'auto',
        paddingTop: '3.5rem',
        paddingBottom: '5rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand & Overview */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <SkilloraLogo size="md" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px', marginBottom: '1.25rem' }}>
              The autonomous opportunity intelligence network. Aggregating verified hackathons, fellowships, and internships across 10+ global pipes with zero-redirect direct apply.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              <span>10+ Ingestion Pipes Active</span>
            </div>
          </div>

          {/* Opportunity Tracks */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Explore Tracks
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link href="/opportunities?category=internship" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }}>Engineering Internships</Link></li>
              <li><Link href="/opportunities?category=hackathon" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }}>Global Hackathons</Link></li>
              <li><Link href="/opportunities?category=fellowship" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }}>Fellowships & Grants</Link></li>
              <li><Link href="/opportunities?category=competition" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }}>Coding Competitions</Link></li>
              <li><Link href="/opportunities?direct=true" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'var(--accent-indigo)', fontWeight: 600 }}>⚡ 1-Click Direct Apply</Link></li>
            </ul>
          </div>

          {/* Organizers & Architecture */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Organizers & Trust
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link href="/post-opportunity" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><PlusCircle size={14} color="var(--accent-indigo)" /><span>Post an Opportunity</span></Link></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--accent-emerald)" />
                <span>Zero Spam Guarantee</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={16} color="var(--accent-cyan)" />
                <span>Deterministic Scoring</span>
              </li>
              <li><Link href="/api/sync" target="_blank" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }}>Pipe Telemetry & Sync API</Link></li>
            </ul>
          </div>

          {/* Founder & Direct Contact */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Founder & Architect
            </h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Aditya Dubey</div>
              <a
                href="mailto:adityaomprakashdubey@gmail.com"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}
              >
                <Mail size={14} color="var(--accent-indigo)" />
                <span>adityaomprakashdubey@gmail.com</span>
              </a>
              <a
                href="tel:+919881867687"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}
              >
                <Phone size={14} color="#10b981" />
                <span>+91 98818 67687</span>
              </a>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Built for all ambitious students, developers, and organizers worldwide.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Skillora • Created with dedication by Aditya Dubey. Open & Inclusive for Everyone.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/settings" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }}>Privacy Policy</Link>
            <Link href="/api/health" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }}>System Health</Link>
            <Link href="/api/sync" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }}>Live Sync Status</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
