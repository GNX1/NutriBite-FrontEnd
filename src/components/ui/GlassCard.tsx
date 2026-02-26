import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            whileHover={hoverEffect ? { y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" } : undefined}
            className={twMerge(
                clsx(
                    'bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm rounded-3xl p-6 overflow-hidden',
                    className
                )
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
