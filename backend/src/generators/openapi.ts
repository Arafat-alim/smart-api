import { Endpoint, AuthType } from '../types';

export function generateOpenAPISpec(endpoints: Endpoint[], collectionName: string, baseUrl: string): string {
  const lines: string[] = [
    'openapi: "3.0.0"',
    'info:',
    `  title: "${escapeYaml(collectionName)}"`,
    '  version: "1.0.0"',
  ];

  if (baseUrl) {
    lines.push('servers:');
    lines.push(`  - url: "${escapeYaml(baseUrl)}"`);
  }

  lines.push('paths:');

  const byPath = new Map<string, Endpoint[]>();
  for (const ep of endpoints) {
    if (!byPath.has(ep.path)) byPath.set(ep.path, []);
    byPath.get(ep.path)!.push(ep);
  }

  for (const [path, eps] of byPath) {
    lines.push(`  ${path}:`);
    for (const ep of eps) {
      lines.push(`    ${ep.method.toLowerCase()}:`);
      lines.push(`      summary: "${escapeYaml(ep.name)}"`);
      if (ep.queryParams.length > 0) {
        lines.push('      parameters:');
        for (const q of ep.queryParams) {
          lines.push(`        - name: ${q}`);
          lines.push('          in: query');
          lines.push('          schema:');
          lines.push('            type: string');
        }
      }
      if (ep.auth.type !== 'none') {
        lines.push('      security:');
        lines.push(`        - ${ep.auth.type}: []`);
      }
      lines.push('      responses:');
      lines.push("        '200':");
      lines.push('          description: OK');
      if (ep.responseExample !== null && ep.responseExample !== undefined) {
        lines.push('          content:');
        lines.push('            application/json:');
        lines.push('              example: ' + JSON.stringify(ep.responseExample));
      }
    }
  }

  const securitySchemeLines = buildSecuritySchemes(endpoints);
  if (securitySchemeLines.length > 0) {
    lines.push('components:');
    lines.push('  securitySchemes:');
    lines.push(...securitySchemeLines);
  }

  return lines.join('\n') + '\n';
}

function buildSecuritySchemes(endpoints: Endpoint[]): string[] {
  const seen = new Set<AuthType>();
  for (const ep of endpoints) {
    if (ep.auth.type !== 'none') seen.add(ep.auth.type);
  }

  const lines: string[] = [];
  for (const type of seen) {
    lines.push(`    ${type}:`);
    switch (type) {
      case 'bearer':
        lines.push('      type: http');
        lines.push('      scheme: bearer');
        break;
      case 'basic':
        lines.push('      type: http');
        lines.push('      scheme: basic');
        break;
      case 'apikey': {
        const sample = endpoints.find((e) => e.auth.type === 'apikey');
        const inLoc = sample?.auth.details?.in || 'header';
        const keyName = sample?.auth.details?.key || 'X-API-Key';
        lines.push('      type: apiKey');
        lines.push(`      in: ${inLoc}`);
        lines.push(`      name: ${keyName}`);
        break;
      }
      case 'oauth2':
        lines.push('      type: oauth2');
        lines.push('      flows: {}');
        break;
      default:
        lines.push('      type: http');
        lines.push(`      scheme: ${type}`);
    }
  }
  return lines;
}

function escapeYaml(text: string): string {
  return text.replace(/"/g, '\\"');
}
