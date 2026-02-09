import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

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
