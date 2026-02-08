'use client'

import React, { useState, useEffect } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { FriendsGrid } from '@/components/FriendsGrid'
import { EmojiPicker } from '@/components/EmojiPicker'
import { AssistPanel } from '@/components/AssistPanel'
import { Button } from '@/components/ui/Button'
import { timeAgo } from '@/lib/utils'
import { useToast } from '@/components/ToastProvider'

export default function DashboardClient({ user, friends }: { user: any, friends: any[] }) {
    const toast = useToast()
    const [currentUser, setCurrentUser] = useState(user)
    const [friendList, setFriendList] = useState(friends)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState<any>(null)
    const [mounted, setMounted] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    useEffect(() => {
        setMounted(true)
        setLastUpdated(new Date())
    }, [])

    // Polling every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/me')
                if (res.ok) {
                    const data = await res.json()
                    setCurrentUser(data.user)
                    setFriendList(data.friends)
                    setLastUpdated(new Date())
                }
            } catch (err) {
                console.error('Polling error', err)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const handleStatusUpdate = async (emoji: string, statusMessage?: string) => {
        try {
            const res = await fetch('/api/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emoji, statusMessage }),
            })
            if (!res.ok) {
                const data = await res.json()
                toast.error(data.error || 'Failed to update status')
                return
            }
            const data = await res.json()
            setCurrentUser(data.user)
            setShowEmojiPicker(false)
            toast.success('Vibe updated successfully! 🎉')
        } catch (err) {
            console.error('Status update error', err)
            toast.error('Something went wrong. Please try again.')
        }
    }

    const handleInvite = async () => {
        const link = `${window.location.origin}/invite/${currentUser.id}`
        try {
            await navigator.clipboard.writeText(link)
            toast.success('Invite link copied to clipboard!')
        } catch (err) {
            toast.error('Failed to copy link')
            alert(`Share this link: ${link}`)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <DashboardHeader user={currentUser} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Status Section */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={() => setShowEmojiPicker(true)}>
                            <div className="w-24 h-24 flex items-center justify-center text-6xl bg-indigo-50 rounded-full border-4 border-white shadow-lg transition-transform group-hover:scale-105 emoji-font">
                                {currentUser.vibeEmoji || '👋'}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                <span className="block w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Hi, {currentUser.displayName}!
                            </h2>
                            <div className="mt-2 space-y-1">
                                {currentUser.statusMessage ? (
                                    <>
                                        <p className="text-indigo-600 font-semibold">"{currentUser.statusMessage}"</p>
                                        <p className="text-xs text-gray-400">
                                            Vibe: <span className="capitalize text-gray-600">{currentUser.vibeLabel || 'Chill'}</span>
                                            <span className="mx-2">•</span>
                                            {mounted ? timeAgo(currentUser.statusUpdatedAt) : '...'}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-500">
                                        Current vibe: <span className="font-medium text-gray-900 capitalize">{currentUser.vibeLabel || 'Chill'}</span>
                                        <span className="mx-2">•</span>
                                        <span className="text-xs text-gray-400">Updated {mounted ? timeAgo(currentUser.statusUpdatedAt) : '...'}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button size="lg" className="shrink-0" onClick={() => setShowEmojiPicker(true)}>
                        Edit Status
                    </Button>
                </section>

                {/* Invite Section (if no friends or just generic) */}
                <section className="flex justify-end">
                    {/* Maybe put invite button here or just rely on grid header */}
                </section>

                {/* Friends Grid */}
                <FriendsGrid
                    friends={friendList}
                    userFriendCode={currentUser.friendCode || 'LOADING'}
                    onSelect={setSelectedFriend}
                    onFriendAdded={async () => {
                        // Refresh friends list
                        const res = await fetch('/api/me')
                        if (res.ok) {
                            const data = await res.json()
                            setFriendList(data.friends)
                        }
                    }}
                />

            </main>

            {/* Modals */}
            {showEmojiPicker && (
                <EmojiPicker
                    onClose={() => setShowEmojiPicker(false)}
                    onSelect={handleStatusUpdate}
                />
            )}

            {selectedFriend && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setSelectedFriend(null)}
                    />
                    {/* Panel */}
                    <div className="fixed inset-y-0 right-0 z-50 flex max-w-full">
                        <AssistPanel
                            friend={selectedFriend}
                            onClose={() => setSelectedFriend(null)}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
