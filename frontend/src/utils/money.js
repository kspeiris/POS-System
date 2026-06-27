const formatLKR = (value) => {
    const num = Number(value) || 0;
    return 'LKR ' + num.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export { formatLKR };
