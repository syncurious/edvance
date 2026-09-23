import type { Metadata } from 'next';

import { FeeStructures } from '@/features/fees/components/fee-structures';

export const metadata: Metadata = { title: 'Fee structures' };

export default function FeeStructuresPage() {
  return <FeeStructures />;
}
