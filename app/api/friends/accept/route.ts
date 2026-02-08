import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { inviterId } = await req.json()

        if (!inviterId || inviterId === session.userId) {
            return NextResponse.json({ error: 'Invalid invite' }, { status: 400 })
        }

        // Check existing friendship in either direction
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userAId: session.userId, userBId: inviterId },
                    { userAId: inviterId, userBId: session.userId },
                ],
            },
        })

        if (existing) {
            return NextResponse.json({ message: 'Already friends' })
        }

        // Create friendship
        await prisma.friendship.create({
            data: {
                userAId: inviterId,
                userBId: session.userId,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Accept invite error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
