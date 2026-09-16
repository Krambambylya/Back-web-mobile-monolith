import { describe, expect, test } from 'vitest';

import { chunkItems, mergeItemsByUpdatedAt } from '../sync-engine';
import type { Item } from '../api/item';

const item = (id: string, updatedAt: string): Item => ({
  id,
  title: id,
  body: '',
  createdAt: updatedAt,
  updatedAt,
});

describe('chunkItems', () => {
  test('keeps a small payload in one chunk', () => {
    const chunks = chunkItems([item('a', '2024-01-01T00:00:00.000Z')]);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toHaveLength(1);
  });

  test('splits when the budget is smaller than two items', () => {
    const first = item('a', '2024-01-01T00:00:00.000Z');
    const second = item('b', '2024-01-02T00:00:00.000Z');
    const chunks = chunkItems([first, second], JSON.stringify(first).length + 4);
    expect(chunks).toHaveLength(2);
  });
});

describe('mergeItemsByUpdatedAt', () => {
  test('keeps the newer incoming copy and ignores deletedAt', () => {
    const local = [item('a', '2024-01-01T00:00:00.000Z')];
    const incoming: Item[] = [
      { ...item('a', '2024-02-01T00:00:00.000Z'), title: 'newer' },
      { ...item('b', '2024-02-01T00:00:00.000Z'), deletedAt: '2024-02-01T00:00:00.000Z' },
    ];
    const merged = mergeItemsByUpdatedAt(local, incoming);
    expect(merged).toHaveLength(1);
    expect(merged[0].title).toBe('newer');
  });
});
