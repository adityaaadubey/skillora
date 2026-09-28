export interface OpportunityInput {
  id?: string
  title?: string
  organization?: string
  category?: string
  mode?: string | null
  location?: string | null
  pricing_type?: string | null
  is_verified?: boolean | null
  is_featured?: boolean | null
  deadline?: string | null
  skills?: string[] | null
  [key: string]: any
}

export interface ProfileInput {
  id?: string
  preferred_categories?: string[] | null
  preferred_locations?: string[] | null
  preferred_modes?: string[] | null
  [key: string]: any
}

export interface RelevanceBreakdown {
  totalScore: number // 0 - 100
  skillScore: number // 0 - 35
  categoryScore: number // 0 - 20
  locationScore: number // 0 - 15
  urgencyScore: number // 0 - 15
  trustScore: number // 0 - 15
  matchedSkills: string[]
  missingSkills: string[]
  explanationTags: string[]
}

/**
 * Calculates a deterministic, explainable relevance score for an opportunity
 * given a user profile and list of user skills.
 */
export function calculateRelevance(
  opportunity: OpportunityInput,
  profile?: ProfileInput | null,
  userSkillNames: string[] = []
): RelevanceBreakdown {
  if (!profile && userSkillNames.length === 0) {
    // Baseline score for unauthenticated visitors
    const trustScore = opportunity.is_verified ? 15 : 8
    const tags: string[] = []
    if (opportunity.is_verified) tags.push('Verified Opportunity')
    if (opportunity.is_featured) tags.push('Featured Program')
    if (opportunity.pricing_type === 'free') tags.push('100% Free')
    
    return {
      totalScore: 50 + (opportunity.is_featured ? 15 : 0) + (opportunity.is_verified ? 10 : 0),
      skillScore: 0,
      categoryScore: 0,
      locationScore: 0,
      urgencyScore: 10,
      trustScore,
      matchedSkills: [],
      missingSkills: opportunity.skills || [],
      explanationTags: tags,
    }
  }

  const oppSkills = (opportunity.skills || []).map((s) => s.toLowerCase().trim())
  const normalizedUserSkills = userSkillNames.map((s) => s.toLowerCase().trim())

  // 1. Skill Match (Weight: 35%)
  const matchedSkills: string[] = []
  const missingSkills: string[] = []

  for (const s of oppSkills) {
    if (normalizedUserSkills.includes(s)) {
      matchedSkills.push(s)
    } else {
      missingSkills.push(s)
    }
  }

  let skillRatio = 0
  if (oppSkills.length > 0) {
    skillRatio = matchedSkills.length / oppSkills.length
  } else if (normalizedUserSkills.length > 0) {
    // If opportunity lists no specific skills, give partial credit
    skillRatio = 0.5
  }
  const skillScore = Math.round(skillRatio * 35)

  // 2. Category / Interest Preference (Weight: 20%)
  const userCategories = (profile?.preferred_categories || []).map((c) => c.toLowerCase().trim())
  const oppCategory = (opportunity.category || '').toLowerCase().trim()
  let categoryScore = 0
  if (userCategories.length > 0) {
    if (userCategories.includes(oppCategory)) {
      categoryScore = 20
    }
  } else {
    categoryScore = 10 // Neutral default
  }

  // 3. Location / Mode Compatibility (Weight: 15%)
  const userModes = (profile?.preferred_modes || []).map((m) => m.toLowerCase().trim())
  const oppMode = (opportunity.mode || 'any').toLowerCase().trim()
  let locationScore = 0

  if (oppMode === 'remote') {
    locationScore = 15 // Remote is universally compatible
  } else if (userModes.length === 0 || userModes.includes('any')) {
    locationScore = 10
  } else if (userModes.includes(oppMode)) {
    locationScore = 15
  } else {
    const userLocations = (profile?.preferred_locations || []).map((l) => l.toLowerCase().trim())
    const oppLocation = (opportunity.location || '').toLowerCase().trim()
    if (userLocations.some((loc) => oppLocation.includes(loc))) {
      locationScore = 12
    } else {
      locationScore = 5
    }
  }

  // 4. Urgency & Recency (Weight: 15%)
  let urgencyScore = 8
  const now = new Date().getTime()
  if (opportunity.deadline) {
    const deadlineTime = new Date(opportunity.deadline).getTime()
    const diffDays = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      urgencyScore = 0 // Expired
    } else if (diffDays <= 7) {
      urgencyScore = 15 // Closing soon! Highest priority
    } else if (diffDays <= 30) {
      urgencyScore = 12 // Optimal window
    } else {
      urgencyScore = 8 // Distant deadline
    }
  }

  // 5. Trust & Verification (Weight: 15%)
  let trustScore = 7
  if (opportunity.is_verified) trustScore += 5
  if (opportunity.is_featured) trustScore += 3
  trustScore = Math.min(15, trustScore)

  const totalScore = Math.min(100, skillScore + categoryScore + locationScore + urgencyScore + trustScore)

  // Construct transparent explanation tags
  const explanationTags: string[] = []
  if (matchedSkills.length > 0) {
    explanationTags.push(`Matches ${matchedSkills.length} of your skills (${matchedSkills.slice(0, 3).join(', ')})`)
  }
  if (oppMode === 'remote') {
    explanationTags.push('Remote friendly')
  } else if (locationScore >= 12) {
    explanationTags.push('Matches preferred location')
  }
  if (categoryScore === 20) {
    explanationTags.push(`Aligns with your interest in ${opportunity.category}`)
  }
  if (opportunity.deadline) {
    const deadlineTime = new Date(opportunity.deadline).getTime()
    const diffDays = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24))
    if (diffDays > 0 && diffDays <= 7) {
      explanationTags.push(`Closing in ${diffDays} day${diffDays === 1 ? '' : 's'}`)
    }
  }
  if (opportunity.is_verified) {
    explanationTags.push('Verified Provider')
  }

  return {
    totalScore,
    skillScore,
    categoryScore,
    locationScore,
    urgencyScore,
    trustScore,
    matchedSkills,
    missingSkills,
    explanationTags,
  }
}
