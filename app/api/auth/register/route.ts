import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function supabaseInsertUser(payload: any) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase env vars not configured')
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/User`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
        const msg = data?.message || JSON.stringify(data)
        throw new Error(`Supabase insert failed: ${msg}`)
    }

    return data[0]
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password || password.length < 6) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        // Hash password and prepare user record
        const passwordHash = await bcrypt.hash(password, 10)
        const friendCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        const displayName = email.split('@')[0]

        // Insert using Supabase REST (service role key)
        const newUser = await supabaseInsertUser({
            email,
            passwordHash,
            friendCode,
            displayName,
        })

        // Create application session cookie (JWT)
        const token = createSession(newUser.id)
        const res = NextResponse.json({ success: true }, { status: 201 })
        res.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'lax',
            path: '/',
        })

        return res
    } catch (error: any) {
        console.error('Registration error detail:', {
            message: error.message,
            stack: error.stack,
        })
        return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 })
    }
}
