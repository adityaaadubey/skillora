'use client'

import React from 'react'

export function FloatingStudyStickers() {
  return (
    <div
      className="floating-stickers-container"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <style jsx>{`
        @keyframes floatSlow1 {
          0%, 100% {
            transform: translateY(0px) rotate(-3deg);
          }
          50% {
            transform: translateY(-16px) rotate(2deg);
          }
        }

        @keyframes floatSlow2 {
          0%, 100% {
            transform: translateY(0px) rotate(4deg);
          }
          50% {
            transform: translateY(-20px) rotate(-2deg);
          }
        }

        @keyframes floatSlow3 {
          0%, 100% {
            transform: translateY(0px) rotate(-6deg);
          }
          50% {
            transform: translateY(-14px) rotate(-1deg);
          }
        }

        @keyframes floatSlow4 {
          0%, 100% {
            transform: translateY(0px) rotate(2deg);
          }
          50% {
            transform: translateY(-18px) rotate(7deg);
          }
        }

        @keyframes pulseGlowRing {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.04);
          }
        }

        .sticker-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.95rem;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          box-shadow: 0 16px 35px -8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.18);
          transition: transform 0.3s ease;
          user-select: none;
          will-change: transform;
          transform: translateZ(0);
          contain: layout paint;
        }

        /* Light theme adaptivity */
        :global([data-theme="light"]) .sticker-card {
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(15, 23, 42, 0.1);
          box-shadow: 0 16px 35px -8px rgba(99, 102, 241, 0.15), 0 0 15px rgba(99, 102, 241, 0.1);
        }

        /* Responsive visibility: Hide on narrow screens so content is never occluded */
        @media (max-width: 1180px) {
          .floating-stickers-container {
            display: none !important;
          }
        }

        @media (min-width: 1181px) and (max-width: 1360px) {
          .sticker-card {
            transform: scale(0.85);
          }
        }
      `}</style>

      {/* ====================================================================
          LEFT FLANK STICKERS
          ==================================================================== */}

      {/* 1. Top-Left: Flying Magical Open Book */}
      <div
        className="sticker-card"
        style={{
          top: '7%',
          left: 'max(1.2rem, calc(50% - 630px))',
          animation: 'floatSlow1 7s ease-in-out infinite',
          borderColor: 'rgba(99, 102, 241, 0.35)',
        }}
      >
        <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
          {/* Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
              animation: 'pulseGlowRing 4s ease-in-out infinite',
            }}
          />
          {/* Detailed Open Book SVG */}
          <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 13C20 9 11 9 6 10V36C11 35 20 35 24 39C28 35 37 35 42 36V10C37 9 28 9 24 13Z"
              fill="url(#bookGrad)"
              stroke="#818cf8"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M24 13V39" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 18H20M10 24H18M10 30H19" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 18H38M28 24H36M28 30H37" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" />
            {/* Bookmark ribbon */}
            <path d="M24 13V26L21 23L18 26V11" fill="#f43f5e" />
            <defs>
              <linearGradient id="bookGrad" x1="6" y1="10" x2="42" y2="39" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1e1b4b" />
                <stop offset="0.5" stopColor="#312e81" />
                <stop offset="1" stopColor="#1e293b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Study Codex
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#818cf8', fontWeight: 600 }}>
            Hackathon Docs 📖
          </div>
        </div>
      </div>

      {/* 2. Mid-Left: Floating Manuscript / Draft Page */}
      <div
        className="sticker-card"
        style={{
          top: '28%',
          left: 'max(0.75rem, calc(50% - 660px))',
          animation: 'floatSlow3 8.5s ease-in-out infinite 0.8s',
          borderColor: 'rgba(6, 182, 212, 0.35)',
        }}
      >
        <div style={{ position: 'relative', width: '38px', height: '44px', flexShrink: 0 }}>
          {/* Folded Sheet SVG */}
          <svg width="38" height="44" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 6C4 3.79086 5.79086 2 8 2H24L34 12V38C34 40.2091 32.2091 42 30 42H8C5.79086 42 4 40.2091 4 38V6Z"
              fill="url(#pageGrad)"
              stroke="#22d3ee"
              strokeWidth="1.8"
            />
            {/* Folded Corner */}
            <path d="M24 2V10C24 11.1046 24.8954 12 26 12H34" fill="#0e7490" stroke="#22d3ee" strokeWidth="1.5" />
            {/* Lined notes */}
            <line x1="10" y1="18" x2="28" y2="18" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="24" x2="24" y2="24" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="30" x2="26" y2="30" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="pageGrad" x1="4" y1="2" x2="34" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#083344" />
                <stop offset="1" stopColor="#0e2a38" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Resume.pdf
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#22d3ee', fontWeight: 600 }}>
            ATS Verified 📄
          </div>
        </div>
      </div>

      {/* 3. Lower-Mid Left: Floating Ink Feather / Stylus */}
      <div
        className="sticker-card"
        style={{
          top: '52%',
          left: 'max(1.5rem, calc(50% - 635px))',
          animation: 'floatSlow2 6.8s ease-in-out infinite 1.4s',
          borderColor: 'rgba(245, 158, 11, 0.35)',
        }}
      >
        <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
          {/* Pen / Stylus SVG */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 33L12 28L10 26L5 31L4 36L9 35L7 33Z"
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M12 28L28 12C29.6569 10.3431 32.3431 10.3431 34 12C35.6569 13.6569 35.6569 16.3431 34 18L18 34L12 28Z"
              fill="url(#penGrad)"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            <circle cx="28" cy="14" r="2" fill="#fef08a" />
            <defs>
              <linearGradient id="penGrad" x1="12" y1="28" x2="34" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#78350f" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Direct Pitch
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#fbbf24', fontWeight: 600 }}>
            Curated Quill ✒️
          </div>
        </div>
      </div>

      {/* 4. Bottom-Left: Research Grant Scroll */}
      <div
        className="sticker-card"
        style={{
          top: '76%',
          left: 'max(1rem, calc(50% - 650px))',
          animation: 'floatSlow4 9s ease-in-out infinite 0.5s',
          borderColor: 'rgba(16, 185, 129, 0.35)',
        }}
      >
        <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="8" width="26" height="22" rx="4" fill="#064e3b" stroke="#34d399" strokeWidth="1.8" />
            <path d="M11 15H27M11 20H23M11 25H19" stroke="#6ee7b7" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="27" cy="24" r="5" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
            <path d="M25 24L26.5 25.5L29 23" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Fellowship Grant
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#34d399', fontWeight: 600 }}>
            $10,000 Stipend 📜
          </div>
        </div>
      </div>

      {/* ====================================================================
          RIGHT FLANK STICKERS
          ==================================================================== */}

      {/* 5. Top-Right: Idea Lightbulb & Sparkle */}
      <div
        className="sticker-card"
        style={{
          top: '9%',
          right: 'max(1.2rem, calc(50% - 630px))',
          animation: 'floatSlow2 7.5s ease-in-out infinite 0.4s',
          borderColor: 'rgba(245, 158, 11, 0.35)',
        }}
      >
        <div style={{ position: 'relative', width: '38px', height: '42px', flexShrink: 0 }}>
          <div
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%)',
              animation: 'pulseGlowRing 3.5s ease-in-out infinite',
            }}
          />
          {/* Bulb SVG */}
          <svg width="38" height="42" viewBox="0 0 38 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 4C12.3726 4 7 9.37258 7 16C7 20.3013 9.27137 24.0883 12.6974 26.2238C13.5186 26.7358 14 27.6323 14 28.6V30C14 31.1046 14.8954 32 16 32H22C23.1046 32 24 31.1046 24 30V28.6C24 27.6323 24.4814 26.7358 25.3026 26.2238C28.7286 24.0883 31 20.3013 31 16C31 9.37258 25.6274 4 19 4Z"
              fill="url(#bulbGrad)"
              stroke="#fbbf24"
              strokeWidth="1.8"
            />
            {/* Filament */}
            <path d="M15 17L17 12L21 20L23 15" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Base screw */}
            <path d="M15 35H23M17 38H21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="bulbGrad" x1="7" y1="4" x2="31" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#78350f" />
                <stop offset="0.6" stopColor="#b45309" />
                <stop offset="1" stopColor="#451a03" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Smart Match
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#fbbf24', fontWeight: 600 }}>
            98% Fit Score 💡
          </div>
        </div>
      </div>

      {/* 6. Mid-Right: Flying Hardcover Codex */}
      <div
        className="sticker-card"
        style={{
          top: '32%',
          right: 'max(0.75rem, calc(50% - 660px))',
          animation: 'floatSlow4 8.2s ease-in-out infinite 1.1s',
          borderColor: 'rgba(168, 85, 247, 0.35)',
        }}
      >
        <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
          {/* Hardcover book SVG */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="6" width="24" height="28" rx="3" fill="url(#hardGrad)" stroke="#c084fc" strokeWidth="1.8" />
            <line x1="13" y1="6" x2="13" y2="34" stroke="#e879f9" strokeWidth="2" />
            <path d="M19 14H26M19 19H24M19 24H25" stroke="#f3e8ff" strokeWidth="1.6" strokeLinecap="round" />
            {/* Bookmark */}
            <path d="M22 6V13L24 11.5L26 13V6" fill="#f43f5e" />
            <defs>
              <linearGradient id="hardGrad" x1="8" y1="6" x2="32" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b0764" />
                <stop offset="1" stopColor="#581c87" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Algorithm Handbook
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#c084fc', fontWeight: 600 }}>
            LeetCode Top 50 📚
          </div>
        </div>
      </div>

      {/* 7. Lower-Mid Right: Floating Code Terminal Sticker */}
      <div
        className="sticker-card"
        style={{
          top: '55%',
          right: 'max(1.5rem, calc(50% - 635px))',
          animation: 'floatSlow1 7.2s ease-in-out infinite 1.8s',
          borderColor: 'rgba(56, 189, 248, 0.35)',
        }}
      >
        <div style={{ position: 'relative', width: '42px', height: '34px', flexShrink: 0 }}>
          {/* Mini Window SVG */}
          <svg width="42" height="34" viewBox="0 0 42 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="38" height="30" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.6" />
            <circle cx="7" cy="8" r="1.5" fill="#f43f5e" />
            <circle cx="12" cy="8" r="1.5" fill="#f59e0b" />
            <circle cx="17" cy="8" r="1.5" fill="#10b981" />
            <path d="M7 17L12 21L7 25" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="25" x2="24" y2="25" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            npm run dream
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#38bdf8', fontWeight: 600 }}>
            Zero-Redirection ⚡
          </div>
        </div>
      </div>

      {/* 8. Bottom-Right: Floating Graduation Cap & Trophy */}
      <div
        className="sticker-card"
        style={{
          top: '78%',
          right: 'max(1rem, calc(50% - 650px))',
          animation: 'floatSlow3 8.8s ease-in-out infinite 0.7s',
          borderColor: 'rgba(99, 102, 241, 0.35)',
        }}
      >
        <div style={{ position: 'relative', width: '40px', height: '36px', flexShrink: 0 }}>
          {/* Grad Cap SVG */}
          <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4L36 12L20 20L4 12L20 4Z" fill="url(#capGrad)" stroke="#818cf8" strokeWidth="1.8" />
            <path d="M10 15V24C10 24 14 28 20 28C26 28 30 24 30 24V15" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" />
            {/* Tassel */}
            <path d="M36 12V22L34 25" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="34" cy="25" r="1.5" fill="#f59e0b" />
            <defs>
              <linearGradient id="capGrad" x1="4" y1="4" x2="36" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1e1b4b" />
                <stop offset="1" stopColor="#3730a3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Skillora Squad
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#a5b4fc', fontWeight: 600 }}>
            Winning Team 🎓
          </div>
        </div>
      </div>
    </div>
  )
}
