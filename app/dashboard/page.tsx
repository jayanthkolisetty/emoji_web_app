import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
            friendsAsA: {
                include: { userB: true },
            },
            friendsAsB: {
                include: { userA: true },
            },
        },
    })

    if (!user) {
        redirect('/login')
    }

    // Force onboarding if incomplete
    if (!user.username || !user.displayName) {
        redirect('/onboarding')
    }

    const friends = [
        ...user.friendsAsA.map((f) => f.userB),
        ...user.friendsAsB.map((f) => f.userA),
    ].map(f => ({
        id: f.id,
        displayName: f.displayName,
        username: f.username,
        vibeEmoji: f.vibeEmoji,
        vibeLabel: f.vibeLabel,
        statusUpdatedAt: f.statusUpdatedAt.toISOString(),
    }))

    const safeUser = {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        vibeEmoji: user.vibeEmoji,
        vibeLabel: user.vibeLabel,
        statusUpdatedAt: user.statusUpdatedAt.toISOString(),
    }

    return <DashboardClient user={safeUser} friends={friends} />
}
