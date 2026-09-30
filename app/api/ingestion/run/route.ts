import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import {
  computeDeduplicationHash,
  generateSlug,
  normalizeCanonicalUrl,
  checkDuplicate,
  RawOpportunityInput,
} from '../../../../lib/ingestion'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Authorization: either CRON_SECRET or authenticated admin
    const authHeader = request.headers.get('authorization')
    const isProd = process.env.NODE_ENV === 'production'
    const cronSecret = process.env.CRON_SECRET || (!isProd ? 'skillora_dev_cron_secret_secure_token_2026' : null)
    let isAuthorized = false

    if (authHeader && cronSecret && authHeader === `Bearer ${cronSecret}`) {
      isAuthorized = true
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile?.role === 'admin') {
          isAuthorized = true
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized ingestion trigger' }, { status: 401 })
    }

    // Fetch active sources
    const { data: sources, error: srcError } = await supabase
      .from('opportunity_sources')
      .select('*')
      .eq('enabled', true)

    if (srcError) {
      return NextResponse.json({ error: srcError.message }, { status: 500 })
    }

    // Fetch existing opportunities for deduplication lookup
    const { data: existingOpps } = await supabase
      .from('opportunities')
      .select('id, title, organization, deduplication_hash, canonical_url')

    const existingList = existingOpps || []

    const results = {
      processedSources: (sources || []).length,
      itemsIngested: 0,
      duplicatesSkipped: 0,
      errors: [] as string[],
    }

    // Simulated reliable feed items for the enabled sources
    const mockFeeds: Record<string, RawOpportunityInput[]> = {
      'MLH Hackathons RSS': [
        {
          title: 'Hack The Future 2026',
          organization: 'Major League Hacking',
          description: 'Global collegiate hackathon celebrating sustainable AI innovations and open source tooling.',
          category: 'hackathon',
          application_url: 'https://mlh.io/events/hack-the-future-2026?utm_source=feed&ref=newsletter',
          mode: 'hybrid',
          location: 'Bengaluru & Virtual',
          duration: '36 hours',
          pricing_type: 'free',
          prize_pool_min: 50000,
          prize_pool_max: 250000,
          currency: 'INR',
          deadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
          skills: ['Python', 'React', 'FastAPI', 'PyTorch'],
          tags: ['AI', 'Sustainability', 'Global'],
        },
        {
          title: 'CodeSprint Global Hack',
          organization: 'Major League Hacking',
          description: 'Spring hackathon for computer science and engineering undergraduates.',
          category: 'hackathon',
          application_url: 'https://mlh.io/events/codesprint-2026?utm_source=twitter',
          mode: 'remote',
          duration: '48 hours',
          pricing_type: 'free',
          prize_pool_max: 100000,
          currency: 'INR',
          deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
          skills: ['JavaScript', 'Next.js', 'PostgreSQL'],
          tags: ['Web', 'Beginner Friendly'],
        },
      ],
      'Google Summer of Code Feeds': [
        {
          title: 'Google Summer of Code 2026 Contributor',
          organization: 'Google Open Source',
          description: 'Global program focused on bringing new contributors into open source software development.',
          category: 'fellowship',
          application_url: 'https://summerofcode.withgoogle.com/apply?utm_campaign=gsoc2026',
          mode: 'remote',
          duration: '12 weeks',
          pricing_type: 'free',
          stipend_min: 150000,
          stipend_max: 250000,
          currency: 'INR',
          deadline: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
          skills: ['Git', 'Python', 'C++', 'Go', 'Rust'],
          tags: ['Open Source', 'Mentorship', 'Prestigious'],
        },
      ],
      'GitHub Student Developer Pack': [
        {
          title: 'GitHub Campus Expert Fellowship',
          organization: 'GitHub Education',
          description: 'Leadership and technical community program for active university student leaders.',
          category: 'fellowship',
          application_url: 'https://education.github.com/experts?ref=portal',
          mode: 'remote',
          duration: '6 months',
          pricing_type: 'free',
          stipend_max: 50000,
          currency: 'INR',
          deadline: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString(),
          skills: ['Public Speaking', 'Git', 'Open Source', 'Community Building'],
          tags: ['Leadership', 'Developer Advocacy'],
        },
      ],
    }

    for (const source of sources || []) {
      const items = mockFeeds[source.name] || []

      for (const item of items) {
        const hash = computeDeduplicationHash(item)
        const canonicalUrl = normalizeCanonicalUrl(item.application_url)

        // Record in ingested_items_raw
        const { error: rawErr } = await supabase.from('ingested_items_raw').upsert({
          source_id: source.id,
          payload_hash: hash,
          raw_payload: item as any,
          processing_status: 'pending',
        }, { onConflict: 'payload_hash' })

        if (rawErr) {
          results.errors.push(`Raw insert failed for ${item.title}: ${rawErr.message}`)
        }

        // Check deduplication against existing
        const dupCheck = checkDuplicate(item, existingList)

        if (dupCheck.isDuplicate) {
          results.duplicatesSkipped++
          await supabase
            .from('ingested_items_raw')
            .update({ processing_status: 'duplicate', processed_at: new Date().toISOString() })
            .eq('payload_hash', hash)
          continue
        }

        // Insert new approved opportunity
        const slug = generateSlug(item.title, item.organization)
        const { data: newOpp, error: oppErr } = await supabase
          .from('opportunities')
          .insert({
            title: item.title,
            slug,
            organization: item.organization,
            category: item.category,
            description: item.description,
            application_url: canonicalUrl,
            canonical_url: canonicalUrl,
            source_id: source.id,
            mode: item.mode || 'any',
            location: item.location,
            duration: item.duration,
            pricing_type: item.pricing_type || 'free',
            currency: item.currency || 'INR',
            stipend_min: item.stipend_min,
            stipend_max: item.stipend_max,
            prize_pool_min: item.prize_pool_min,
            prize_pool_max: item.prize_pool_max,
            deadline: item.deadline,
            skills: item.skills || [],
            tags: item.tags || [],
            status: 'approved',
            is_verified: true,
            deduplication_hash: hash,
          })
          .select('id, title, organization, deduplication_hash, canonical_url')
          .single()

        if (oppErr) {
          results.errors.push(`Failed to insert ${item.title}: ${oppErr.message}`)
        } else if (newOpp) {
          results.itemsIngested++
          existingList.push(newOpp)
          await supabase
            .from('ingested_items_raw')
            .update({ processing_status: 'processed', processed_at: new Date().toISOString() })
            .eq('payload_hash', hash)
        }
      }

      // Update source status
      await supabase
        .from('opportunity_sources')
        .update({
          last_fetched_at: new Date().toISOString(),
          error_count: 0,
          last_error: null,
        })
        .eq('id', source.id)
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: results,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Ingestion runner failed' }, { status: 500 })
  }
}
