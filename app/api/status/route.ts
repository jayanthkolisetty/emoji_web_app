import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { getVibeLabel } from '@/lib/vibe-agent'

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { emoji, statusMessage } = await req.json()

        if (!emoji) {
            return NextResponse.json({ error: 'Missing emoji' }, { status: 400 })
        }

        const vibeLabel = getVibeLabel(emoji)

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: {
                vibeEmoji: emoji,
                vibeLabel,
                statusMessage: statusMessage || null,
                statusUpdatedAt: new Date(),
            },
            select: {
                id: true,
                username: true,
                displayName: true,
                vibeEmoji: true,
                vibeLabel: true,
                statusMessage: true,
                statusUpdatedAt: true,
                friendCode: true,
            }
        })

        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        console.error('Update status error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
