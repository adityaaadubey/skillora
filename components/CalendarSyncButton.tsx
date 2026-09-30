'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown, Check, ExternalLink, Download } from 'lucide-react'
import { getGoogleCalendarUrl, downloadIcsFile, CalendarEvent } from '../lib/calendar'

interface CalendarSyncButtonProps {
  event: CalendarEvent
  compact?: boolean
}

export function CalendarSyncButton({ event, compact = false }: CalendarSyncButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!event.deadline) return null

  const googleUrl = getGoogleCalendarUrl(event)

  const handleIcsDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    downloadIcsFile(event)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setOpen(false)
    }, 1500)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(!open)
        }}
        className={compact ? 'btn btn-secondary' : 'btn btn-secondary'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: compact ? '0.35rem 0.6rem' : '0.625rem 0.875rem',
          fontSize: compact ? '0.75rem' : '0.875rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
        }}
        aria-label="Add deadline to calendar"
        title="Sync deadline with your calendar"
      >
        <Calendar size={compact ? 13 : 15} color="var(--accent-indigo)" />
        <span>{compact ? 'Sync' : 'Add to Calendar'}</span>
        <ChevronDown size={13} style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 70,
            minWidth: '210px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
            padding: '0.375rem',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.8125rem',
              fontWeight: 500,
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>📅</span>
              <span>Google Calendar</span>
            </div>
            <ExternalLink size={12} style={{ opacity: 0.6 }} />
          </a>

          <button
            type="button"
            onClick={handleIcsDownload}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              background: 'transparent',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={14} color="var(--accent-cyan)" />
              <span>Apple / Outlook (.ics)</span>
            </div>
            {copied && <Check size={12} color="#10b981" />}
          </button>
        </div>
      )}
    </div>
  )
}
