import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { opportunityFilterSchema } from '../../../lib/validations'
import { calculateRelevance } from '../../../lib/relevance'
import { computeDeduplicationHash, generateSlug } from '../../../lib/ingestion'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawParams = {
      q: searchParams.get('q') || '',
      category: searchParams.get('category') || undefined,
      platform: searchParams.get('platform') || undefined,
      mode: searchParams.get('mode') || 'all',
      pricing_type: searchParams.get('pricing_type') || 'all',
      sort: searchParams.get('sort') || 'relevance',
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 12,
    }

    const validation = opportunityFilterSchema.safeParse(rawParams)
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid filter parameters', details: validation.error.flatten() }, { status: 400 })
    }

    const { q, category, platform, mode, pricing_type, sort, page, limit } = validation.data
    const supabase = await createClient()

    // Check optional authentication for personalized scoring
    const { data: { user } } = await supabase.auth.getUser()
    let userProfile = null
    let userSkillNames: string[] = []

    if (user) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      userProfile = p

      const { data: userSkills } = await supabase
        .from('user_skills')
        .select('skills(name)')
        .eq('user_id', user.id)

      if (userSkills) {
        userSkillNames = userSkills
          .map((item: any) => item.skills?.name)
          .filter(Boolean) as string[]
      }
    }

    let query = supabase
      .from('opportunities')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (platform && platform !== 'all') {
      query = query.eq('platform', platform)
    }

    if (mode && mode !== 'all') {
      query = query.eq('mode', mode)
    }

    if (pricing_type && pricing_type !== 'all') {
      query = query.eq('pricing_type', pricing_type)
    }

    if (q) {
      query = query.or(`title.ilike.%${q}%,organization.ilike.%${q}%,description.ilike.%${q}%`)
    }

    // Server-side ordering when not using custom client-side relevance
    if (sort === 'deadline_asc') {
      query = query.order('deadline', { ascending: true, nullsFirst: false })
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sort === 'stipend_desc') {
      query = query.order('stipend_max', { ascending: false, nullsFirst: false })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, count, error } = await query.range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Compute relevance scores and attach explanations
    const enriched = (data || []).map((opp) => {
      const breakdown = calculateRelevance(opp, userProfile, userSkillNames)
      return {
        ...opp,
        relevanceScore: breakdown.totalScore,
        relevanceBreakdown: breakdown,
      }
    })

    if (sort === 'relevance') {
      enriched.sort((a, b) => b.relevanceScore - a.relevanceScore)
    }

    return NextResponse.json(
      {
        data: enriched,
        pagination: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to list opportunities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const dedupHash = computeDeduplicationHash(body)
    const slug = generateSlug(body.title, body.organization)

    const { data, error } = await supabase.from('opportunities').insert({
      title: body.title,
      slug,
      organization: body.organization,
      category: body.category,
      subcategory: body.subcategory,
      description: body.description,
      mode: body.mode || 'any',
      location: body.location,
      duration: body.duration,
      eligibility_text: body.eligibility_text,
      pricing_type: body.pricing_type || 'free',
      price: body.price,
      currency: body.currency || 'INR',
      stipend_min: body.stipend_min,
      stipend_max: body.stipend_max,
      prize_pool_min: body.prize_pool_min,
      prize_pool_max: body.prize_pool_max,
      application_url: body.application_url,
      canonical_url: body.application_url,
      deadline: body.deadline,
      skills: body.skills || [],
      tags: body.tags || [],
      submitted_by: user.id,
      status: 'pending', // Pending moderation
      is_verified: false,
      is_featured: false,
      deduplication_hash: dedupHash,
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'opportunity.submitted',
      entity_type: 'opportunity',
      entity_id: data.id,
      metadata: { title: data.title },
    })

    return NextResponse.json({ success: true, opportunity: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Submission failed' }, { status: 500 })
  }
}
