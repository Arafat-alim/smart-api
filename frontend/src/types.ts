export type ApiType = 'REST' | 'WEBHOOK' | 'WEBSOCKET' | 'SOAP';
export type AuthType = 'none' | 'bearer' | 'basic' | 'apikey' | 'oauth2' | 'digest' | 'awsv4' | 'other';

export interface EndpointMeta {
  name: string;
  method: string;
  path: string;
  apiType: ApiType;
  authType: AuthType;
}

export interface GenerateResponse {
  docs: string;
  sdk: string;
  curl: string;
  hooks: string;
  types: string;
  openapi: string;
  mockServer: string;
  baseUrl: string;
  endpointsMeta: EndpointMeta[];
  zipBase64: string;
}
