import { ApiType } from './types';

export interface ClassifierInput {
  method: string;
  protocol?: string;
  path: string;
  headers: { key: string; value?: string }[];
  bodyRaw: string | null;
  name: string;
  folderName?: string;
}

const WEBHOOK_PATTERN = /webhook|callback|hook/i;

export function classifyEndpoint(input: ClassifierInput): ApiType {
  const protocol = (input.protocol || '').toLowerCase();
  if (protocol === 'ws' || protocol === 'wss') {
    return 'WEBSOCKET';
  }

  const contentType = (
    input.headers.find((h) => (h.key || '').toLowerCase() === 'content-type')?.value || ''
  ).toLowerCase();
  const hasSoapAction = input.headers.some((h) => (h.key || '').toLowerCase() === 'soapaction');
  const bodyLooksLikeSoap = !!input.bodyRaw && /^\s*(<\?xml|<soap:envelope)/i.test(input.bodyRaw);

  if (contentType.includes('xml') && (hasSoapAction || bodyLooksLikeSoap)) {
    return 'SOAP';
  }

  const method = (input.method || '').toUpperCase();
  if (
    method === 'POST' &&
    (WEBHOOK_PATTERN.test(input.name) ||
      WEBHOOK_PATTERN.test(input.path) ||
      WEBHOOK_PATTERN.test(input.folderName || ''))
  ) {
    return 'WEBHOOK';
  }

  return 'REST';
}
