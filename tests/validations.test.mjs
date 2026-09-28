import test from 'node:test'
import assert from 'node:assert/strict'

import {
  loginSchema,
  signupSchema,
  opportunityFilterSchema,
  saveOpportunitySchema,
  createReminderSchema,
  reportOpportunitySchema,
  updateProfileSchema,
} from '../lib/validations/index.ts'
import {
  formatDeadline,
  getCategoryBadgeClass,
  formatCompensation,
} from '../lib/utils.ts'

test('Validations - Login Schema', () => {
  assert.equal(loginSchema.safeParse({ email: 'student@university.edu', password: 'Password123' }).success, true)
  assert.equal(loginSchema.safeParse({ email: 'invalid-email', password: '123' }).success, false)
})

test('Validations - Signup Schema', () => {
  assert.equal(signupSchema.safeParse({
    email: 'student@university.edu',
    password: 'Password123',
    fullName: 'Jane Doe',
    role: 'student'
  }).success, true)
  assert.equal(signupSchema.safeParse({
    email: 'student@university.edu',
    password: 'short',
    fullName: 'J',
    role: 'student'
  }).success, false)
})

test('Validations - Opportunity Filters', () => {
  const parsed = opportunityFilterSchema.safeParse({
    q: 'React',
    mode: 'remote',
    pricing_type: 'free',
    sort: 'relevance',
    page: '2',
  })
  assert.equal(parsed.success, true)
  if (parsed.success) {
    assert.equal(parsed.data.page, 2)
    assert.equal(parsed.data.mode, 'remote')
  }
})

test('Validations - Save Opportunity', () => {
  assert.equal(saveOpportunitySchema.safeParse({ status: 'applied', note: 'Done via portal' }).success, true)
  assert.equal(saveOpportunitySchema.safeParse({ status: 'invalid_status' }).success, false)
})

test('Validations - Profile Update', () => {
  const valid = updateProfileSchema.safeParse({
    full_name: 'Alex Rivera',
    college: 'Pune University',
    degree: 'B.Tech',
    branch: 'Computer Science',
    graduation_year: 2026,
    current_year: 3,
    cgpa: 8.9,
    preferred_categories: ['internship', 'hackathon'],
  })
  assert.equal(valid.success, true)
})

test('Canonical Utils - Category Badge Classes', () => {
  assert.equal(getCategoryBadgeClass('internship'), 'badge-indigo')
  assert.equal(getCategoryBadgeClass('hackathon'), 'badge-amber')
  assert.equal(getCategoryBadgeClass('scholarship'), 'badge-emerald')
  assert.equal(getCategoryBadgeClass('fellowship'), 'badge-cyan')
  assert.equal(getCategoryBadgeClass('unknown'), 'badge-indigo')
})

test('Canonical Utils - Deadline Formatting & Urgency', () => {
  assert.equal(formatDeadline(null).text, 'Rolling')
  assert.equal(formatDeadline(undefined).urgency, 'normal')

  const expiredDate = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  assert.equal(formatDeadline(expiredDate).urgency, 'expired')
  assert.equal(formatDeadline(expiredDate).text, 'Expired')

  const todayDate = new Date().toISOString()
  assert.equal(formatDeadline(todayDate).urgency, 'soon')

  const soonDate = new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString()
  assert.equal(formatDeadline(soonDate).urgency, 'soon')
  assert.ok(formatDeadline(soonDate).text.includes('d left'))
})

test('Canonical Utils - Compensation Formatting', () => {
  const stipend = formatCompensation({ stipend_min: 10000, stipend_max: 25000, currency: '₹' })
  assert.equal(stipend.type, 'stipend')
  assert.equal(stipend.label, '₹ 10,000 - 25,000')

  const prize = formatCompensation({ prize_pool_max: 50000, currency: '$' })
  assert.equal(prize.type, 'prize')
  assert.equal(prize.label, 'Prize $ 50,000')

  const free = formatCompensation({})
  assert.equal(free.type, 'free')
  assert.equal(free.label, 'Free Entry')
})
