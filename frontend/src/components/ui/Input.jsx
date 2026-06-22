import { twMerge } from 'tailwind-merge';

export default function Input({
    label,
    error,
    className,
    icon: Icon,
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={twMerge(
                        'w-full rounded-xl border border-slate-200 bg-white/90 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
                        Icon && 'pl-10',
                        error && 'border-danger focus:ring-danger/20 focus:border-danger',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-red-600 font-medium">
                    {error}
                </span>
            )}
        </div>
    );
}
