import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { consentSchema } from '../../../../lib/validations'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { data: consents, error } = await supabase
      .from('user_consents')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ consents: consents || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to retrieve consents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const validation = consentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid consent data', details: validation.error.flatten() }, { status: 400 })
    }

    const { consent_type, agreed } = validation.data

    const { data, error } = await supabase
      .from('user_consents')
      .upsert({
        user_id: user.id,
        consent_type,
        agreed,
        agreed_at: new Date().toISOString(),
        user_agent: request.headers.get('user-agent') || 'unknown',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, consent: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update consent' }, { status: 500 })
  }
}
