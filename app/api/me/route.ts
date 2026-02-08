import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
            friendsAsA: {
                include: {
                    userB: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            vibeEmoji: true,
                            vibeLabel: true,
                            statusMessage: true,
                            statusUpdatedAt: true,
                        },
                    },
                },
            },
            friendsAsB: {
                include: {
                    userA: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            vibeEmoji: true,
                            vibeLabel: true,
                            statusMessage: true,
                            statusUpdatedAt: true,
                        },
                    },
                },
            },
        },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Flatten friends list
    const friends = [
        ...user.friendsAsA.map((f) => f.userB),
        ...user.friendsAsB.map((f) => f.userA),
    ]

    return NextResponse.json({
        user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            vibeEmoji: user.vibeEmoji,
            vibeLabel: user.vibeLabel,
            statusMessage: user.statusMessage,
            statusUpdatedAt: user.statusUpdatedAt,
            friendCode: user.friendCode,
        },
        friends,
    })
}
