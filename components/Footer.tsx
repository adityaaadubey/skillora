import Link from 'next/link'
import { ShieldCheck, Database, Lock } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      marginTop: 'auto',
      paddingTop: '3rem',
      paddingBottom: '5rem', // space for mobile nav
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1rem',
              }}>
                S
              </div>
              <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                Skill<span style={{ color: 'var(--accent-indigo)' }}>ora</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px' }}>
              High-trust opportunity discovery intelligence platform for university students and emerging developers.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Discovery
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link href="/opportunities?category=internship" style={{ transition: 'color 0.2s' }}>Internships</Link></li>
              <li><Link href="/opportunities?category=hackathon" style={{ transition: 'color 0.2s' }}>Hackathons</Link></li>
              <li><Link href="/opportunities?category=scholarship" style={{ transition: 'color 0.2s' }}>Scholarships</Link></li>
              <li><Link href="/opportunities?category=fellowship" style={{ transition: 'color 0.2s' }}>Fellowships</Link></li>
              <li><Link href="/opportunities?mode=remote" style={{ transition: 'color 0.2s' }}>Remote Gigs</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Platform & Security
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--accent-emerald)" />
                <span>Zero Spam Guarantee</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={16} color="var(--accent-indigo)" />
                <span>Passwordless OTP Auth</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={16} color="var(--accent-cyan)" />
                <span>Deterministic Scoring</span>
              </li>
              <li><Link href="/settings" style={{ transition: 'color 0.2s' }}>Privacy & Data Export</Link></li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} Skillora Systems Inc. Production-hardened release.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/settings" style={{ transition: 'color 0.2s' }}>Terms</Link>
            <Link href="/settings" style={{ transition: 'color 0.2s' }}>Privacy</Link>
            <Link href="/api/health" style={{ transition: 'color 0.2s' }}>System Health</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
