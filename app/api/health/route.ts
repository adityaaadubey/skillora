import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET() {
  const startTime = Date.now()
  let dbStatus = 'healthy'
  let dbLatencyMs = 0
  let errorMessage: string | null = null

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('opportunities')
      .select('id')
      .limit(1)

    dbLatencyMs = Date.now() - startTime

    if (error) {
      dbStatus = 'degraded'
      errorMessage = error.message
    }
  } catch (err: any) {
    dbStatus = 'unhealthy'
    errorMessage = err?.message || 'Database connection error'
    dbLatencyMs = Date.now() - startTime
  }

  const responseStatus = dbStatus === 'unhealthy' ? 503 : 200

  return NextResponse.json(
    {
      status: dbStatus === 'healthy' ? 'ok' : dbStatus,
      timestamp: new Date().toISOString(),
      service: 'Skillora Core Platform',
      version: '1.0.0',
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        ...(errorMessage && { error: errorMessage }),
      },
      environment: process.env.NODE_ENV || 'production',
    },
    { status: responseStatus }
  )
}
