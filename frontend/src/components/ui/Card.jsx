
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
            'surface rounded-3xl overflow-hidden flex flex-col',
            className
        )}>
            {(title || subtitle) && (
                <div className="p-6 border-b border-slate-100/80">
                    {title && <h3 className="text-lg font-bold text-dark">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
            )}
            <div className={twMerge(
                'flex-1',
                !noPadding && 'p-6'
            )}>
                {children}
            </div>
            {footer && (
                <div className="p-4 bg-slate-50/80 border-t border-slate-100/80">
                    {footer}
                </div>
            )}
        </div>
    );
}
