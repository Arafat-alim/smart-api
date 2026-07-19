import { describe, it, expect } from 'vitest';
import { parseCollection } from '../parser';

const sample = {
  info: { name: 'Sample API', schema: 'https://schema.postman.com/collection/json/v2.1.0/collection.json' },
  item: [
    {
      name: 'ListUsers',
      request: {
        method: 'GET',
        url: { raw: 'http://api.example.com/users', protocol: 'http', host: ['api', 'example', 'com'], path: ['users'] },
      },
      response: [{ code: 200, body: '[{"id":1,"name":"Alice"}]' }],
    },
    {
      name: 'CreateUser',
      request: {
        method: 'POST',
        url: { raw: 'http://api.example.com/users', protocol: 'http', host: ['api', 'example', 'com'], path: ['users'] },
        body: { mode: 'raw', raw: '{"name":"Bob"}' },
      },
      response: [{ code: 201, body: '{"id":2,"name":"Bob"}' }],
    },
  ],
};

describe('parseCollection — base URL', () => {
  it('auto-extracts base URL from the first request when no override given', () => {
    const result = parseCollection(sample);
    expect(result.baseUrl).toBe('http://api.example.com');
  });

  it('uses an explicit override when provided', () => {
    const result = parseCollection(sample, { baseUrlOverride: 'https://staging.example.com' });
    expect(result.baseUrl).toBe('https://staging.example.com');
  });

  it('throws on an invalid override', () => {
    expect(() => parseCollection(sample, { baseUrlOverride: 'not-a-url' })).toThrow(/Invalid base URL/);
  });
});

describe('parseCollection — apiType', () => {
  it('tags plain REST endpoints as REST', () => {
    const result = parseCollection(sample);
    expect(result.endpoints.every((e) => e.apiType === 'REST')).toBe(true);
  });
});

describe('parseCollection — auth', () => {
  it('defaults to no auth when neither request nor collection has an auth block', () => {
    const result = parseCollection(sample);
    expect(result.endpoints.every((e) => e.auth.type === 'none')).toBe(true);
  });

  it('uses request-level auth when present', () => {
    const withAuth = {
      ...sample,
      item: [
        {
          ...sample.item[0],
          request: {
            ...sample.item[0].request,
            auth: { type: 'bearer', bearer: [{ key: 'token', value: 'x' }] },
          },
        },
      ],
    };
    const result = parseCollection(withAuth);
    expect(result.endpoints[0].auth.type).toBe('bearer');
  });

  it('falls back to collection-level auth when request has none', () => {
    const withCollectionAuth = {
      ...sample,
      auth: { type: 'apikey', apikey: [{ key: 'key', value: 'X-API-Key' }, { key: 'in', value: 'header' }] },
    };
    const result = parseCollection(withCollectionAuth);
    expect(result.endpoints[0].auth).toEqual({ type: 'apikey', details: { in: 'header', key: 'X-API-Key' } });
  });
});
