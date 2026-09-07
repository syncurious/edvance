export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatPaymentMethod = (method: string) =>
  method
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
