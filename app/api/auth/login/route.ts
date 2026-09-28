import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { loginSchema } from '../../../../lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email or password format', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = validation.data
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || 'Invalid email or password. Please try again.' },
        { status: 401 }
      )
    }

    // Retrieve user profile to confirm role
    let profile: any = null
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, role, is_profile_complete')
        .eq('id', data.user.id)
        .maybeSingle()
      profile = profileData
    } catch {
      // Non-fatal
    }

    // Log audit (non-blocking)
    try {
      await supabase.from('audit_logs').insert({
        actor_id: data.user.id,
        action: 'auth.password_login',
        entity_type: 'user',
        entity_id: data.user.id,
        metadata: { email: data.user.email, role: profile?.role || 'student' },
      })
    } catch {
      // Non-fatal
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'student',
        fullName: profile?.full_name,
        isProfileComplete: profile?.is_profile_complete,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
