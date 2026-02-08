import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getSession()
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 text-2xl font-bold text-indigo-600">
              EmojiPulse 💓
            </a>
          </div>
          <div className="flex flex-1 justify-end gap-4">
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 py-2">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Share your vibe with real friends.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            No doomscrolling. No algorithms. Just pure emotional connection.
            See how your friends really feel and get instant suggestions on how to support them.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register">
              <Button size="lg">Start Vibing</Button>
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
