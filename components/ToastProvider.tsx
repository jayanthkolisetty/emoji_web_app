'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
    warning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(7)
        const newToast: Toast = { id, message, type, duration }

        setToasts(prev => [...prev, newToast])

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration)
        }
    }, [removeToast])

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast])
    const error = useCallback((message: string) => showToast(message, 'error', 5000), [showToast])
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast])
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast])

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons = {
        success: <CheckCircle className="text-green-600" size={20} />,
        error: <AlertCircle className="text-red-600" size={20} />,
        info: <Info className="text-blue-600" size={20} />,
        warning: <AlertTriangle className="text-yellow-600" size={20} />
    }

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-yellow-50 border-yellow-200'
    }

    const textColors = {
        success: 'text-green-900',
        error: 'text-red-900',
        info: 'text-blue-900',
        warning: 'text-yellow-900'
    }

    return (
        <div
            className={`
                ${bgColors[toast.type]} ${textColors[toast.type]}
                pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
                min-w-[300px] max-w-md
                animate-in slide-in-from-right-full duration-300
            `}
        >
            {icons[toast.type]}
            <p className="flex-1 font-medium text-sm">{toast.message}</p>
            <button
                onClick={onClose}
                className="hover:opacity-70 transition-opacity"
            >
                <X size={18} />
            </button>
        </div>
    )
}
