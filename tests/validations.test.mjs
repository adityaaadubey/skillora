import test from 'node:test'
import assert from 'node:assert/strict'

import {
  sendOtpSchema,
  verifyOtpSchema,
  opportunityFilterSchema,
  saveOpportunitySchema,
  createReminderSchema,
  reportOpportunitySchema,
  updateProfileSchema,
} from '../lib/validations/index.ts'

test('Validations - Send OTP Schema', () => {
  assert.equal(sendOtpSchema.safeParse({ email: 'student@university.edu' }).success, true)
  assert.equal(sendOtpSchema.safeParse({ email: 'invalid-email' }).success, false)
  assert.equal(sendOtpSchema.safeParse({ email: '' }).success, false)
})

test('Validations - Verify OTP Schema', () => {
  assert.equal(verifyOtpSchema.safeParse({ email: 'student@university.edu', token: '123456' }).success, true)
  assert.equal(verifyOtpSchema.safeParse({ email: 'student@university.edu', token: '123' }).success, false)
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
