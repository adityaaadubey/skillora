import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { adminModerationSchema } from '../../../../lib/validations'

async function checkAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return null
  return user
}

export async function GET() {
  try {
    const supabase = await createClient()
    const admin = await checkAdmin(supabase)

    if (!admin) {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 })
    }

    const [pendingRes, reportsRes, auditRes] = await Promise.all([
      supabase.from('opportunities').select('*').order('created_at', { ascending: false }).limit(40),
      supabase.from('reports').select('*, opportunities(title, organization)').order('created_at', { ascending: false }).limit(40),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20),
    ])

    return NextResponse.json({
      opportunities: pendingRes.data || [],
      reports: reportsRes.data || [],
      auditLogs: auditRes.data || [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to retrieve moderation queue' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = await checkAdmin(supabase)

    if (!admin) {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 })
    }

    const validation = adminModerationSchema.safeParse(updates)
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 400 })
    }

    const payload = validation.data
    const updateData: any = {
      status: payload.status,
      moderation_reason: payload.moderation_reason,
      updated_at: new Date().toISOString(),
    }

    if (payload.status === 'approved') {
      updateData.is_verified = payload.is_verified ?? true
      updateData.verified_at = new Date().toISOString()
      updateData.verified_by = admin.id
    }

    if (payload.is_featured !== undefined) {
      updateData.is_featured = payload.is_featured
    }

    const { data, error } = await supabase
      .from('opportunities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log admin audit
    await supabase.from('audit_logs').insert({
      actor_id: admin.id,
      action: `opportunity.${payload.status}`,
      entity_type: 'opportunity',
      entity_id: id,
      metadata: { reason: payload.moderation_reason },
    })

    return NextResponse.json({ success: true, opportunity: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Moderation action failed' }, { status: 500 })
  }
}
