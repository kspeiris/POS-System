
import { twMerge } from 'tailwind-merge';

export default function Table({
    headers,
    children,
    className,
    containerClassName
}) {
    return (
        <div className={twMerge("w-full overflow-x-auto rounded-3xl border border-border bg-white/95 shadow-card", containerClassName)}>
            <table className={twMerge("w-full text-left text-sm", className)}>
                <thead className="bg-light text-gray font-medium border-b border-border">
                    <tr>
                        {headers.map((header, idx) => (
                            <th key={idx} className="px-6 py-4 font-semibold uppercase tracking-[0.12em] text-xs">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export function TableRow({ children, className }) {
    return (
        <tr className={twMerge("hover:bg-light transition-colors h-[65px]", className)}>
            {children}
        </tr>
    );
}

export function TableCell({ children, className }) {
    return (
        <td className={twMerge("px-6 py-4 text-dark-2", className)}>
            {children}
        </td>
    );
}
