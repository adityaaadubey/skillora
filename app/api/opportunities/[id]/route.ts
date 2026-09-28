import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { calculateRelevance } from '../../../../lib/relevance'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .select('*, opportunity_sources(name, trust_score)')
      .eq('id', id)
      .single()

    if (error || !opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
    }

    // Check optional authenticated user details
    const { data: { user } } = await supabase.auth.getUser()
    let isSaved = false
    let savedRecord = null
    let reminder = null
    let relevance = null

    if (user) {
      const [savedRes, reminderRes, profileRes, skillsRes] = await Promise.all([
        supabase.from('saved_opportunities').select('*').eq('user_id', user.id).eq('opportunity_id', id).maybeSingle(),
        supabase.from('opportunity_reminders').select('*').eq('user_id', user.id).eq('opportunity_id', id).maybeSingle(),
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('user_skills').select('skills(name)').eq('user_id', user.id),
      ])

      if (savedRes.data) {
        isSaved = true
        savedRecord = savedRes.data
      }

      reminder = reminderRes.data || null

      const userSkillNames = (skillsRes.data || [])
        .map((item: any) => item.skills?.name)
        .filter(Boolean) as string[]

      relevance = calculateRelevance(opportunity, profileRes.data, userSkillNames)

      // Log application click / view in audit
      await supabase.from('application_log').insert({
        user_id: user.id,
        opportunity_id: id,
      })
    }

    return NextResponse.json({
      opportunity,
      isSaved,
      savedRecord,
      reminder,
      relevance,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to retrieve opportunity' }, { status: 500 })
  }
}
