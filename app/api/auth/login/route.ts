import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function supabaseGetUserByEmail(email: string) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase env vars not configured')
    }

    const url = `${SUPABASE_URL}/rest/v1/User?email=eq.${encodeURIComponent(email)}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            Accept: 'application/json',
        },
    })

    const data = await res.json()
    if (!res.ok) {
        const msg = data?.message || JSON.stringify(data)
        throw new Error(`Supabase query failed: ${msg}`)
    }

    return data[0]
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
        }

        const user = await supabaseGetUserByEmail(email)
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const token = createSession(user.id)
        const res = NextResponse.json({ success: true, redirect: '/dashboard' })
        res.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'lax',
            path: '/',
        })

        return res
    } catch (error: any) {
        console.error('Login error detail:', { message: error.message, stack: error.stack })
        return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 })
    }
}
