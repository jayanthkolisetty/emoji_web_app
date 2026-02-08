import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password || password.length < 6) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        // Generate unique friend code
        const friendCode = Math.random().toString(36).substring(2, 8).toUpperCase()

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                friendCode,
                displayName: email.split('@')[0], // Default display name
            },
        })

        await createSession(newUser.id)

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error: any) {
        console.error('Registration error detail:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            // Adding more details if available, e.g., request body (if not sensitive)
            // or specific error type if it's a known error.
            // For now, the existing stack and code already provide good detail.
        })
        return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 })
    }
}
