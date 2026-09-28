import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { updateProfileSchema } from '../../../../lib/validations'

function calculateCompletion(data: any): number {
  let score = 0
  if (data.full_name?.trim()) score += 15
  if (data.college?.trim()) score += 15
  if (data.degree?.trim() && data.branch?.trim()) score += 15
  if (data.graduation_year) score += 10
  if (data.bio?.trim()) score += 10
  if (data.location?.trim()) score += 10
  if (data.preferred_categories?.length > 0) score += 15
  if (data.career_interests?.length > 0) score += 10
  return Math.min(100, score)
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to retrieve profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const validation = updateProfileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 400 })
    }

    const payload = validation.data
    const completionPct = calculateCompletion(payload)
    const isComplete = completionPct >= 60

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...payload,
        profile_completion_pct: completionPct,
        is_profile_complete: isComplete,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'profile.updated',
      entity_type: 'profile',
      entity_id: user.id,
      metadata: { completionPct },
    })

    return NextResponse.json({ success: true, profile: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update profile' }, { status: 500 })
  }
}
