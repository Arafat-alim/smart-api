import { Endpoint } from '../types';
import { deriveFunctionName } from './util';

export function generateSDK(endpoints: Endpoint[]): string {
  const lines: string[] = [
    "import axios from 'axios';",
    '',
    "export const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';",
    '',
  ];

  const functionNames: string[] = [];

  for (const ep of endpoints) {
    const fnName = deriveFunctionName(ep.method, ep.path);
    functionNames.push(fnName);
    const axiosMethod = ep.method.toLowerCase();
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(ep.method.toUpperCase());

    lines.push('/**');
    lines.push(` * ${ep.method} ${ep.path}`);
    lines.push(' */');

    if (hasBody) {
      lines.push(`export async function ${fnName}(data: any): Promise<any> {`);
      lines.push(`  const response = await axios.${axiosMethod}(\`\${BASE_URL}${ep.path}\`, data);`);
      lines.push('  return response.data;');
      lines.push('}');
    } else {
      lines.push(`export async function ${fnName}(): Promise<any> {`);
      lines.push(`  const response = await axios.${axiosMethod}(\`\${BASE_URL}${ep.path}\`);`);
      lines.push('  return response.data;');
      lines.push('}');
    }
    lines.push('');
  }

  lines.push(`export default { ${functionNames.join(', ')} };`);

  return lines.join('\n');
}
