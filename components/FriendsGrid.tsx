'use client'

import React, { useState } from 'react'
import { Plus, Users, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { timeAgo, cn } from '@/lib/utils'
import { useToast } from '@/components/ToastProvider'

interface Friend {
    id: string
    displayName: string | null
    vibeEmoji: string | null
    vibeLabel: string | null
    statusMessage?: string | null
    statusUpdatedAt: string | null
}

interface FriendsGridProps {
    friends: Friend[]
    userFriendCode: string
    onSelect: (friend: Friend) => void
    onFriendAdded: () => void
}

export function FriendsGrid({ friends, userFriendCode, onSelect, onFriendAdded }: FriendsGridProps) {
    const toast = useToast()
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [friendCode, setFriendCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(userFriendCode)
        setCopied(true)
        toast.success('Friend code copied!')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleAddFriend = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/friends/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendCode: friendCode.trim().toUpperCase() })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Failed to add friend')
                toast.error(data.error || 'Failed to add friend')
                return
            }

            setFriendCode('')
            setShowAddFriend(false)
            toast.success('Friend added successfully! 🎉')
            onFriendAdded()
        } catch (err) {
            setError('Something went wrong')
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-8">
            {/* Friend Code Card */}
            <div className="mb-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-indigo-900 mb-1">Your Friend Code</h3>
                        <div className="flex items-center gap-3">
                            <code className="text-2xl font-bold text-indigo-600 tracking-wider">{userFriendCode}</code>
                            <button
                                onClick={handleCopyCode}
                                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                title="Copy code"
                            >
                                {copied ? (
                                    <Check className="text-green-600" size={20} />
                                ) : (
                                    <Copy className="text-indigo-600" size={20} />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-indigo-700 mt-2">Share this code with friends to connect</p>
                    </div>
                    <Users className="text-indigo-300" size={48} />
                </div>

                {/* Share Link Button */}
                <button
                    onClick={async () => {
                        const link = `${window.location.origin}/add-friend/${userFriendCode}`
                        await navigator.clipboard.writeText(link)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                    }}
                    className="w-full py-3 px-4 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                    <Copy size={18} />
                    {copied ? 'Link Copied!' : 'Copy Invite Link'}
                </button>
            </div>

            {/* Add Friend Section */}
            {showAddFriend && (
                <div className="mb-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Add Friend</h3>
                    <form onSubmit={handleAddFriend} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Friend Code
                            </label>
                            <Input
                                type="text"
                                value={friendCode}
                                onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                                placeholder="e.g., ABC123"
                                maxLength={6}
                                className="uppercase text-center text-lg tracking-wider"
                                autoFocus
                            />
                            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={loading || friendCode.length !== 6} className="flex-1">
                                {loading ? 'Adding...' : 'Add Friend'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowAddFriend(false)
                                    setError('')
                                    setFriendCode('')
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Circle</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddFriend(!showAddFriend)}
                    className="gap-2"
                >
                    <Plus size={16} />
                    Add Friend
                </Button>
            </div>

            {friends.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                        🤷
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">No friends yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Share your friend code to get started.</p>
                    <div className="mt-6">
                        <Button onClick={() => setShowAddFriend(true)}>Add Your First Friend</Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {friends.map((friend) => (
                        <button
                            key={friend.id}
                            onClick={() => onSelect(friend)}
                            className="group relative flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all text-center"
                        >
                            <div
                                className={cn(
                                    "w-16 h-16 flex items-center justify-center text-4xl bg-gray-50 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 emoji-font",
                                    friend.vibeLabel === 'positive' && "bg-green-50 text-green-600",
                                    friend.vibeLabel === 'negative' && "bg-red-50 text-red-600",
                                    friend.vibeLabel === 'neutral' && "bg-blue-50 text-blue-600"
                                )}
                            >
                                {friend.vibeEmoji || '😐'}
                            </div>
                            <h3 className="font-semibold text-gray-900 truncate w-full">{friend.displayName}</h3>

                            {friend.statusMessage ? (
                                <>
                                    <p className="text-xs text-indigo-600 font-medium mt-1 truncate w-full">"{friend.statusMessage}"</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{mounted ? timeAgo(friend.statusUpdatedAt) : '...'}</p>
                                </>
                            ) : (
                                <p className="text-xs text-gray-400 mt-1">{mounted ? timeAgo(friend.statusUpdatedAt) : '...'}</p>
                            )}

                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400 ring-2 ring-white" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
