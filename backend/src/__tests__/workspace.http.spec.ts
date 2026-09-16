import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../app';

const requireDb = async (skip: (reason?: string) => void) => {
  const ready = await request(app).get('/ready');
  if (ready.status !== 200) {
    skip('Postgres is not ready (pnpm dev:backend)');
  }
};

describe('workspace + items HTTP (postgres)', () => {
  it('only one concurrent join succeeds for a pairing code', async ({ skip }) => {
    await requireDb(skip);
    const created = await request(app).post('/v1/workspaces/create').send({ deviceName: 'web' });
    expect(created.status).toBe(201);
    const pairingCode = created.body.data.pairingCode as string;

    const [joinA, joinB] = await Promise.all([
      request(app).post('/v1/workspaces/join').send({ pairingCode, deviceName: 'phone-a' }),
      request(app).post('/v1/workspaces/join').send({ pairingCode, deviceName: 'phone-b' }),
    ]);

    expect([joinA.status, joinB.status].sort()).toEqual([201, 400]);
  });

  it('rotates a refresh token and rejects replay by revoking the device', async ({ skip }) => {
    await requireDb(skip);
    const created = await request(app).post('/v1/workspaces/create').send({ deviceName: 'web' });
    const refreshToken = created.body.data.refreshToken as string;

    const rotated = await request(app).post('/v1/workspaces/refresh').send({ refreshToken });
    expect(rotated.status).toBe(200);
    expect(rotated.body.success).toBe(true);

    const replay = await request(app).post('/v1/workspaces/refresh').send({ refreshToken });
    expect(replay.status).toBe(401);

    const afterReuse = await request(app)
      .post('/v1/workspaces/refresh')
      .send({ refreshToken: rotated.body.data.refreshToken });
    expect(afterReuse.status).toBe(401);
  });

  it('upserts and lists items with a bearer access token', async ({ skip }) => {
    await requireDb(skip);
    const created = await request(app).post('/v1/workspaces/create').send({ deviceName: 'web' });
    expect(created.status).toBe(201);
    const accessToken = created.body.data.accessToken as string;

    const item = {
      id: `pk_test_${Date.now().toString(16)}`,
      title: 'Hello',
      body: 'from integration test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await request(app)
      .post('/v1/items')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(item);
    expect(saved.status).toBe(200);
    expect(saved.body.success).toBe(true);

    const listed = await request(app)
      .get('/v1/items')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(listed.status).toBe(200);
    expect(listed.body.data.items.some((row: { id: string }) => row.id === item.id)).toBe(true);
  });

  it('create → join → item is visible on the second device', async ({ skip }) => {
    await requireDb(skip);
    const created = await request(app).post('/v1/workspaces/create').send({ deviceName: 'web' });
    expect(created.status).toBe(201);
    const pairingCode = created.body.data.pairingCode as string;
    const webToken = created.body.data.accessToken as string;

    const joined = await request(app)
      .post('/v1/workspaces/join')
      .send({ pairingCode, deviceName: 'phone' });
    expect(joined.status).toBe(201);
    const phoneToken = joined.body.data.accessToken as string;

    const item = {
      id: `pk_pair_${Date.now().toString(16)}`,
      title: 'Paired note',
      body: 'visible on both devices',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await request(app)
      .post('/v1/items')
      .set('Authorization', `Bearer ${webToken}`)
      .send(item);
    expect(saved.status).toBe(200);

    const listed = await request(app).get('/v1/items').set('Authorization', `Bearer ${phoneToken}`);
    expect(listed.status).toBe(200);
    expect(listed.body.data.items.some((row: { id: string }) => row.id === item.id)).toBe(true);
  });
});
