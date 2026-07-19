import { Endpoint } from './types';

interface PostmanItem {
  name?: string;
  item?: PostmanItem[];
  request?: any;
  response?: any[];
}

export function parseCollection(collection: any): Endpoint[] {
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

  return flatItems.map(itemToEndpoint);
}

function flattenItems(items: PostmanItem[]): PostmanItem[] {
  const result: PostmanItem[] = [];
  for (const item of items) {
    if (Array.isArray(item.item)) {
      result.push(...flattenItems(item.item));
    } else if (item.request) {
      result.push(item);
    }
  }
  return result;
}

function itemToEndpoint(item: PostmanItem): Endpoint {
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

  return {
    name: item.name || `${method} ${path}`,
    method,
    path,
    queryParams,
    headers,
    requestBodySchema,
    responseExample,
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
