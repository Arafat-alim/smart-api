import { Endpoint } from '../types';

export function generateDocs(endpoints: Endpoint[]): string {
  const lines: string[] = ['# API Documentation', ''];

  for (const ep of endpoints) {
    lines.push(`## ${ep.method} ${ep.path}`);
    lines.push('');
    lines.push(`**Name:** ${escapeMd(ep.name)}`);
    lines.push('');

    if (ep.queryParams.length > 0) {
      lines.push('**Query Parameters:**');
      for (const q of ep.queryParams) {
        lines.push(`- \`${q}\``);
      }
      lines.push('');
    }

    if (ep.headers.length > 0) {
      lines.push('**Headers:**');
      for (const h of ep.headers) {
        lines.push(`- \`${h}\``);
      }
      lines.push('');
    }

    if (ep.requestBodySchema) {
      lines.push('**Request Body Example:**');
      lines.push('```json');
      lines.push(JSON.stringify(ep.requestBodySchema, null, 2));
      lines.push('```');
      lines.push('');
    }

    if (ep.responseExample !== null && ep.responseExample !== undefined) {
      lines.push('**Example Response:**');
      lines.push('```json');
      lines.push(JSON.stringify(ep.responseExample, null, 2));
      lines.push('```');
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

function escapeMd(text: string): string {
  return text.replace(/([\\`*_{}[\]()#+.!-])/g, '\\$1');
}
