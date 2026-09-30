'use client'

import React, { useRef } from 'react'
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle,
  Building2,
  Calendar,
  User,
  Mail,
  Phone,
  GraduationCap,
  Globe,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react'
import { Opportunity } from '../lib/database.types'

export interface ApplicationSlipData {
  applicationId: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  college: string
  degree: string
  yearOfStudy: string
  portfolioUrl?: string
  resumeUrl?: string
  pitch?: string
  appliedAt: string
  opportunity: Opportunity
}

interface ApplicationSlipModalProps {
  isOpen: boolean
  onClose: () => void
  data: ApplicationSlipData | null
}

export function ApplicationSlipModal({ isOpen, onClose, data }: ApplicationSlipModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !data) return null

  const {
    applicationId,
    applicantName,
    applicantEmail,
    applicantPhone,
    college,
    degree,
    yearOfStudy,
    portfolioUrl,
    resumeUrl,
    pitch,
    appliedAt,
    opportunity,
  } = data

  const formattedDate = new Date(appliedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank', 'width=900,height=1100')
    if (!printWindow) {
      window.print()
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Skillora_Application_Slip_${applicationId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 2rem;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: A4;
              margin: 12mm;
            }
            .slip-card {
              border: 2px solid #4f46e5;
              border-radius: 16px;
              padding: 2.25rem;
              position: relative;
              background: #ffffff;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-30deg);
              font-size: 5rem;
              font-weight: 900;
              color: rgba(79, 70, 229, 0.04);
              pointer-events: none;
              letter-spacing: 0.15em;
              white-space: nowrap;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .badge-verified {
              background: #ecfdf5;
              color: #047857;
              border: 1px solid #10b981;
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 700;
              display: inline-block;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1.25rem;
              margin-bottom: 1.5rem;
            }
            .box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 1rem;
            }
            .box-title {
              font-size: 11px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 0.5rem;
            }
            .box-content p {
              font-size: 13px;
              margin-bottom: 0.25rem;
              color: #1e293b;
            }
            .box-content strong {
              color: #0f172a;
            }
            .policy-box {
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 10px;
              padding: 1rem;
              margin-bottom: 1.5rem;
              font-size: 11px;
              color: #166534;
              line-height: 1.6;
            }
            .footer-sign {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px solid #e2e8f0;
              padding-top: 1.25rem;
              margin-top: 1rem;
              font-size: 11px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          background: 'var(--bg-glass-card)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.25)',
        }}
      >
        {/* Top Control Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle size={13} />
              <span>Official Verification Receipt</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.8125rem',
                gap: '0.4rem',
                boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
              }}
              title="Print or Save official PDF slip"
            >
              <Download size={14} />
              <span>Download Slip (PDF)</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close slip"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Printable Certificate Slip Container */}
        <div
          ref={printRef}
          style={{
            position: 'relative',
            background: 'var(--bg-surface)',
            border: '2px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '16px',
            padding: 'clamp(1.25rem, 3vw, 2.25rem)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-25deg)',
              fontSize: 'clamp(3rem, 10vw, 5.5rem)',
              fontWeight: 900,
              color: 'rgba(99, 102, 241, 0.035)',
              pointerEvents: 'none',
              letterSpacing: '0.15em',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            SKILLORA VERIFIED
          </div>

          {/* Slip Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
              borderBottom: '2px solid var(--border-subtle)',
              paddingBottom: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-indigo)' }}>
                  SKILLORA
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• INTELLIGENCE NETWORK</span>
              </div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                PROOF OF DIRECT REGISTRATION & APPLICATION
              </h1>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Zero-Redirection Direct In-App Submission Slip
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                APPLICATION TRACKING ID
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--accent-indigo)',
                  letterSpacing: '0.04em',
                }}
              >
                {applicationId}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '0.2rem' }}>
                ● Confirmed & Dispatched
              </div>
            </div>
          </div>

          {/* Two Columns: Candidate Details & Target Opportunity */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            {/* Candidate Identity Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.15rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-indigo)',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.04em',
                }}
              >
                <User size={13} />
                <span>Applicant Information</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8125rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Full Name: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{applicantName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>College / University: </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{college || 'Student'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Degree / Program: </span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {degree ? `${degree} (${yearOfStudy})` : yearOfStudy}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{applicantEmail}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{applicantPhone}</span>
                </div>
                {portfolioUrl && (
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Portfolio / GitHub: </span>
                    <a href={portfolioUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>
                      {portfolioUrl.replace(/^https?:\/\//, '').slice(0, 30)}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Target Opportunity Details */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.15rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.04em',
                }}
              >
                <Building2 size={13} />
                <span>Opportunity Details</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8125rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Program Title: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{opportunity.title}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Organization: </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{opportunity.organization}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Track / Category: </span>
                  <span style={{ color: 'var(--accent-indigo)', fontWeight: 600, textTransform: 'capitalize' }}>
                    {opportunity.category}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Mode: </span>
                  <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {opportunity.mode || 'Remote'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Compensation: </span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>
                    {opportunity.stipend_max
                      ? `₹${opportunity.stipend_max.toLocaleString()}/mo`
                      : opportunity.pricing_type === 'free'
                      ? '100% Free / Merit-Based'
                      : 'Verified'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Submitted On: </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statement of Registration */}
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '10px',
              padding: '0.875rem 1.15rem',
              marginBottom: '1.25rem',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
            }}
          >
            <strong>Official Certification of Registration:</strong> This document certifies that candidate{' '}
            <strong style={{ color: 'var(--accent-indigo)' }}>{applicantName}</strong> has officially registered and submitted their direct in-app candidate profile for{' '}
            <strong>{opportunity.title}</strong> hosted by <strong>{opportunity.organization}</strong>. The application dossier has been verified and registered on the Skillora Intelligence Network.
          </div>

          {/* Privacy Policy & Data Governance Pledge */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '10px',
              padding: '0.875rem 1.15rem',
              marginBottom: '1.5rem',
              fontSize: '0.75rem',
              color: '#34d399',
              lineHeight: 1.5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              <Lock size={12} />
              <span>Skillora Student Privacy Guarantee & Data Governance Pledge</span>
            </div>
            In compliance with student privacy standards, all submitted candidate information is encrypted in transit and at rest. Skillora guarantees zero selling, zero spam, and zero third-party telemetry scraping. Your dossier is provided directly and exclusively to the verified organizer.
          </div>

          {/* Slip Footer with Verification Seal & Signature */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  lineHeight: 1.1,
                }}
              >
                SKL<br />VERIFIED
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <div>Autonomous Verification Engine</div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Skillora Live Network Node</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'cursive, serif', fontSize: '1rem' }}>
                Aditya Dubey
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Aditya Dubey, Chief Architect</div>
              <div style={{ color: 'var(--accent-indigo)', fontWeight: 600, fontSize: '0.7rem' }}>
                Skillora Intelligence Platform
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>
            Close
          </button>
          <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', gap: '0.4rem' }}>
            <Printer size={15} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}
