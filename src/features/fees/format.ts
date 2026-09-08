export { formatCurrency } from '@/lib/format';

export const formatPaymentMethod = (method: string) =>
  method
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
