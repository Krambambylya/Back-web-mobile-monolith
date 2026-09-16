import { AppTheme } from '@/constants/theme';
import { disableSyncLocally, getWorkspaceSession } from '@/features/workspace-sync';
import { getApiBaseUrl } from '@/shared/config/feature-flags';
import { ThemedText } from '@/shared/ui/themed-text';
import { ThemedView } from '@/shared/ui/themed-view';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const [paired, setPaired] = useState(false);

  const reload = useCallback(async () => {
    try {
      const session = await getWorkspaceSession();
      setPaired(session.syncState !== 'off');
    } catch {
      setPaired(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <ThemedView style={styles.screen}>
      <ThemedText style={styles.title}>Settings</ThemedText>
      <ThemedText style={styles.muted}>API {getApiBaseUrl()}</ThemedText>
      <ThemedText style={styles.muted}>
        {paired ? 'This device is in a workspace.' : 'This device is not paired.'}
      </ThemedText>
      {paired ? (
        <Pressable
          style={styles.secondary}
          onPress={() => void disableSyncLocally().then(reload)}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          testID="settings-sign-out"
        >
          <ThemedText>Sign out</ThemedText>
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: '600' },
  muted: { color: AppTheme.mutedForeground },
  secondary: {
    marginTop: 12,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
