import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { verifyOtpSchema } from '../../../../lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = verifyOtpSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid verification token format', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { email, token } = validation.data
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || 'Verification failed. Token may be invalid or expired.' },
        { status: 401 }
      )
    }

    // Ensure profile row exists
    const user = data.user
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, full_name, is_profile_complete')
      .eq('id', user.id)
      .maybeSingle()

    if (!existingProfile) {
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        role: 'student',
        is_profile_complete: false,
        profile_completion_pct: 15,
      })
    }

    // Record audit event
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'auth.otp_verified',
      entity_type: 'user',
      entity_id: user.id,
      metadata: { email: user.email },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isNewUser: !existingProfile || !existingProfile.is_profile_complete,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Authentication error' },
      { status: 500 }
    )
  }
}
