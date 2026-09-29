import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { computeDeduplicationHash, generateSlug, normalizeCanonicalUrl } from '../../../../lib/ingestion'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      organization,
      category,
      mode,
      location,
      duration,
      description,
      eligibility_text,
      stipend_max,
      prize_pool_max,
      deadline,
      skills,
      application_url,
      organizer_email,
      direct_apply_enabled,
    } = body

    if (!title || !organization || !category || !description) {
      return NextResponse.json(
        { error: 'Title, organization, category, and description are required.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const canonicalUrl = normalizeCanonicalUrl(application_url || 'https://skillora.in')
    const slug = generateSlug(title, organization)
    const dedupHash = computeDeduplicationHash({
      title,
      organization,
      category,
      description,
      application_url: canonicalUrl,
    })

    const newOpportunity = {
      title: title.trim(),
      slug,
      organization: organization.trim(),
      category,
      mode: mode || 'remote',
      location: location || 'Remote / Global',
      duration: duration || null,
      description: description.trim(),
      eligibility_text: eligibility_text || null,
      pricing_type: 'free',
      currency: 'INR',
      stipend_max: stipendMaxSafe(stipend_max),
      prize_pool_max: stipendMaxSafe(prize_pool_max),
      deadline: deadline || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      skills: Array.isArray(skills) ? skills : [],
      tags: direct_apply_enabled ? ['Direct Apply', 'Skillora Verified'] : ['Skillora Verified'],
      status: 'approved',
      is_verified: true,
      is_featured: true,
      application_url: canonicalUrl,
      canonical_url: canonicalUrl,
      deduplication_hash: dedupHash,
      submitted_by: user?.id ?? null,
    }

    const { data, error } = await supabase
      .from('opportunities')
      .insert(newOpportunity)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Opportunity published successfully on Skillora.',
      data,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to create opportunity' },
      { status: 500 }
    )
  }
}

function stipendMaxSafe(val: any): number | null {
  if (val === null || val === undefined || val === '') return null
  const num = Number(val)
  return isNaN(num) ? null : num
}
