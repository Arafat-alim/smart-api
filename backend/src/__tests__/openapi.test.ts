import { describe, it, expect } from 'vitest';
import { generateOpenAPISpec } from '../generators/openapi';
import { Endpoint } from '../types';

function makeEndpoint(overrides: Partial<Endpoint>): Endpoint {
  return {
    name: 'ListUsers',
    method: 'GET',
    path: '/users',
    queryParams: [],
    headers: [],
    requestBodySchema: null,
    responseExample: { id: 1 },
    apiType: 'REST',
    auth: { type: 'none' },
    ...overrides,
  };
}

describe('generateOpenAPISpec', () => {
  it('includes a servers block when baseUrl is set', () => {
    const spec = generateOpenAPISpec([makeEndpoint({})], 'API', 'http://api.example.com');
    expect(spec).toContain('servers:');
    expect(spec).toContain('- url: "http://api.example.com"');
  });

  it('omits servers block when baseUrl is empty', () => {
    const spec = generateOpenAPISpec([makeEndpoint({})], 'API', '');
    expect(spec).not.toContain('servers:');
  });

  it('adds a bearer securityScheme and per-path security for a bearer-auth endpoint', () => {
    const spec = generateOpenAPISpec(
      [makeEndpoint({ auth: { type: 'bearer' } })],
      'API',
      ''
    );
    expect(spec).toContain('securitySchemes:');
    expect(spec).toContain('bearer:');
    expect(spec).toContain('type: http');
    expect(spec).toContain('scheme: bearer');
    expect(spec).toContain('security:');
    expect(spec).toContain('- bearer: []');
  });

  it('adds an apiKey securityScheme with in/name from auth details', () => {
    const spec = generateOpenAPISpec(
      [makeEndpoint({ auth: { type: 'apikey', details: { in: 'header', key: 'X-API-Key' } } })],
      'API',
      ''
    );
    expect(spec).toContain('type: apiKey');
    expect(spec).toContain('in: header');
    expect(spec).toContain('name: X-API-Key');
  });

  it('omits components/securitySchemes when no endpoint requires auth', () => {
    const spec = generateOpenAPISpec([makeEndpoint({})], 'API', '');
    expect(spec).not.toContain('securitySchemes:');
  });
});
