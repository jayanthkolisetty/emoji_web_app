import { NextResponse } from 'next/server'

export async function GET() {
    const hasDbUrl = !!process.env.DATABASE_URL
    const dbUrlPrefix = process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'NONE'

    return NextResponse.json({
        envExists: hasDbUrl,
        prefix: dbUrlPrefix,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    })
}
