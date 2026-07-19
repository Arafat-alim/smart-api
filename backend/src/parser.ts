import { Endpoint, ParsedCollection, AuthInfo, AuthType } from './types';
import { classifyEndpoint } from './classifier';

interface PostmanItem {
  name?: string;
  item?: PostmanItem[];
  request?: any;
  response?: any[];
}

interface FlatItem {
  item: PostmanItem;
  folderName?: string;
}

export function parseCollection(
  collection: any,
  opts: { baseUrlOverride?: string } = {}
): ParsedCollection {
  if (!collection || typeof collection !== 'object') {
    throw new Error('Collection must be a JSON object');
  }
  if (!collection.info) {
    throw new Error('Invalid Postman collection: missing "info" field');
  }
  if (!Array.isArray(collection.item)) {
    throw new Error('Invalid Postman collection: missing or invalid "item" array');
  }

  const flatItems = flattenItems(collection.item);

  if (flatItems.length === 0) {
    throw new Error('Collection has no requests');
  }

  const endpoints = flatItems.map(({ item, folderName }) =>
    itemToEndpoint(item, folderName, collection.auth)
  );

  const baseUrl = resolveBaseUrl(opts.baseUrlOverride, flatItems[0].item.request.url);

  return { baseUrl, endpoints };
}

function flattenItems(items: PostmanItem[], folderName?: string): FlatItem[] {
  const result: FlatItem[] = [];
  for (const it of items) {
    if (Array.isArray(it.item)) {
      result.push(...flattenItems(it.item, it.name));
    } else if (it.request) {
      result.push({ item: it, folderName });
    }
  }
  return result;
}

function itemToEndpoint(item: PostmanItem, folderName: string | undefined, collectionAuth: any): Endpoint {
  const request = item.request;
  if (!request || !request.method) {
    throw new Error(`Request "${item.name || 'unnamed'}" is missing method`);
  }

  const method = String(request.method).toUpperCase();
  const path = extractPath(request.url);
  const queryParams = extractQueryParams(request.url);
  const headers = extractHeaders(request.header);
  const requestBodySchema = extractBody(request.body);
  const responseExample = extractResponseExample(item.response);
  const protocol = extractProtocol(request.url);
  const bodyRaw = extractBodyRaw(request.body);
  const auth = extractAuth(request.auth, collectionAuth);

  const apiType = classifyEndpoint({
    method,
    protocol,
    path,
    headers: Array.isArray(request.header) ? request.header : [],
    bodyRaw,
    name: item.name || '',
    folderName,
  });

  return {
    name: item.name || `${method} ${path}`,
    method,
    path,
    queryParams,
    headers,
    requestBodySchema,
    responseExample,
    apiType,
    auth,
  };
}

function extractPath(url: any): string {
  if (!url) return '/';
  if (typeof url === 'string') {
    try {
      return new URL(url).pathname || '/';
    } catch {
      return '/' + url.replace(/^https?:\/\/[^/]+\//, '');
    }
  }
  if (Array.isArray(url.path) && url.path.length > 0) {
    return '/' + url.path.join('/');
  }
  return '/';
}

function extractQueryParams(url: any): string[] {
  if (!url || typeof url === 'string') return [];
  if (Array.isArray(url.query)) {
    return url.query.map((q: any) => q.key).filter(Boolean);
  }
  return [];
}

function extractHeaders(headers: any): string[] {
  if (!Array.isArray(headers)) return [];
  return headers.map((h: any) => h.key).filter(Boolean);
}

function extractBody(body: any): any {
  if (!body) return null;
  if (body.mode === 'raw' && typeof body.raw === 'string') {
    try {
      return JSON.parse(body.raw);
    } catch {
      return body.raw;
    }
  }
  return null;
}

function extractBodyRaw(body: any): string | null {
  if (body && body.mode === 'raw' && typeof body.raw === 'string') {
    return body.raw;
  }
  return null;
}

function extractProtocol(url: any): string | undefined {
  if (!url) return undefined;
  if (typeof url === 'string') {
    try {
      return new URL(url).protocol.replace(':', '');
    } catch {
      return undefined;
    }
  }
  return typeof url.protocol === 'string' ? url.protocol : undefined;
}

function extractResponseExample(responses: any[] | undefined): any {
  if (!Array.isArray(responses) || responses.length === 0) return null;
  const first = responses[0];
  if (typeof first.body !== 'string') return null;
  try {
    return JSON.parse(first.body);
  } catch {
    return first.body;
  }
}

const POSTMAN_AUTH_TYPES: Record<string, AuthType> = {
  bearer: 'bearer',
  basic: 'basic',
  apikey: 'apikey',
  oauth2: 'oauth2',
  digest: 'digest',
  awsv4: 'awsv4',
};

function extractAuth(requestAuth: any, collectionAuth: any): AuthInfo {
  const auth = requestAuth || collectionAuth;
  if (!auth || !auth.type || auth.type === 'noauth') {
    return { type: 'none' };
  }

  const mapped = POSTMAN_AUTH_TYPES[auth.type] || 'other';

  if (mapped === 'apikey') {
    const fields: any[] = Array.isArray(auth.apikey) ? auth.apikey : [];
    const key = fields.find((f) => f.key === 'key')?.value;
    const inLoc = fields.find((f) => f.key === 'in')?.value || 'header';
    return { type: 'apikey', details: { in: String(inLoc), key: String(key || '') } };
  }

  return { type: mapped };
}

function resolveBaseUrl(override: string | undefined, firstUrl: any): string {
  if (override && override.trim() !== '') {
    const trimmed = override.trim();
    try {
      new URL(trimmed);
    } catch {
      throw new Error(`Invalid base URL override: "${trimmed}"`);
    }
    return trimmed.replace(/\/$/, '');
  }
  return autoExtractBaseUrl(firstUrl);
}

function autoExtractBaseUrl(url: any): string {
  if (!url) return '';
  if (typeof url === 'string') {
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.host}`;
    } catch {
      return '';
    }
  }
  const protocol = typeof url.protocol === 'string' ? url.protocol : 'http';
  const host = Array.isArray(url.host) ? url.host.join('.') : '';
  if (!host) return '';
  return `${protocol}://${host}`;
}
