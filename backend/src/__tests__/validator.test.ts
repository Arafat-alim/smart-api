import { describe, it, expect } from 'vitest';
import { validatePostmanCollection } from '../validator';

const validCollection = {
  info: {
    name: 'Sample API',
    schema: 'https://schema.postman.com/collection/json/v2.1.0/collection.json',
  },
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

describe('validatePostmanCollection', () => {
  it('accepts a valid v2.1 collection', () => {
    const result = validatePostmanCollection(validCollection);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects a collection missing "info"', () => {
    const result = validatePostmanCollection({ item: [] });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('info'))).toBe(true);
  });

  it('rejects a collection missing "item"', () => {
    const result = validatePostmanCollection({ info: { name: 'X', schema: 'https://x' } });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('item'))).toBe(true);
  });
});
