import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../../lib/supabase/server'
import { reportOpportunitySchema } from '../../../../../lib/validations'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to file reports' }, { status: 401 })
    }

    const body = await request.json()
    const validation = reportOpportunitySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid report details', details: validation.error.flatten() }, { status: 400 })
    }

    const { reason, details } = validation.data

    const { data, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        opportunity_id: id,
        reason,
        details,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log audit event
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'report.created',
      entity_type: 'opportunity',
      entity_id: id,
      metadata: { reason },
    })

    return NextResponse.json({ success: true, report: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to submit report' }, { status: 500 })
  }
}
