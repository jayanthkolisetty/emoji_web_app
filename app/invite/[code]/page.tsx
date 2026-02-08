import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import InviteAction from './InviteAction'

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
    const { code: inviterId } = await params
    const session = await getSession()

    const inviter = await prisma.user.findUnique({
        where: { id: inviterId },
        select: { displayName: true, username: true, vibeEmoji: true }
    })

    if (!inviter) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Invalid Invite Link</h1>
                    <p className="mt-2 text-gray-500">This invite code does not exist.</p>
                    <Link href="/" className="mt-4 text-indigo-600 hover:text-indigo-500">Go Home</Link>
                </div>
            </div>
        )
    }

    if (session && session.userId === inviterId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">You can't invite yourself! 😅</h1>
                    <Link href="/dashboard" className="mt-4 text-indigo-600 hover:text-indigo-500">Go to Dashboard</Link>
                </div>
            </div>
        )
    }

    // Check existing friendship
    let isAlreadyFriend = false
    if (session) {
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userAId: session.userId, userBId: inviterId },
                    { userAId: inviterId, userBId: session.userId }
                ]
            }
        })
        if (existing) isAlreadyFriend = true
    }

    if (isAlreadyFriend) {
        return redirect('/dashboard')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl shadow-inner">
                    {inviter.vibeEmoji || '👋'}
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Join {inviter.displayName}'s Circle
                    </h1>
                    <p className="text-gray-500 mt-2">
                        @{inviter.username} wants to share their vibe with you on EmojiPulse.
                    </p>
                </div>

                {session ? (
                    <InviteAction inviterId={inviterId} />
                ) : (
                    <div className="space-y-3">
                        <Link href={`/login?callbackUrl=/invite/${inviterId}`}>
                            <Button className="w-full">Sign In to Accept</Button>
                        </Link>
                        <Link href={`/register?callbackUrl=/invite/${inviterId}`}>
                            <Button variant="outline" className="w-full">Create Account</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
