'use client'

import React, { useState } from 'react'
import {
  Mail,
  Phone,
  Copy,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Award,
} from 'lucide-react'

export function FounderSpotlight() {
  const [copied, setCopied] = useState(false)

  const email = 'adityaomprakashdubey@gmail.com'
  const phone = '+919881867687'
  const formattedPhone = '+91 98818 67687'

  const handleCopy = () => {
    navigator.clipboard.writeText(`Aditya Dubey | ${email} | ${phone}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section style={{ padding: '4.5rem 0', position: 'relative' }}>
      <div className="container">
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2.5rem',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--accent-indigo)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>DIRECT EMAIL</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                      {email}
                    </div>
                  </div>
                </div>

                <a
                  href={`mailto:${email}`}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  Send Email
                </a>
              </div>

              {/* Phone Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>PHONE / WHATSAPP</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formattedPhone}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${phone}`}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  Call Now
                </a>
              </div>

              {/* Action Buttons: Copy All & GitHub */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                  }}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={16} color="#10b981" />
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Details Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      <span>Copy Contact Info</span>
                    </>
                  )}
                </button>

                <a
                  href="https://github.com/adityaaadubey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    padding: '0.65rem 1rem',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
