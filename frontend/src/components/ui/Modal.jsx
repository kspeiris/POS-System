
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw]',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* Content */}
            <div className={`relative w-full ${sizes[size]} surface rounded-3xl animate-in zoom-in-95 duration-200 overflow-hidden`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-border/70">
                    <h3 className="text-xl font-semibold text-dark">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-light transition-colors text-gray hover:text-dark-2"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
