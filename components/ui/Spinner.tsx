import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
    size?: number
    className?: string
}

export function Spinner({ size = 20, className }: SpinnerProps) {
    return <Loader2 size={size} className={cn('animate-spin', className)} />
}

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="text-center">
                <Spinner size={48} className="mx-auto text-indigo-600 mb-4" />
                <p className="text-gray-600 font-medium">{message}</p>
            </div>
        </div>
    )
}
