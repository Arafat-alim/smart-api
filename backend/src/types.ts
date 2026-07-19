export type ApiType = 'REST' | 'WEBHOOK' | 'WEBSOCKET' | 'SOAP';

export type AuthType =
  | 'none'
  | 'bearer'
  | 'basic'
  | 'apikey'
  | 'oauth2'
  | 'digest'
  | 'awsv4'
  | 'other';

export interface AuthInfo {
  type: AuthType;
  details?: Record<string, string>;
}

export interface Endpoint {
  name: string;
  method: string;
  path: string;
  queryParams: string[];
  headers: string[];
  requestBodySchema: any;
  responseExample: any;
  apiType: ApiType;
  auth: AuthInfo;
}

export interface ParsedCollection {
  baseUrl: string;
  endpoints: Endpoint[];
}
