'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Sparkles, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function BrandHeroShowcase() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: '820px',
        margin: '0 auto 2.5rem',
        padding: '2.5rem 1.5rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.35) 0%, rgba(15, 23, 42, 0.5) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        boxShadow: isHovered
          ? '0 25px 60px -15px rgba(99, 102, 241, 0.35), 0 0 40px rgba(56, 189, 248, 0.2)'
          : '0 20px 50px -20px rgba(99, 102, 241, 0.22), 0 0 25px rgba(99, 102, 241, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Ambient Glow Layers */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(56, 189, 248, 0.18) 45%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'pulseGlow 6s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <style jsx>{`
        @keyframes pulseGlow {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.95;
          }
        }
        @keyframes floatLogo {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(0.5deg);
          }
        }
        @keyframes shimmerBorder {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>

      {/* Foreground Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Floating Telemetry Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.9rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)',
          }}
        >
          <Sparkles size={13} />
          <span>Official Verified Platform Identity</span>
        </div>

        {/* Centerpiece: Real Official Brand Logo Image from Repository */}
        <div
          style={{
            position: 'relative',
            width: '240px',
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'floatLogo 5s ease-in-out infinite',
            filter: isHovered
              ? 'drop-shadow(0 20px 30px rgba(99, 102, 241, 0.55)) drop-shadow(0 0 50px rgba(56, 189, 248, 0.4))'
              : 'drop-shadow(0 15px 25px rgba(99, 102, 241, 0.4)) drop-shadow(0 0 30px rgba(99, 102, 241, 0.25))',
            transition: 'filter 0.4s ease',
          }}
        >
          <img
            src="/logo-full.png"
            alt="Skillora Official Logo"
            width={240}
            height={240}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo.png'
            }}
          />
        </div>

        {/* Sub-Brand Heading & Value Proposition */}
        <div style={{ textAlign: 'center', maxWidth: '580px' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #a5b4fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Skillora Autonomous Intelligence
          </h2>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Direct 1-click in-app applications across Google, MLH, Devfolio & 10+ global pipes. Zero redirects. 100% spam-free.
          </p>
        </div>

        {/* Live System Feature Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              color: '#34d399',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={14} />
            <span>100% Verified Only</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              color: '#a5b4fc',
              fontWeight: 600,
            }}
          >
            <Zap size={14} />
            <span>1-Click Direct Apply</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              color: '#38bdf8',
              fontWeight: 600,
            }}
          >
            <Globe size={14} />
            <span>10+ Global Pipes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
