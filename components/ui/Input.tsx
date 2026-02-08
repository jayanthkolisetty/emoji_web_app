import React, { forwardRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-semibold text-slate-700 tracking-wide">{label}</label>}
            <div className="relative group">
                <input
                    ref={ref}
                    type={isPassword && showPassword ? 'text' : type}
                    className={twMerge(
                        "flex h-12 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm ring-offset-white font-medium text-slate-900 transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-500 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus-visible:ring-red-500/10",
                        className
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-full hover:bg-slate-200 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <span className="text-xs text-red-500 font-bold ml-1">{error}</span>}
        </div>
    )
})

Input.displayName = 'Input'
