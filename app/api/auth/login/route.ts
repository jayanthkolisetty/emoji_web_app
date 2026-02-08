import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        await createSession(user.id)

        return NextResponse.json({ success: true, redirect: '/dashboard' })
    } catch (error: any) {
        console.error('Login error detail:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        })
        return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 })
    }
}
