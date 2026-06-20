
import { twMerge } from 'tailwind-merge';

export default function Table({
    headers,
    children,
    className,
    containerClassName
}) {
    return (
        <div className={twMerge("w-full overflow-x-auto rounded-3xl border border-slate-100 bg-white/90 shadow-sm", containerClassName)}>
            <table className={twMerge("w-full text-left text-sm", className)}>
                <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                        {headers.map((header, idx) => (
                            <th key={idx} className="px-6 py-4 font-semibold uppercase tracking-[0.14em] text-[11px]">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export function TableRow({ children, className }) {
    return (
        <tr className={twMerge("hover:bg-slate-50/80 transition-colors", className)}>
            {children}
        </tr>
    );
}

export function TableCell({ children, className }) {
    return (
        <td className={twMerge("px-6 py-4 text-slate-600", className)}>
            {children}
        </td>
    );
}
