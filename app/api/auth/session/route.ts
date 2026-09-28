import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ authenticated: false, user: null })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    const { count: savedCount } = await supabase
      .from('saved_opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        profile,
        savedCount: savedCount || 0,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch session' },
      { status: 500 }
    )
  }
}
