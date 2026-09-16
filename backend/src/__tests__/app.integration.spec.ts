import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../app';

describe('app (integration)', () => {
  it('GET / returns an ok envelope', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /live is process liveness without a db field', async () => {
    const res = await request(app).get('/live');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({ status: 'ok' });
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('GET /health returns a readiness envelope', async () => {
    const res = await request(app).get('/health');

    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('db');
  });

  it('returns 404 for an unmatched route', async () => {
    const res = await request(app).get('/this-route-does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('rejects a disallowed CORS origin', async () => {
    const res = await request(app).get('/').set('Origin', 'https://not-allowed.example');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('allows a whitelisted CORS origin', async () => {
    const res = await request(app).get('/').set('Origin', 'https://example.com');

    expect(res.headers['access-control-allow-origin']).toBe('https://example.com');
  });

  it('POST /v1/workspaces/create rejects a non-JSON content type', async () => {
    const res = await request(app)
      .post('/v1/workspaces/create')
      .set('Content-Type', 'text/plain')
      .send('deviceName=web');

    expect(res.status).toBe(400);
  });

  it('POST /v1/workspaces/create rejects an empty device name', async () => {
    const res = await request(app).post('/v1/workspaces/create').send({ deviceName: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
