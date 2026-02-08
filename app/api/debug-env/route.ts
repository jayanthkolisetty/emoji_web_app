import { NextResponse } from 'next/server'

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || ''
    const hasDbUrl = !!dbUrl
    const protocol = dbUrl.split(':')[0] || 'NONE'

    return NextResponse.json({
        envExists: hasDbUrl,
        protocol: protocol,
        length: dbUrl.length,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        tip: protocol.startsWith('http') ? 'FAIL: You used the https URL instead of the postgresql Connection String!' : 'Protocol check'
    })
}
