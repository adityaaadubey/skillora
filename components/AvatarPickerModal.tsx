'use client'

import React, { useState } from 'react'
import { X, Check, Sparkles, Image as ImageIcon } from 'lucide-react'
import { AVATAR_PRESETS, AvatarPreset } from '../lib/gamification'

interface AvatarPickerModalProps {
  isOpen: boolean
  onClose: () => void
  currentAvatar: string
  onSelectAvatar: (avatarIdentifier: string) => void
}

export function AvatarPickerModal({
  isOpen,
  onClose,
  currentAvatar,
  onSelectAvatar,
}: AvatarPickerModalProps) {
  const [customUrl, setCustomUrl] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  if (!isOpen) return null

  const handleSelect = (preset: AvatarPreset) => {
    onSelectAvatar(preset.emoji)
    onClose()
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customUrl.trim()) {
      onSelectAvatar(customUrl.trim())
      onClose()
    }
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
        background: 'rgba(0, 0, 0, 0.8)',
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
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-glass-card)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.2)',
          position: 'relative',
        }}
      >
        {/* Header */}
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
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Choose Your Student Avatar
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Select a high-tech identity that reflects your track and personality
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '32px',
              height: '32px',
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
            <X size={16} />
          </button>
        </div>

        {/* Preset Avatars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.5rem',
          }}
        >
          {AVATAR_PRESETS.map((preset) => {
            const isSelected = currentAvatar === preset.emoji
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelect(preset)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.85rem 0.6rem',
                  borderRadius: 'var(--radius-lg)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
                  border: isSelected
                    ? '2px solid var(--accent-indigo)'
                    : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.18s ease',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = preset.border
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-subtle)'
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'var(--accent-indigo)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                    }}
                  >
                    <Check size={11} />
                  </div>
                )}

                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: preset.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    marginBottom: '0.5rem',
                    boxShadow: `0 4px 15px ${preset.border}44`,
                  }}
                >
                  {preset.emoji}
                </div>

                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem', lineHeight: 1.2 }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                  {preset.role}
                </div>
              </button>
            )
          })}
        </div>

        {/* Custom Avatar URL Accordion */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem' }}
          >
            <ImageIcon size={14} />
            <span>{showCustomInput ? 'Hide Custom Avatar URL' : 'Or Use Custom Image / WebP URL'}</span>
          </button>

          {showCustomInput && (
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or GitHub avatar URL"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="form-input"
                style={{ flex: 1, fontSize: '0.82rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}>
                Set Image
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
