import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { signupSchema } from '../../../../lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = signupSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const {
      email,
      password,
      fullName,
      role,
      college,
      degree,
      graduationYear,
      organizationName,
      organizationType,
      website,
    } = validation.data

    const supabase = await createClient()

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          college: college || null,
          degree: degree || null,
          graduation_year: graduationYear || null,
          organization_name: organizationName || null,
          organization_type: organizationType || null,
          website: website || null,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    const user = data.user
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // If identities array is empty, this email already exists in Supabase
    if (user.identities && user.identities.length === 0) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      )
    }

    // Automatically sign in with password so cookies are established immediately
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    const activeUser = signInData?.user || user

    // Ensure profile exists and has role & details
    try {
      await supabase.from('profiles').upsert({
        id: activeUser.id,
        email: activeUser.email,
        full_name: fullName,
        role,
        college: role === 'student' ? college || null : null,
        degree: role === 'student' ? degree || null : null,
        graduation_year: role === 'student' ? graduationYear || null : null,
        is_profile_complete: true,
        profile_completion_pct: 100,
      })

      if (role === 'organizer') {
        await supabase.from('organizer_profiles').upsert({
          id: activeUser.id,
          organization_name: organizationName || fullName,
          organization_type: organizationType || 'Tech Company',
          website: website || null,
          verified: false,
        })
      }

      await supabase.from('user_roles').upsert({
        user_id: activeUser.id,
        role,
      })
    } catch (profileErr) {
      console.warn('Profile sync non-fatal warning:', profileErr)
    }

    return NextResponse.json({
      success: true,
      session: true,
      user: {
        id: activeUser.id,
        email: activeUser.email,
        role,
        fullName,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to process account registration' },
      { status: 500 }
    )
  }
}
