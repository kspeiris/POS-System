
export default function Loader({ size = 'md', fullPage = false }) {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    const loader = (
        <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizes[size]}`} />
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {loader}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            {loader}
        </div>
    );
}
