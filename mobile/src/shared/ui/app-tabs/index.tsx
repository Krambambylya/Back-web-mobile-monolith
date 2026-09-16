import { AppTheme } from '@/constants/theme';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={AppTheme.tabBar}
      indicatorColor={AppTheme.primary}
      iconColor={{ default: AppTheme.mutedForeground, selected: AppTheme.primaryForeground }}
      tintColor={AppTheme.primary}
      labelVisibilityMode="labeled"
      labelStyle={{
        default: { color: AppTheme.mutedForeground },
        selected: { color: AppTheme.primaryForeground, fontWeight: '600' },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="sync">
        <NativeTabs.Trigger.Label>Sync</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="link" md="link" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
