import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const [
      profileRes,
      skillsRes,
      interestsRes,
      savedRes,
      remindersRes,
      consentsRes,
      applicationsRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_skills').select('*, skills(name, category)').eq('user_id', user.id),
      supabase.from('user_interests').select('*, interests(name, category)').eq('user_id', user.id),
      supabase.from('saved_opportunities').select('*, opportunities(title, organization, category)').eq('user_id', user.id),
      supabase.from('opportunity_reminders').select('*, opportunities(title)').eq('user_id', user.id),
      supabase.from('user_consents').select('*').eq('user_id', user.id),
      supabase.from('application_log').select('*, opportunities(title, organization)').eq('user_id', user.id),
    ])

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      account: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
      profile: profileRes.data,
      skills: (skillsRes.data || []).map((s: any) => ({ name: s.skills?.name, level: s.level })),
      interests: (interestsRes.data || []).map((i: any) => i.interests?.name),
      savedOpportunities: savedRes.data || [],
      reminders: remindersRes.data || [],
      privacyConsents: consentsRes.data || [],
      applicationActivity: applicationsRes.data || [],
    }

    // Record audit event
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'user.data_exported',
      entity_type: 'user',
      entity_id: user.id,
      metadata: { exportedAt: exportPayload.exportedAt },
    })

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="skillora-data-export-${user.id}.json"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Data export failed' }, { status: 500 })
  }
}
