import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant = 'primary', size = 'md', className, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

        const variants = {
            primary: 'bg-gradient-primary text-white shadow-md hover:shadow-lg focus:ring-primary',
            secondary: 'bg-white text-slate-800 border-2 border-slate-200 hover:bg-slate-50 focus:ring-slate-200 hover:border-slate-300',
            danger: 'bg-red-500 text-white shadow-md hover:bg-red-600 focus:ring-red-500',
            ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);
Button.displayName = 'Button';
