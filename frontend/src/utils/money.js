export const LKR_FORMATTER = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 2,
});

export function formatLKR(value) {
    return LKR_FORMATTER.format(Number(value || 0));
}
