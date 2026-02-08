'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function OnboardingForm() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, displayName }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update profile')
            }

            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <Input
                    id="username"
                    type="text"
                    label="Choose a unique username"
                    placeholder="vibechemisty"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    required
                    minLength={3}
                />
                <Input
                    id="displayName"
                    type="text"
                    label="Your display name"
                    placeholder="Alex"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={loading} variant="primary">
                {loading ? 'Saving...' : 'Get Started'}
            </Button>
        </form>
    )
}
