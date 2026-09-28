'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, Calendar, Clock, Trash2, ExternalLink, Loader2, ArrowRight } from 'lucide-react'

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadReminders = () => {
    fetch('/api/user/export')
      .then((r) => r.json())
      .then((data) => {
        if (data.reminders) {
          setReminders(data.reminders)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadReminders()
  }, [])

  const handleDeleteReminder = async (opportunityId: string) => {
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/remind`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setReminders((prev) => prev.filter((r) => r.opportunity_id !== opportunityId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Deadline Reminders
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Configured notifications ensuring you submit before cutoff dates.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading reminders...</p>
        </div>
      ) : reminders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Bell size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No active reminders
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
            Set a reminder on any opportunity detail page to never miss an application deadline.
          </p>
          <Link href="/opportunities" className="btn btn-primary">
            <span>Discover Opportunities</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reminders.map((r) => (
            <div
              key={r.id}
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <Link href={`/opportunities/${r.opportunity_id}`}>
                    {r.opportunities?.title || 'Opportunity Reminder'}
                  </Link>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar size={14} color="var(--accent-amber)" />
                    <span>Scheduled for: {new Date(r.remind_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock size={14} color="var(--text-muted)" />
                    <span style={{ textTransform: 'capitalize' }}>Channel: {r.channel}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link
                  href={`/opportunities/${r.opportunity_id}`}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                >
                  <span>View</span>
                  <ExternalLink size={13} />
                </Link>

                <button
                  onClick={() => handleDeleteReminder(r.opportunity_id)}
                  title="Delete reminder"
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.625rem', color: 'var(--text-muted)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
