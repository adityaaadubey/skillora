/**
 * Shared utility functions and canonical formatters for Skillora
 */

export interface DeadlineInfo {
  text: string
  urgency: 'normal' | 'soon' | 'expired'
  formattedDate: string
  diffDays: number
}

/**
 * Returns canonical CSS class name for opportunity category badge
 */
export function getCategoryBadgeClass(category?: string | null): string {
  switch (category?.toLowerCase()) {
    case 'internship':
      return 'badge-indigo'
    case 'hackathon':
      return 'badge-amber'
    case 'scholarship':
      return 'badge-emerald'
    case 'fellowship':
      return 'badge-cyan'
    default:
      return 'badge-indigo'
  }
}

/**
 * Computes deterministic deadline urgency, remaining days, and display label
 */
export function formatDeadline(deadline?: string | null): DeadlineInfo {
  if (!deadline) {
    return {
      text: 'Rolling',
      urgency: 'normal',
      formattedDate: 'Rolling Basis',
      diffDays: 999,
    }
  }

  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const formattedDate = deadlineDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (diffDays < 0) {
    return { text: 'Expired', urgency: 'expired', formattedDate, diffDays }
  }
  if (diffDays === 0) {
    return { text: 'Ends Today!', urgency: 'soon', formattedDate, diffDays }
  }
  if (diffDays <= 7) {
    return { text: `${diffDays}d left`, urgency: 'soon', formattedDate, diffDays }
  }

  return {
    text: deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    urgency: 'normal',
    formattedDate,
    diffDays,
  }
}

/**
 * Canonical compensation formatter across cards and detail pages
 */
export function formatCompensation(opp: {
  stipend_min?: number | null
  stipend_max?: number | null
  prize_pool_min?: number | null
  prize_pool_max?: number | null
  currency?: string | null
}): { type: 'stipend' | 'prize' | 'free'; label: string } {
  const currency = opp.currency || '₹'

  if (opp.stipend_max) {
    const minPart = opp.stipend_min ? `${opp.stipend_min.toLocaleString()} - ` : ''
    return {
      type: 'stipend',
      label: `${currency} ${minPart}${opp.stipend_max.toLocaleString()}`,
    }
  }

  if (opp.prize_pool_max) {
    return {
      type: 'prize',
      label: `Prize ${currency} ${opp.prize_pool_max.toLocaleString()}`,
    }
  }

  return {
    type: 'free',
    label: 'Free Entry',
  }
}
