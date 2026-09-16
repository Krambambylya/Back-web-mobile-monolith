import type { Metadata } from 'next';

import { AppShell } from '@/components/layout/app-shell';
import { SyncHub } from '@/components/sync/sync-hub';

export const metadata: Metadata = {
  title: 'Sync',
  description: 'Create or join a Pairkit workspace and pair another device.',
};

export default function SyncPage() {
  return (
    <AppShell hideTitle showFooter>
      <SyncHub />
    </AppShell>
  );
}
