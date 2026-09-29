import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      college,
      degree,
      yearOfStudy,
      portfolioUrl,
      resumeUrl,
      pitch,
    } = body

    if (!applicantName || !applicantEmail || !applicantPhone) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are required.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. Verify opportunity exists
    const { data: opp, error: oppErr } = await supabase
      .from('opportunities')
      .select('id, title, organization')
      .eq('id', id)
      .single()

    if (oppErr || !opp) {
      return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 })
    }

    // Generate unique verifiable application identifier
    const randomCode = Math.floor(100000 + Math.random() * 900000)
    const applicationId = `SKL-${new Date().getFullYear()}-${randomCode}`

    // 2. Enforce authentication for Direct Apply
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in or create an account to submit a direct application.' },
        { status: 401 }
      )
    }
      // Upsert into saved_opportunities with status 'applied' and rich note
      const applicationNote = JSON.stringify({
        applicationId,
        applicantName,
        applicantEmail,
        applicantPhone,
        college,
        degree,
        yearOfStudy,
        portfolioUrl,
        resumeUrl,
        pitch,
        appliedAt: new Date().toISOString(),
      })

      await supabase
        .from('saved_opportunities')
        .upsert({
          user_id: user.id,
          opportunity_id: id,
          status: 'applied',
          note: applicationNote,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,opportunity_id' })

    // 3. Log application click / submission in telemetry
    try {
      await supabase.from('application_log').insert({
        opportunity_id: id,
        user_id: user?.id ?? null,
      })
    } catch {
      // telemetry silent catch
    }

    return NextResponse.json({
      success: true,
      message: 'Direct application registered successfully with zero redirection.',
      applicationId,
      timestamp: new Date().toISOString(),
      opportunity: {
        id: opp.id,
        title: opp.title,
        organization: opp.organization,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to process application' },
      { status: 500 }
    )
  }
}
