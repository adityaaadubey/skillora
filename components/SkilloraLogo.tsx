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
      {/* Precision Squircle Emblem matching the official brand identity */}
      <div
        style={{
          width: `${box}px`,
          height: `${box}px`,
          borderRadius: `${radius}px`,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: `${font}px`,
          lineHeight: 1,
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Subtle glass reflection highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 100%)',
            borderTopLeftRadius: `${radius}px`,
            borderTopRightRadius: `${radius}px`,
            pointerEvents: 'none',
          }}
        />
        <span>S</span>
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
