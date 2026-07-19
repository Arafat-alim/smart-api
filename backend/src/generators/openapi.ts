import { Endpoint } from '../types';

export function generateOpenAPISpec(endpoints: Endpoint[], collectionName: string): string {
  const lines: string[] = [
    'openapi: "3.0.0"',
    'info:',
    `  title: "${escapeYaml(collectionName)}"`,
    '  version: "1.0.0"',
    'paths:',
  ];

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

  return lines.join('\n') + '\n';
}

function escapeYaml(text: string): string {
  return text.replace(/"/g, '\\"');
}
