import { describe, it, expect } from 'vitest';
import { classifyEndpoint } from '../classifier';

describe('classifyEndpoint', () => {
  it('defaults to REST for a plain GET', () => {
    const result = classifyEndpoint({
      method: 'GET',
      protocol: 'http',
      path: '/users',
      headers: [],
      bodyRaw: null,
      name: 'ListUsers',
    });
    expect(result).toBe('REST');
  });

  it('detects WEBSOCKET from ws:// protocol', () => {
    const result = classifyEndpoint({
      method: 'GET',
      protocol: 'ws',
      path: '/live',
      headers: [],
      bodyRaw: null,
      name: 'LiveFeed',
    });
    expect(result).toBe('WEBSOCKET');
  });

  it('detects WEBSOCKET from wss:// protocol', () => {
    const result = classifyEndpoint({
      method: 'GET',
      protocol: 'wss',
      path: '/live',
      headers: [],
      bodyRaw: null,
      name: 'LiveFeed',
    });
    expect(result).toBe('WEBSOCKET');
  });

  it('detects SOAP from xml content-type + SOAPAction header', () => {
    const result = classifyEndpoint({
      method: 'POST',
      protocol: 'http',
      path: '/service',
      headers: [
        { key: 'Content-Type', value: 'text/xml; charset=utf-8' },
        { key: 'SOAPAction', value: 'urn:GetUser' },
      ],
      bodyRaw: '<?xml version="1.0"?><soap:Envelope></soap:Envelope>',
      name: 'GetUser',
    });
    expect(result).toBe('SOAP');
  });

  it('detects SOAP from xml content-type + soap envelope body without SOAPAction header', () => {
    const result = classifyEndpoint({
      method: 'POST',
      protocol: 'http',
      path: '/service',
      headers: [{ key: 'Content-Type', value: 'application/soap+xml' }],
      bodyRaw: '<soap:Envelope></soap:Envelope>',
      name: 'GetUser',
    });
    expect(result).toBe('SOAP');
  });

  it('does not classify SOAP when content-type is xml but body/header do not look like SOAP', () => {
    const result = classifyEndpoint({
      method: 'POST',
      protocol: 'http',
      path: '/export',
      headers: [{ key: 'Content-Type', value: 'application/xml' }],
      bodyRaw: '<data><id>1</id></data>',
      name: 'ExportData',
    });
    expect(result).toBe('REST');
  });

  it('detects WEBHOOK from path naming on POST', () => {
    const result = classifyEndpoint({
      method: 'POST',
      protocol: 'http',
      path: '/webhooks/order-created',
      headers: [],
      bodyRaw: '{"orderId":1}',
      name: 'OrderCreated',
    });
    expect(result).toBe('WEBHOOK');
  });

  it('detects WEBHOOK from folder name on POST', () => {
    const result = classifyEndpoint({
      method: 'POST',
      protocol: 'http',
      path: '/events/order',
      headers: [],
      bodyRaw: '{"orderId":1}',
      name: 'OrderEvent',
      folderName: 'Webhooks',
    });
    expect(result).toBe('WEBHOOK');
  });

  it('does not classify WEBHOOK for GET requests even if named like one', () => {
    const result = classifyEndpoint({
      method: 'GET',
      protocol: 'http',
      path: '/webhooks/order-created',
      headers: [],
      bodyRaw: null,
      name: 'GetWebhookConfig',
    });
    expect(result).toBe('REST');
  });
});
