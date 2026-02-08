'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function InviteAction({ inviterId }: { inviterId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleAccept = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/friends/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviterId }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to accept invite')
            }

            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <Button onClick={handleAccept} className="w-full" disabled={loading} size="lg">
                {loading ? 'Accepting...' : 'Accept Invite'}
            </Button>
        </div>
    )
}
