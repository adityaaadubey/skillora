import test from 'node:test'
import assert from 'node:assert/strict'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xrxrxgygnuqkbexzvxas.supabase.co'
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeHJ4Z3lnbnVxa2JleHp2eGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0OTM3NTYsImV4cCI6MjEwNjA2OTc1Nn0.CROromjBhBnigD9Gn4XrLRWb57lawOm1Vkwr3zlMr14'

test('RLS Audit - Anonymous Read on Public Opportunities', async () => {
  const anonClient = createClient(SUPABASE_URL, ANON_KEY)
  const { data, error } = await anonClient
    .from('opportunities')
    .select('id, title, category, status')
    .eq('status', 'approved')
    .limit(3)

  assert.equal(error, null, 'Public opportunities should be readable by anonymous role')
  assert.ok(Array.isArray(data), 'Result must be an array')
})

test('RLS Audit - Anonymous Cannot Read Ingested Raw Items', async () => {
  const anonClient = createClient(SUPABASE_URL, ANON_KEY)
  const { data, error } = await anonClient
    .from('ingested_items_raw')
    .select('*')

  // Under RLS, selecting from an admin-only table returns empty array or error
  assert.ok(data?.length === 0 || error !== null, 'Anonymous role must not have access to ingested_items_raw')
})

test('RLS Audit - Anonymous Cannot Insert into Saved Opportunities', async () => {
  const anonClient = createClient(SUPABASE_URL, ANON_KEY)
  const { data, error } = await anonClient
    .from('saved_opportunities')
    .insert({
      opportunity_id: '00000000-0000-0000-0000-000000000000',
      user_id: '00000000-0000-0000-0000-000000000000',
    })

  assert.ok(error !== null, 'Anonymous insert into saved_opportunities must be rejected by RLS')
})
