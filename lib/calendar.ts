/**
 * Skillora 1-Click Calendar Sync Utilities
 * Generates Google Calendar URLs and downloadable .ics files for Apple / Outlook Calendar
 */

export interface CalendarEvent {
  title: string
  description?: string | null
  location?: string | null
  deadline?: string | null
  url?: string | null
}

function formatIcsDate(d: Date): string {
  return d.toISOString().replace(/-|:|\.\d\d\d/g, '')
}

/**
 * Generates a direct 1-click Google Calendar Event Creation URL
 */
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  if (!event.deadline) return '#'

  const date = new Date(event.deadline)
  // Default notification event: 1 hour before deadline to deadline
  const start = new Date(date.getTime() - 60 * 60 * 1000)
  const dates = `${formatIcsDate(start)}/${formatIcsDate(date)}`

  const details = [
    event.description ? `${event.description.slice(0, 250)}...` : '',
    '',
    `Apply Link: ${event.url || 'https://skillora-live.vercel.app'}`,
    'Synchronized deterministically via Skillora Student Opportunity Intelligence.',
  ]
    .filter(Boolean)
    .join('\n')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `⚡ Deadline: ${event.title}`,
    dates: dates,
    details: details,
    location: event.location || 'Online',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generates and triggers instant download of an Apple / Outlook / Mobile .ics calendar file
 */
export function downloadIcsFile(event: CalendarEvent): void {
  if (typeof window === 'undefined' || !event.deadline) return

  const date = new Date(event.deadline)
  const start = new Date(date.getTime() - 60 * 60 * 1000)

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Skillora//Student Opportunity Intelligence//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).substring(2, 9)}@skillora.live`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(date)}`,
    `SUMMARY:⚡ Deadline: ${event.title}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n').slice(0, 300)}`,
    `URL:${event.url || 'https://skillora-live.vercel.app'}`,
    `LOCATION:${event.location || 'Online'}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Skillora Opportunity Deadline Tomorrow',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_deadline.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
}
