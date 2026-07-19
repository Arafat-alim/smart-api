import { Endpoint } from '../types';
import { deriveTypeName } from './util';

export function generateTypes(endpoints: Endpoint[]): string {
  const interfaces: string[] = [];
  const seenNames = new Set<string>();

  for (const ep of endpoints) {
    const sample = unwrapSample(ep.responseExample);
    if (!sample || typeof sample !== 'object') continue;

    const typeName = deriveTypeName(ep.path);
    if (seenNames.has(typeName)) continue;
    seenNames.add(typeName);

    interfaces.push(buildInterface(typeName, sample));
  }

  if (interfaces.length === 0) {
    return '// No response examples with object data found in this collection.\n';
  }

  return interfaces.join('\n\n') + '\n';
}

function unwrapSample(example: any): any {
  if (Array.isArray(example)) return example[0];
  return example;
}

function buildInterface(name: string, obj: Record<string, any>): string {
  const fields = Object.entries(obj).map(([key, value]) => `  ${key}: ${inferType(value)};`);
  return `export interface ${name} {\n${fields.join('\n')}\n}`;
}

function inferType(value: any): string {
  if (value === null || value === undefined) return 'any';
  if (Array.isArray(value)) {
    return value.length > 0 ? `${inferType(value[0])}[]` : 'any[]';
  }
  switch (typeof value) {
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'Record<string, any>';
    default:
      return 'any';
  }
}
