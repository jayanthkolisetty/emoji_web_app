import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()
        process.stdout.write(`\n>>> LOGIN ATTEMPT: ${email}\n`)

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
        }

        console.log('Fetching user from DB...')
        const user = await prisma.user.findUnique({ where: { email } })
        console.log('User found:', !!user)
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        console.log('Comparing passwords...')
        const isValid = await bcrypt.compare(password, user.passwordHash)
        console.log('Password valid:', isValid)
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        console.log('Creating session...')
        const token = createSession(user.id)
        console.log('Session token created')

        const res = NextResponse.json({ success: true, redirect: '/dashboard' })
        // set cookie on the response
        res.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            sameSite: 'lax',
            path: '/',
        })

        return res
    } catch (error: any) {
        console.error('Login error detail:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        })
        return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 })
    }
}
