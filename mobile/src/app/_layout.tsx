import { AppTheme } from '@/constants/theme';
import { AppStatusBar } from '@/shared/ui/app-status-bar';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';

const NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: AppTheme.primary,
    background: AppTheme.background,
    card: AppTheme.card,
    text: AppTheme.foreground,
    border: AppTheme.border,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={NavigationTheme}>
      <AppStatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: AppTheme.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="items"
          options={{
            headerShown: true,
            title: 'Items',
            headerTintColor: AppTheme.foreground,
            headerStyle: { backgroundColor: AppTheme.background },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
