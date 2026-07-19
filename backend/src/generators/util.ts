export function toPascalCase(str: string): string {
  return str
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function singularize(word: string): string {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('ses')) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

export function deriveFunctionName(method: string, path: string): string {
  const segments = path.split('/').filter(Boolean);
  const isParam = (s: string) => s.startsWith(':') || s.startsWith('{');
  const lastReal = [...segments].reverse().find((s) => !isParam(s)) || 'resource';
  const hasTrailingParam = segments.length > 0 && isParam(segments[segments.length - 1]);
  const resourcePlural = toPascalCase(lastReal);
  const resourceSingular = toPascalCase(singularize(lastReal));

  switch (method.toUpperCase()) {
    case 'GET':
      return hasTrailingParam
        ? `get${resourceSingular}ById`
        : `get${resourcePlural}`;
    case 'POST':
      return `create${resourceSingular}`;
    case 'PUT':
    case 'PATCH':
      return `update${resourceSingular}`;
    case 'DELETE':
      return `delete${resourceSingular}`;
    default:
      return `${method.toLowerCase()}${resourcePlural}`;
  }
}

export function deriveTypeName(path: string): string {
  const segments = path
    .split('/')
    .filter((s) => s && !s.startsWith(':') && !s.startsWith('{'));
  const last = segments[segments.length - 1] || 'Resource';
  return toPascalCase(singularizeExported(last));
}

function singularizeExported(word: string): string {
  return singularize(word);
}
