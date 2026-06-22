
import { twMerge } from 'tailwind-merge';

export default function Card({
    children,
    className,
    title,
    subtitle,
    footer,
    noPadding = false
}) {
    return (
        <div className={twMerge(
            'surface rounded-3xl overflow-hidden flex flex-col shadow-card',
            className
        )}>
            {(title || subtitle) && (
                <div className="px-6 py-5 border-b border-border/70">
                    {title && <h3 className="text-lg font-semibold text-dark">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray mt-1">{subtitle}</p>}
                </div>
            )}
            <div className={twMerge(
                'flex-1',
                !noPadding && 'p-6'
            )}>
                {children}
            </div>
            {footer && (
                <div className="p-4 bg-light border-t border-border/70">
                    {footer}
                </div>
            )}
        </div>
    );
}
