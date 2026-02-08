import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user) redirect('/login')

    if (user.username && user.displayName) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Welcome to EmojiPulse!
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Let's set up your profile so friends can find you.
                    </p>
                </div>
                <OnboardingForm />
            </div>
        </div>
    )
}
