const readBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value == null || value === '') return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === '1' || normalized === 'true' || normalized === 'yes') return true;
  if (normalized === '0' || normalized === 'false' || normalized === 'no') return false;
  return fallback;
};

export const isMobileSyncEnabled = (): boolean => {
  const fromEnv = process.env.EXPO_PUBLIC_SYNC_ENABLED;
  if (typeof __DEV__ !== 'undefined' && __DEV__ && (fromEnv == null || fromEnv === '')) {
    return true;
  }
  return readBool(fromEnv, false);
};

export const getApiBaseUrl = (): string => {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (url) return url.replace(/\/$/, '');
  return 'http://localhost:4000';
};
