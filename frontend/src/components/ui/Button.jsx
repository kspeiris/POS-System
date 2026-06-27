
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    ...props
}) {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/15',
        secondary: 'bg-white text-dark border border-border hover:bg-light',
        danger: 'bg-danger text-white hover:opacity-90 shadow-lg shadow-danger/15',
        success: 'bg-success text-white hover:opacity-90 shadow-lg shadow-success/15',
        ghost: 'bg-transparent text-gray hover:bg-light',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={twMerge(
                'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
}
