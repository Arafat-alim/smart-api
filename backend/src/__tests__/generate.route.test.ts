import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import generateRouter from '../routes/generate';

function makeApp() {
  const app = express();
  app.use('/api', generateRouter);
  return app;
}

const validCollection = {
  info: { name: 'Sample API', schema: 'https://schema.postman.com/collection/json/v2.1.0/collection.json' },
  item: [
    {
      name: 'ListUsers',
      request: {
        method: 'GET',
        url: { raw: 'http://api.example.com/users', protocol: 'http', host: ['api', 'example', 'com'], path: ['users'] },
      },
      response: [{ code: 200, body: '[{"id":1}]' }],
    },
  ],
};

describe('POST /api/generate', () => {
  it('rejects a collection that fails schema validation', async () => {
    const res = await request(makeApp())
      .post('/api/generate')
      .attach('collection', Buffer.from(JSON.stringify({ item: [] })), 'bad.json');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/schema validation/i);
    expect(res.body.details.some((d: string) => d.includes('info'))).toBe(true);
  });

  it('generates artifacts with auto-extracted baseUrl and endpointsMeta for a valid collection', async () => {
    const res = await request(makeApp())
      .post('/api/generate')
      .attach('collection', Buffer.from(JSON.stringify(validCollection)), 'sample.json');

    expect(res.status).toBe(200);
    expect(res.body.baseUrl).toBe('http://api.example.com');
    expect(res.body.endpointsMeta).toEqual([
      { name: 'ListUsers', method: 'GET', path: '/users', apiType: 'REST', authType: 'none' },
    ]);
    expect(res.body.openapi).toContain('servers:');
  });

  it('honors an explicit baseUrl override field', async () => {
    const res = await request(makeApp())
      .post('/api/generate')
      .field('baseUrl', 'https://staging.example.com')
      .attach('collection', Buffer.from(JSON.stringify(validCollection)), 'sample.json');

    expect(res.status).toBe(200);
    expect(res.body.baseUrl).toBe('https://staging.example.com');
  });

  it('rejects an invalid baseUrl override', async () => {
    const res = await request(makeApp())
      .post('/api/generate')
      .field('baseUrl', 'not-a-url')
      .attach('collection', Buffer.from(JSON.stringify(validCollection)), 'sample.json');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid base URL/);
  });
});
