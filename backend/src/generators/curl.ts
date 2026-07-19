import { Endpoint } from '../types';

export function generateCurlCommands(endpoints: Endpoint[]): string {
  const blocks: string[] = [];

  for (const ep of endpoints) {
    const headerFlags = ['-H "Content-Type: application/json"'];
    for (const h of ep.headers) {
      headerFlags.push(`-H "${h}: <value>"`);
    }

    let cmd = `curl -X ${ep.method} "$BASE_URL${ep.path}" ${headerFlags.join(' ')}`;

    if (ep.requestBodySchema) {
      const jsonStr = JSON.stringify(ep.requestBodySchema).replace(/'/g, "'\\''");
      cmd += ` -d '${jsonStr}'`;
    }

    blocks.push(`# ${ep.name}`);
    blocks.push('```bash');
    blocks.push(cmd);
    blocks.push('```');
    blocks.push('');
  }

  return blocks.join('\n');
}
