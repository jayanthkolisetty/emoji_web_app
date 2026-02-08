import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
    const baseClass = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-md",
        outline: "border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 active:bg-indigo-100",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm"
    }

    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-8 text-lg"
    }

    return (
        <button className={twMerge(baseClass, variants[variant], sizes[size], className)} {...props} />
    )
}
