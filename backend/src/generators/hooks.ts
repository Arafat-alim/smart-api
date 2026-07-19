import { Endpoint } from '../types';
import { deriveFunctionName } from './util';

export function generateReactHooks(endpoints: Endpoint[]): string {
  const lines: string[] = [
    "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';",
    "import sdk from './api';",
    '',
  ];

  for (const ep of endpoints) {
    const fnName = deriveFunctionName(ep.method, ep.path);
    const hookName = 'use' + fnName.charAt(0).toUpperCase() + fnName.slice(1);
    const isQuery = ep.method.toUpperCase() === 'GET';

    lines.push('/**');
    lines.push(` * ${ep.method} ${ep.path}`);
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
