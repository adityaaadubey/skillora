'use client'

import React from 'react'
import Link from 'next/link'

interface SkilloraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  href?: string
  className?: string
}

export function SkilloraLogo({
  size = 'md',
  showText = true,
  href = '/',
  className = '',
}: SkilloraLogoProps) {
  const iconSizes = {
    sm: { box: 30, font: 16, radius: 8 },
    md: { box: 36, font: 20, radius: 10 },
    lg: { box: 44, font: 24, radius: 12 },
    xl: { box: 56, font: 32, radius: 16 },
  }

  const textSizes = {
    sm: '1.05rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '1.875rem',
  }

  const { box, font, radius } = iconSizes[size]

  const logoContent = (
    <div
      className={`skillora-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '0.5rem' : '0.625rem',
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      {/* Official Skillora Logo Emblem from GitHub / Repo */}
      <div
        style={{
          width: `${box}px`,
          height: `${box}px`,
          borderRadius: `${radius}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'transparent',
          filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.35))',
        }}
      >
        <img
          src="/logo-icon.png"
          alt="Skillora Official Logo"
          width={box}
          height={box}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/logo.png'
          }}
        />
      </div>

      {showText && (
        <span
          style={{
            fontSize: textSizes[size],
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'baseline',
          }}
        >
          <span style={{ color: 'var(--text-primary)' }}>Skill</span>
          <span
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
            }}
          >
            ora
          </span>
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
