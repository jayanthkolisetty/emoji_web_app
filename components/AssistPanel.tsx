'use client'

import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { getAssistance } from '@/lib/vibe-agent'
import { Copy, X } from 'lucide-react'

interface Friend {
    id: string
    displayName: string | null
    vibeEmoji: string | null
    vibeLabel: string | null
}

interface AssistPanelProps {
    friend: Friend
    onClose: () => void
}

export function AssistPanel({ friend, onClose }: AssistPanelProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    const assistance = useMemo(() => {
        return getAssistance(friend.vibeEmoji || '😐', friend.displayName || 'Friend')
    }, [friend.vibeEmoji, friend.displayName])

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    return (
        <div className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="font-semibold text-gray-900">Vibe Check</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="text-center py-6 bg-gradient-to-b from-indigo-50/50 to-transparent rounded-3xl">
                    <div className="text-6xl mb-3 animate-bounce-slow">
                        {friend.vibeEmoji || '😐'}
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">{friend.displayName}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-2
            ${assistance.label === 'positive' ? 'bg-green-100 text-green-800' :
                            assistance.label === 'negative' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'}`}>
                        {assistance.label} Vibe
                    </span>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Suggested Messages
                    </h4>
                    <div className="space-y-3">
                        {assistance.messages.map((msg, idx) => (
                            <div key={idx} className="group relative bg-white border border-gray-200 rounded-xl p-3 hover:border-indigo-200 hover:shadow-sm transition-all">
                                <p className="text-sm text-gray-700 pr-8">{msg}</p>
                                <button
                                    onClick={() => handleCopy(msg, idx)}
                                    className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Copy to clipboard"
                                >
                                    {copiedIndex === idx ? (
                                        <span className="text-xs font-bold text-green-600">Copied!</span>
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Suggested Actions
                    </h4>
                    <div className="space-y-2">
                        {assistance.actions.map((action, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-sm font-bold text-indigo-600">
                                    {idx + 1}
                                </div>
                                <p className="text-sm font-medium text-gray-700">{action}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
