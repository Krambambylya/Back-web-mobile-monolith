import { env } from '@/lib/env';

/** Web sync UI gate. In development defaults to on when env is unset. */
export const isSyncWebEnabled = (): boolean => {
  const value = env.NEXT_PUBLIC_SYNC_WEB_ENABLED?.trim().toLowerCase();
  if (value == null || value === '') {
    return env.NODE_ENV === 'development';
  }
  return value === '1' || value === 'true' || value === 'yes';
};
