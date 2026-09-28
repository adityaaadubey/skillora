import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../../lib/supabase/server'
import { saveOpportunitySchema } from '../../../../../lib/validations'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    let body = {}
    try {
      body = await request.json()
    } catch {
      // Body is optional on default save
    }

    const validation = saveOpportunitySchema.safeParse(body)
    const { status, note } = validation.success ? validation.data : { status: 'saved', note: null }

    const { data, error } = await supabase
      .from('saved_opportunities')
      .upsert(
        {
          user_id: user.id,
          opportunity_id: id,
          status,
          note,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,opportunity_id' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, saved: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to save opportunity' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { error } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', user.id)
      .eq('opportunity_id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Removed from saved' })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to remove saved opportunity' }, { status: 500 })
  }
}
