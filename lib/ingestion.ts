import { createHash } from 'crypto'

export interface RawOpportunityInput {
  title: string
  organization: string
  description: string
  category: string
  subcategory?: string
  application_url: string
  source_url?: string
  mode?: string
  location?: string
  duration?: string
  eligibility_text?: string
  pricing_type?: string
  price?: number
  currency?: string
  stipend_min?: number
  stipend_max?: number
  prize_pool_min?: number
  prize_pool_max?: number
  deadline?: string
  skills?: string[]
  tags?: string[]
}

/**
 * Normalizes a URL by stripping tracking parameters (utm_*, ref, etc.),
 * protocol casing, and trailing slashes.
 */
export function normalizeCanonicalUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.hash = ''
    
    // Remove typical tracking queries
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'ref',
      'source',
      'fbclid',
      'gclid',
      'trk',
    ]
    trackingParams.forEach((param) => parsed.searchParams.delete(param))

    let result = parsed.toString()
    if (result.endsWith('/') && parsed.pathname !== '/') {
      result = result.slice(0, -1)
    }
    return result
  } catch {
    return url.trim().toLowerCase()
  }
}

/**
 * Generates a clean URL slug from title and organization.
 */
export function generateSlug(title: string, organization: string): string {
  const base = `${organization}-${title}`
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 100)
}

/**
 * Computes a SHA-256 deduplication hash for an opportunity item.
 */
export function computeDeduplicationHash(item: RawOpportunityInput): string {
  const canonicalUrl = normalizeCanonicalUrl(item.application_url)
  const normTitle = item.title.trim().toLowerCase()
  const normOrg = item.organization.trim().toLowerCase()
  const payload = `${normOrg}::${normTitle}::${canonicalUrl}`
  
  return createHash('sha256').update(payload).digest('hex')
}

/**
 * Levenshtein distance similarity calculation (0.0 to 1.0)
 */
export function calculateTextSimilarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim()
  const s2 = b.toLowerCase().trim()
  if (s1 === s2) return 1.0
  if (s1.length === 0 || s2.length === 0) return 0.0

  const matrix: number[][] = []
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  const distance = matrix[s2.length][s1.length]
  const maxLength = Math.max(s1.length, s2.length)
  return 1.0 - distance / maxLength
}

/**
 * Checks if a candidate is a duplicate of an existing opportunity
 */
export function checkDuplicate(
  candidate: RawOpportunityInput,
  existingList: Array<{ title: string; organization: string; deduplication_hash?: string | null }>
): { isDuplicate: boolean; matchReason?: string; matchedItem?: any } {
  const candidateHash = computeDeduplicationHash(candidate)

  for (const item of existingList) {
    // 1. Exact hash match
    if (item.deduplication_hash && item.deduplication_hash === candidateHash) {
      return { isDuplicate: true, matchReason: 'Exact SHA-256 payload hash match', matchedItem: item }
    }

    // 2. Organization match + high title similarity
    const orgSim = calculateTextSimilarity(item.organization, candidate.organization)
    if (orgSim >= 0.85) {
      const titleSim = calculateTextSimilarity(item.title, candidate.title)
      if (titleSim >= 0.85) {
        return {
          isDuplicate: true,
          matchReason: `High fuzzy similarity (Org: ${(orgSim * 100).toFixed(0)}%, Title: ${(titleSim * 100).toFixed(0)}%)`,
          matchedItem: item,
        }
      }
    }
  }

  return { isDuplicate: false }
}
