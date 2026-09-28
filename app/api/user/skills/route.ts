import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { updateSkillsSchema } from '../../../../lib/validations'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const [skillsRes, interestsRes, allSkillsRes] = await Promise.all([
      supabase.from('user_skills').select('level, skills(id, name, category)').eq('user_id', user.id),
      supabase.from('user_interests').select('interests(id, name, category)').eq('user_id', user.id),
      supabase.from('skills').select('name, category').limit(100),
    ])

    const userSkills = (skillsRes.data || []).map((item: any) => ({
      name: item.skills?.name,
      category: item.skills?.category,
      level: item.level,
    })).filter((s) => s.name)

    const userInterests = (interestsRes.data || []).map((item: any) => item.interests?.name).filter(Boolean)

    return NextResponse.json({
      skills: userSkills,
      interests: userInterests,
      availableTaxonomy: (allSkillsRes.data || []).map((s) => s.name),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to retrieve skills' }, { status: 500 })
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
    const validation = updateSkillsSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 400 })
    }

    const { skills, interests } = validation.data

    // Use RPC function
    const { error: rpcError } = await supabase.rpc('save_profile_taxonomy', {
      p_user_id: user.id,
      p_skills: skills,
      p_interests: interests,
    })

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Skills and interests updated successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to save skills' }, { status: 500 })
  }
}
