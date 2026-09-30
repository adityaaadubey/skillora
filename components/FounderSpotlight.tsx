'use client'

import React, { useState } from 'react'
import {
  Mail,
  Copy,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react'

export function FounderSpotlight() {
  const [copied, setCopied] = useState(false)

  const email = 'skillora.aditya@gmail.com'

  const handleCopy = () => {
    navigator.clipboard.writeText(`Aditya Dubey | ${email}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section style={{ padding: '4.5rem 0', position: 'relative' }}>
      <div className="container">
        <div
          className="glass-panel"
          style={{
            padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2.5rem)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            background: 'var(--bg-glass)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(56, 189, 248, 0.05) 50%, rgba(0, 0, 0, 0) 70%)',
              filter: 'blur(35px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Founder Bio & Vision */}
            <div>
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
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={14} />
                <span>Founder & Architecture Spotlight</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: '0.5rem',
                }}
              >
                Aditya Dubey
              </h2>

              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--accent-indigo)',
                  marginBottom: '1.25rem',
                }}
              >
                Founder & Chief System Architect • Skillora
              </div>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem',
                }}
              >
                &ldquo;Skillora was engineered to eliminate the broken, spam-ridden discovery cycle facing university students and junior developers. Rather than forcing applicants through five different redirect loops, tracking cookies, or stale listings, Skillora connects talent directly with verified hackathons, tier-1 research grants, and engineering fellowships across 10+ global pipes with complete transparency.&rdquo;
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                  paddingTop: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.84rem', color: '#10b981', fontWeight: 600 }}>
                  <ShieldCheck size={16} />
                  <span>100% Open & Transparent</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.84rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  <Award size={16} />
                  <span>Zero-Redirect Direct Apply</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Direct Contact Hub */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Connect Directly with the Founder
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                Have an event to list, platform feedback, partnership inquiries, or engineering questions? Reach out directly:
              </p>

              {/* Email Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  padding: '1rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.14)',
                      color: 'var(--accent-indigo)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>OFFICIAL BUSINESS EMAIL</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                      {email}
                    </div>
                  </div>
                </div>

                <a
                  href={`mailto:${email}`}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                >
                  Send Email
                </a>
              </div>

              {/* Copy Contact Info Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="btn btn-outline"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.25rem',
                }}
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Email Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    <span>Copy Official Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
