import { Endpoint } from '../types';
import { sanitizeForSingleQuoteString } from './util';

export function generateMockServer(endpoints: Endpoint[]): string {
  const lines: string[] = [
    "import express from 'express';",
    '',
    'const app = express();',
    'app.use(express.json());',
    '',
  ];

  const allowedMethods = ['get', 'post', 'put', 'patch', 'delete'];

  for (const ep of endpoints) {
    const method = ep.method.toLowerCase();
    const expressMethod = allowedMethods.includes(method) ? method : 'get';
    const body =
      ep.responseExample !== null && ep.responseExample !== undefined
        ? JSON.stringify(ep.responseExample)
        : '{}';

    const safePath = sanitizeForSingleQuoteString(ep.path);
    lines.push(`app.${expressMethod}('${safePath}', (req, res) => {`);
    lines.push(`  res.json(${body});`);
    lines.push('});');
    lines.push('');
  }

  lines.push('const PORT = process.env.MOCK_PORT || 3001;');
  lines.push('app.listen(PORT, () => {');
  lines.push('  console.log(`Mock server listening on port ${PORT}`);');
  lines.push('});');
  lines.push('');

  return lines.join('\n');
}
