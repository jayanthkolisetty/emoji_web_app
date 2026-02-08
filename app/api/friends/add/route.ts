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

        if (!friendCode) {
            return NextResponse.json({ error: 'Friend code required' }, { status: 400 })
        }

        // Find the friend by code
        const friend = await prisma.user.findUnique({
            where: { friendCode: friendCode.toUpperCase() }
        })

        if (!friend) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (friend.id === session.userId) {
            return NextResponse.json({ error: 'Cannot add yourself' }, { status: 400 })
        }

        // Check if already friends
        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userAId: session.userId, userBId: friend.id },
                    { userAId: friend.id, userBId: session.userId }
                ]
            }
        })

        if (existingFriendship) {
            return NextResponse.json({ error: 'Already friends' }, { status: 400 })
        }

        // Create friendship
        await prisma.friendship.create({
            data: {
                userAId: session.userId,
                userBId: friend.id
            }
        })

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error) {
        console.error('Add friend error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
