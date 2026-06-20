
import { twMerge } from 'tailwind-merge';

export default function Badge({
    children,
    variant = 'neutral',
    className
}) {
    const variants = {
        neutral: 'bg-gray-100 text-gray-600',
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        success: 'bg-success/10 text-success',
        danger: 'bg-danger/10 text-danger',
        warning: 'bg-amber-100 text-amber-600',
    };

    return (
        <span className={twMerge(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}
