import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { calculateRelevance } from '../../../lib/relevance'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Fetch user profile and taxonomy
    const [profileRes, skillsRes, opportunitiesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_skills').select('skills(name)').eq('user_id', user.id),
      supabase.from('opportunities').select('*').eq('status', 'approved').limit(50),
    ])

    const userProfile = profileRes.data
    const userSkillNames = (skillsRes.data || [])
      .map((item: any) => item.skills?.name)
      .filter(Boolean) as string[]

    const opportunities = opportunitiesRes.data || []

    const scored = opportunities.map((opp) => {
      const breakdown = calculateRelevance(opp, userProfile, userSkillNames)
      return {
        ...opp,
        relevanceScore: breakdown.totalScore,
        relevanceBreakdown: breakdown,
      }
    })

    // Sort by highest score descending
    scored.sort((a, b) => b.relevanceScore - a.relevanceScore)

    return NextResponse.json({
      recommendations: scored.slice(0, 10),
      totalAvailable: scored.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch recommendations' }, { status: 500 })
  }
}
