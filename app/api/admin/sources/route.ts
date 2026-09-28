import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { adminSourceSchema } from '../../../../lib/validations'

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

    const { data: sources, error } = await supabase
      .from('opportunity_sources')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ sources: sources || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to list sources' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = await checkAdmin(supabase)

    if (!admin) {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 })
    }

    const body = await request.json()
    const validation = adminSourceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('opportunity_sources')
      .insert(validation.data)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log admin audit
    await supabase.from('audit_logs').insert({
      actor_id: admin.id,
      action: 'source.created',
      entity_type: 'source',
      entity_id: data.id,
      metadata: { name: data.name },
    })

    return NextResponse.json({ success: true, source: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to add source' }, { status: 500 })
  }
}
