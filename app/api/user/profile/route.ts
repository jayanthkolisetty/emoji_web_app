import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { username, displayName } = await req.json()

        if (!username || !displayName) {
            return NextResponse.json({ error: 'Missing username or display name' }, { status: 400 })
        }

        // Check if username is taken (by another user)
        const existing = await prisma.user.findUnique({ where: { username } })
        if (existing && existing.id !== session.userId) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
        }

        const updated = await prisma.user.update({
            where: { id: session.userId },
            data: { username, displayName },
        })

        return NextResponse.json({ user: updated })
    } catch (error) {
        console.error('Update profile error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
