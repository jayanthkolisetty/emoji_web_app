'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('GLOBAL ERROR:', error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                An unexpected error occurred. Please try again.
                <br />
                <span className="text-xs font-mono text-gray-400 mt-2 block">
                    {error.message}
                </span>
            </p>
            <Button
                onClick={() => reset()}
                variant="primary"
            >
                Try again
            </Button>
        </div>
    )
}
