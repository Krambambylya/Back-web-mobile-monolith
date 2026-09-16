import { AppTheme } from '@/constants/theme';
import { getWorkspaceSession } from '@/features/workspace-sync';
import { ThemedText } from '@/shared/ui/themed-text';
import { ThemedView } from '@/shared/ui/themed-view';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [status, setStatus] = useState('Loading…');

  const reload = useCallback(async () => {
    try {
      const session = await getWorkspaceSession();
      if (session.syncState === 'off' || !session.accessToken) {
        setStatus('No workspace on this device');
        return;
      }
      setStatus(
        session.syncState === 'ready' ? 'Workspace ready' : 'Workspace paired — bootstrap pending',
      );
    } catch {
      setStatus('Could not read saved workspace');
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <ThemedView style={styles.screen}>
      <ThemedText style={styles.title}>Pairkit</ThemedText>
      <ThemedText style={styles.body}>{status}</ThemedText>
      <Link href="/items" asChild>
        <Pressable
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Open items"
          testID="home-open-items"
        >
          <ThemedText style={styles.buttonLabel}>Open items</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 32, fontWeight: '600' },
  body: { color: AppTheme.mutedForeground },
  button: {
    marginTop: 12,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: AppTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { color: AppTheme.primaryForeground, fontWeight: '600' },
});
