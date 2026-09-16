import { z } from 'zod';

export const isoDateTime = z
  .string()
  .refine(value => !Number.isNaN(Date.parse(value)), 'Invalid ISO datetime');

export const itemSchema = z.object({
  id: z.string().trim().min(1).max(128),
  title: z.string().trim().min(1).max(200),
  body: z.string().max(20_000).default(''),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
  deletedAt: isoDateTime.nullable().optional(),
});

export type Item = z.infer<typeof itemSchema>;
