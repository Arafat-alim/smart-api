import { Endpoint } from '../types';
import { deriveFunctionName, sanitizeForTemplateLiteral } from './util';

export function generateSDK(endpoints: Endpoint[]): string {
  const lines: string[] = [
    "import axios from 'axios';",
    '',
    "export const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';",
    '',
  ];

  const functionNames: string[] = [];
  const seen = new Map<string, number>();

  for (const ep of endpoints) {
    const fnName = uniquify(deriveFunctionName(ep.method, ep.path), seen);
    functionNames.push(fnName);
    const axiosMethod = ep.method.toLowerCase();
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(ep.method.toUpperCase());
    const safePath = sanitizeForTemplateLiteral(ep.path);

    lines.push('/**');
    lines.push(` * ${ep.method} ${safePath}`);
    lines.push(' */');

    if (hasBody) {
      lines.push(`export async function ${fnName}(data: any): Promise<any> {`);
      lines.push(`  const response = await axios.${axiosMethod}(\`\${BASE_URL}${safePath}\`, data);`);
      lines.push('  return response.data;');
      lines.push('}');
    } else {
      lines.push(`export async function ${fnName}(): Promise<any> {`);
      lines.push(`  const response = await axios.${axiosMethod}(\`\${BASE_URL}${safePath}\`);`);
      lines.push('  return response.data;');
      lines.push('}');
    }
    lines.push('');
  }

  lines.push(`export default { ${functionNames.join(', ')} };`);

  return lines.join('\n');
}

function uniquify(name: string, seen: Map<string, number>): string {
  const count = seen.get(name) ?? 0;
  seen.set(name, count + 1);
  return count === 0 ? name : `${name}${count + 1}`;
}
