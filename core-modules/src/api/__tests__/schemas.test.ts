import { describe, expect, test } from 'vitest';

import {
  bootstrapItemsSchema,
  createWorkspaceSchema,
  itemSchema,
  joinWorkspaceSchema,
  manifestDiffSchema,
  recoverWorkspaceSchema,
} from '../index';

const validItem = {
  id: 'item-1',
  title: 'Note',
  body: 'Hello',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
};

describe('itemSchema', () => {
  test('parses a valid item', () => {
    expect(itemSchema.parse(validItem)).toMatchObject({
      id: 'item-1',
      title: 'Note',
    });
  });

  test('defaults body to an empty string', () => {
    const { body: _body, ...withoutBody } = validItem;
    expect(itemSchema.parse(withoutBody).body).toBe('');
  });

  test('rejects an empty id', () => {
    expect(() => itemSchema.parse({ ...validItem, id: '  ' })).toThrow();
  });

  test('rejects a non-ISO datetime', () => {
    expect(() => itemSchema.parse({ ...validItem, createdAt: 'yesterday' })).toThrow();
  });
});

describe('workspace request schemas', () => {
  test('createWorkspaceSchema trims deviceName', () => {
    expect(createWorkspaceSchema.parse({ deviceName: '  phone  ' })).toEqual({
      deviceName: 'phone',
    });
  });

  test('joinWorkspaceSchema requires a 6-digit pairing code', () => {
    expect(() =>
      joinWorkspaceSchema.parse({ pairingCode: '12a456', deviceName: 'phone' }),
    ).toThrow();
    expect(joinWorkspaceSchema.parse({ pairingCode: '123456', deviceName: 'phone' })).toEqual({
      pairingCode: '123456',
      deviceName: 'phone',
    });
  });

  test('recoverWorkspaceSchema enforces recovery key length', () => {
    expect(() =>
      recoverWorkspaceSchema.parse({ recoveryKey: 'short', deviceName: 'phone' }),
    ).toThrow();
  });
});

describe('bootstrapItemsSchema', () => {
  test('accepts one item and caps at 50', () => {
    expect(bootstrapItemsSchema.parse({ items: [validItem] }).items).toHaveLength(1);
    expect(() =>
      bootstrapItemsSchema.parse({ items: Array.from({ length: 51 }, () => validItem) }),
    ).toThrow();
  });
});

describe('manifestDiffSchema', () => {
  test('parses payload lists', () => {
    expect(manifestDiffSchema.parse({ pull: ['a'], pushNeeded: [], tombstones: ['b'] })).toEqual({
      pull: ['a'],
      pushNeeded: [],
      tombstones: ['b'],
    });
  });
});
