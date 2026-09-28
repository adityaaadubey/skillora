import test from 'node:test'
import assert from 'node:assert/strict'

import {
  normalizeCanonicalUrl,
  generateSlug,
  computeDeduplicationHash,
  calculateTextSimilarity,
  checkDuplicate,
} from '../lib/ingestion.ts'

test('Ingestion Engine - Canonical URL Normalization', () => {
  const dirtyUrl = 'https://mlh.io/events/hack-the-future?utm_source=feed&utm_campaign=spring2026&ref=hackathon_io/'
  const cleaned = normalizeCanonicalUrl(dirtyUrl)
  assert.equal(cleaned, 'https://mlh.io/events/hack-the-future')

  const trailingSlash = 'https://summerofcode.withgoogle.com/apply/'
  assert.equal(normalizeCanonicalUrl(trailingSlash), 'https://summerofcode.withgoogle.com/apply')
})

test('Ingestion Engine - Slug Generation', () => {
  const slug = generateSlug('Next.js Global Hackathon 2026!', 'Vercel & Google')
  assert.equal(slug, 'vercel-google-next-js-global-hackathon-2026')
})

test('Ingestion Engine - Exact Payload Hash Deduplication', () => {
  const itemA = {
    title: 'Summer Internship 2026',
    organization: 'Acme Technologies',
    application_url: 'https://acme.com/jobs/intern-2026?utm_medium=email',
    description: 'Software development intern',
    category: 'internship',
  }

  const itemB = {
    title: 'Summer Internship 2026',
    organization: 'Acme Technologies',
    application_url: 'https://acme.com/jobs/intern-2026?ref=campus_board',
    description: 'Software development intern (duplicate feed)',
    category: 'internship',
  }

  const hashA = computeDeduplicationHash(itemA)
  const hashB = computeDeduplicationHash(itemB)

  assert.equal(hashA, hashB, 'Both items must resolve to the identical SHA-256 hash')

  const existing = [{ title: itemA.title, organization: itemA.organization, deduplication_hash: hashA }]
  const dupCheck = checkDuplicate(itemB, existing)
  assert.equal(dupCheck.isDuplicate, true)
  assert.ok(dupCheck.matchReason?.includes('SHA-256'))
})

test('Ingestion Engine - Fuzzy Levenshtein Duplicate Detection', () => {
  const itemCandidate = {
    title: 'Google Summer of Code Contributor',
    organization: 'Google Open Source',
    application_url: 'https://summerofcode.withgoogle.com/apply-now',
    description: 'Contribute to open source projects',
    category: 'fellowship',
  }

  const existingList = [
    {
      title: 'Google Summer of Code 2026 Contributor',
      organization: 'Google Open Source',
      deduplication_hash: 'different_hash_123',
    },
  ]

  const dupCheck = checkDuplicate(itemCandidate, existingList)
  assert.equal(dupCheck.isDuplicate, true)
  assert.ok(dupCheck.matchReason?.includes('similarity'))
})
