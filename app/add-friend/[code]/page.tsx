'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Loader2, UserPlus, Check } from 'lucide-react'

export default function AddFriendPage({ params }: { params: { code: string } }) {
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-friends'>('loading')
    const [error, setError] = useState('')
    const [userInfo, setUserInfo] = useState<any>(null)

    useEffect(() => {
        const addFriend = async () => {
            try {
                // First search for the user
                const searchRes = await fetch('/api/friends/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ friendCode: params.code })
                })

                const searchData = await searchRes.json()

                if (!searchRes.ok) {
                    if (searchRes.status === 401) {
                        // Not logged in, redirect to login with return URL
                        router.push(`/login?redirect=/add-friend/${params.code}`)
                        return
                    }
                    setError(searchData.error || 'User not found')
                    setStatus('error')
                    return
                }

                setUserInfo(searchData.user)

                // Check if already friends
                if (searchData.error === 'Already friends') {
                    setStatus('already-friends')
                    return
                }

                // Try to add as friend
                const addRes = await fetch('/api/friends/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ friendCode: params.code })
                })

                const addData = await addRes.json()

                if (!addRes.ok) {
                    if (addData.error === 'Already friends') {
                        setStatus('already-friends')
                        return
                    }
                    setError(addData.error || 'Failed to add friend')
                    setStatus('error')
                    return
                }

                setStatus('success')
            } catch (err) {
                setError('Something went wrong')
                setStatus('error')
            }
        }

        addFriend()
    }, [params.code, router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Adding Friend...</h1>
                        <p className="text-gray-500">Please wait a moment</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Friend Added! 🎉</h1>
                        <p className="text-gray-500 mb-6">
                            You're now friends with <span className="font-semibold text-gray-900">{userInfo?.displayName || 'this user'}</span>
                        </p>
                        <Button onClick={() => router.push('/dashboard')} className="w-full">
                            Go to Dashboard
                        </Button>
                    </>
                )}

                {status === 'already-friends' && (
                    <>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-10 h-10 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Friends!</h1>
                        <p className="text-gray-500 mb-6">
                            You're already friends with <span className="font-semibold text-gray-900">{userInfo?.displayName || 'this user'}</span>
                        </p>
                        <Button onClick={() => router.push('/dashboard')} className="w-full">
                            Go to Dashboard
                        </Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">❌</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
                        <p className="text-red-600 mb-6">{error}</p>
                        <div className="space-y-2">
                            <Button onClick={() => router.push('/dashboard')} className="w-full">
                                Go to Dashboard
                            </Button>
                            <Button onClick={() => router.push('/login')} variant="outline" className="w-full">
                                Login
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
