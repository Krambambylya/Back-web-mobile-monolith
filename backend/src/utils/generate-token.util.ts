import { createHash, createHmac, randomBytes, randomInt } from 'crypto';
import jwt, { Secret } from 'jsonwebtoken';

import { env } from '../config/env-config';

const secret: Secret = env.JWT_SECRET as string;

const jwtSignOptions = {
  algorithm: 'HS256' as const,
  expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
};

const generateAccessToken = (payload: { workspaceId: string; deviceId: string }): string => {
  if (!secret) {
    throw new Error('JWT SECRET is undefined');
  }

  return jwt.sign(payload, secret, jwtSignOptions);
};

const generateRefreshTokenValue = (): string => randomBytes(32).toString('hex');

/** Long-lived backup secret shown once (64 hex chars = 32 bytes). */
const generateRecoveryKey = (): string => randomBytes(32).toString('hex');

/** Short code for device pairing — 6 digits, easy to type / show as QR payload. */
const generatePairingCode = (): string => randomInt(0, 1_000_000).toString().padStart(6, '0');

const hashRefreshToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

/** Alias — same sha256 hex fingerprint used for recovery keys and refresh tokens. */
const hashSecret = hashRefreshToken;

/** HMAC-SHA256 of a low-entropy pairing code; pepper is JWT_SECRET. */
const hashPairingCode = (code: string): string =>
  createHmac('sha256', env.JWT_SECRET).update(code).digest('hex');

/**
 * Parses durations like `15m`, `2h`, `7d` into milliseconds.
 * Falls back to 30 days when the format is unrecognized.
 */
const durationToMs = (duration: string): number => {
  const match = /^(\d+)([smhd])$/i.exec(duration.trim());

  if (!match) {
    return 30 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
};

const getRefreshTokenExpiryDate = (duration = env.JWT_REFRESH_EXPIRES_IN): Date => {
  return new Date(Date.now() + durationToMs(duration));
};

export {
  durationToMs,
  generateAccessToken,
  generatePairingCode,
  generateRecoveryKey,
  generateRefreshTokenValue,
  getRefreshTokenExpiryDate,
  hashPairingCode,
  hashRefreshToken,
  hashSecret,
};
