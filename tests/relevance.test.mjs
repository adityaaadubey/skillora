import test from 'node:test'
import assert from 'node:assert/strict'

// Import relevance calculation logic
import { calculateRelevance } from '../lib/relevance.ts'

test('Relevance Engine - Baseline Unauthenticated Visitors', () => {
  const opp = {
    id: 'opp-1',
    title: 'Frontend Engineering Intern',
    organization: 'Acme Corp',
    category: 'internship',
    mode: 'remote',
    pricing_type: 'free',
    is_verified: true,
    is_featured: true,
    skills: ['React', 'TypeScript'],
  }

  const result = calculateRelevance(opp, null, [])
  assert.ok(result.totalScore >= 70, `Expected totalScore >= 70, got ${result.totalScore}`)
  assert.ok(result.explanationTags.includes('Verified Opportunity'))
  assert.ok(result.explanationTags.includes('Featured Program'))
})

test('Relevance Engine - Direct Skill Match & Remote Scoring', () => {
  const opp = {
    id: 'opp-2',
    title: 'Full Stack Fellow',
    organization: 'Open Source Lab',
    category: 'fellowship',
    mode: 'remote',
    pricing_type: 'free',
    is_verified: true,
    is_featured: false,
    skills: ['Python', 'PostgreSQL', 'Next.js'],
    deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(), // 5 days left
  }

  const profile = {
    id: 'user-1',
    preferred_categories: ['fellowship'],
    preferred_modes: ['remote'],
    preferred_locations: ['Bengaluru'],
  }

  // Matches 2 of 3 skills
  const userSkills = ['Python', 'PostgreSQL', 'Docker']

  const result = calculateRelevance(opp, profile, userSkills)

  // 2/3 skills = 66.6% of 35 = ~23
  assert.ok(result.skillScore >= 20, `Expected skillScore >= 20, got ${result.skillScore}`)
  // Category matches fellowship = 20
  assert.equal(result.categoryScore, 20)
  // Remote mode = 15
  assert.equal(result.locationScore, 15)
  // Urgency <= 7 days = 15
  assert.equal(result.urgencyScore, 15)
  // Trust = verified = 12
  assert.ok(result.trustScore >= 12)

  assert.ok(result.totalScore >= 80, `Expected totalScore >= 80, got ${result.totalScore}`)
  assert.ok(result.matchedSkills.includes('python'))
  assert.ok(result.matchedSkills.includes('postgresql'))
  assert.ok(result.missingSkills.includes('next.js'))
  assert.ok(result.explanationTags.some(t => t.includes('Closing in 5 days')))
})

test('Relevance Engine - Expired Deadline Penalty', () => {
  const opp = {
    id: 'opp-3',
    title: 'Old Hackathon',
    organization: 'Past Org',
    category: 'hackathon',
    mode: 'remote',
    skills: ['Java'],
    deadline: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago
  }

  const profile = { preferred_categories: ['hackathon'], preferred_modes: ['remote'] }
  const result = calculateRelevance(opp, profile, ['Java'])

  assert.equal(result.urgencyScore, 0, 'Expired deadlines must have urgencyScore 0')
})
