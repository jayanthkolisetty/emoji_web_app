import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password || password.length < 6) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
        }

        // Hash password and prepare user record
        const passwordHash = await bcrypt.hash(password, 10)
        const friendCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        const displayName = email.split('@')[0]

        // Create user with Prisma
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                friendCode,
                displayName,
            },
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
