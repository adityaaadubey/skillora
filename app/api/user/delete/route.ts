import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userId = user.id

    // Log deletion event to audit before removing
    try {
      await supabase.from('audit_logs').insert({
        actor_id: userId,
        action: 'user.account_deleted',
        entity_type: 'user',
        entity_id: userId,
        metadata: { email: user.email },
      })
    } catch {
      // Non-fatal if audit logging fails
    }

    // Call stored procedure to delete from auth.users (cascades to all user tables)
    const { error: rpcError } = await supabase.rpc('delete_my_account', {
      p_user_id: userId,
    })

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message || 'Failed to delete account' },
        { status: 500 }
      )
    }

    // Sign out session cookies
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: 'Your Skillora account and all personal data have been permanently deleted.',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Server error while deleting account' },
      { status: 500 }
    )
  }
}
