export interface Endpoint {
  name: string;
  method: string;
  path: string;
  queryParams: string[];
  headers: string[];
  requestBodySchema: any;
  responseExample: any;
}
