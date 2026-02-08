'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardHeaderProps {
    user: {
        displayName: string | null
        username: string | null
    }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const router = useRouter()

    const handleLogout = async () => {
        // Ideally call API to flush session, but simple cookie delete works too for MVP
        document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        router.push('/login')
        router.refresh()
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
                        EmojiPulse <span className="text-2xl">💓</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
}
