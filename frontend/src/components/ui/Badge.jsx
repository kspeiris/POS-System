
import { twMerge } from 'tailwind-merge';

export default function Badge({
    children,
    variant = 'neutral',
    className
}) {
    const variants = {
        neutral: 'bg-light text-dark-2',
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-orange-50 text-secondary',
        success: 'bg-light-green text-success',
        danger: 'bg-light-red text-danger',
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
