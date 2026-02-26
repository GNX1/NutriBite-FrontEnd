import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
                <input
                    ref={ref}
                    className={twMerge(
                        clsx(
                            'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                            className
                        )
                    )}
                    {...props}
                />
                {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';
