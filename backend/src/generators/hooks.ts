import { Endpoint } from '../types';
import { deriveFunctionName, sanitizeForTemplateLiteral } from './util';

export function generateReactHooks(endpoints: Endpoint[]): string {
  const lines: string[] = [
    "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';",
    "import sdk from '../sdk/api';",
    '',
  ];

  const seen = new Map<string, number>();

  for (const ep of endpoints) {
    const fnName = uniquify(deriveFunctionName(ep.method, ep.path), seen);
    const hookName = 'use' + fnName.charAt(0).toUpperCase() + fnName.slice(1);
    const isQuery = ep.method.toUpperCase() === 'GET';
    const safePath = sanitizeForTemplateLiteral(ep.path);

    lines.push('/**');
    lines.push(` * ${ep.method} ${safePath}`);
    lines.push(' */');

    if (isQuery) {
      lines.push(`export function ${hookName}() {`);
      lines.push(`  return useQuery({ queryKey: ['${fnName}'], queryFn: sdk.${fnName} });`);
      lines.push('}');
    } else {
      lines.push(`export function ${hookName}() {`);
      lines.push('  const queryClient = useQueryClient();');
      lines.push('  return useMutation({');
      lines.push(`    mutationFn: sdk.${fnName},`);
      lines.push('    onSuccess: () => { queryClient.invalidateQueries(); },');
      lines.push('  });');
      lines.push('}');
    }
    lines.push('');
  }

  return lines.join('\n');
}

function uniquify(name: string, seen: Map<string, number>): string {
  const count = seen.get(name) ?? 0;
  seen.set(name, count + 1);
  return count === 0 ? name : `${name}${count + 1}`;
}
