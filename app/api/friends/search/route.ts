import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { friendCode } = await req.json()

        if (!friendCode || friendCode.length !== 6) {
            return NextResponse.json({ error: 'Invalid friend code' }, { status: 400 })
        }

        // Find user by friend code
        const user = await prisma.user.findUnique({
            where: { friendCode: friendCode.toUpperCase() },
            select: {
                id: true,
                username: true,
                displayName: true,
                friendCode: true,
                vibeEmoji: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Check if it's the current user
        if (user.id === session.userId) {
            return NextResponse.json({ error: 'You cannot add yourself' }, { status: 400 })
        }

        // Check if already friends
        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userAId: session.userId, userBId: user.id },
                    { userAId: user.id, userBId: session.userId }
                ]
            }
        })

        if (existingFriendship) {
            return NextResponse.json({ error: 'Already friends', user }, { status: 200 })
        }

        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        console.error('Friend search error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
