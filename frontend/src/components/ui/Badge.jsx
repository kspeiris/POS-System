
import { twMerge } from 'tailwind-merge';

export default function Badge({
    children,
    variant = 'neutral',
    className
}) {
    const variants = {
        neutral: 'bg-light text-gray',
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        success: 'bg-success/10 text-success',
        danger: 'bg-danger/10 text-danger',
        warning: 'bg-secondary/10 text-secondary',
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
