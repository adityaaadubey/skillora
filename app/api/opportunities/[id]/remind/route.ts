import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../../lib/supabase/server'
import { createReminderSchema } from '../../../../../lib/validations'

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

    const body = await request.json()
    const validation = createReminderSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid reminder options', details: validation.error.flatten() }, { status: 400 })
    }

    const { remind_at, channel } = validation.data

    const { data, error } = await supabase
      .from('opportunity_reminders')
      .upsert(
        {
          user_id: user.id,
          opportunity_id: id,
          remind_at,
          channel,
          status: 'pending',
        },
        { onConflict: 'user_id,opportunity_id' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, reminder: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create reminder' }, { status: 500 })
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
      .from('opportunity_reminders')
      .delete()
      .eq('user_id', user.id)
      .eq('opportunity_id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Reminder deleted' })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete reminder' }, { status: 500 })
  }
}
