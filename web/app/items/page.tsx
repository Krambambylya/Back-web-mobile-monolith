import type { Metadata } from 'next';

import { AppShell } from '@/components/layout/app-shell';
import { ItemsClient } from '@/components/items/items-client';

export const metadata: Metadata = {
  title: 'Items',
  description: 'Create and list synced workspace items.',
};

export default function ItemsPage() {
  return (
    <AppShell title="Items" showFooter>
      <ItemsClient />
    </AppShell>
  );
}
