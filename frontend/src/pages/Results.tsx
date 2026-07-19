import { useState } from 'react';
import { GenerateResponse } from '../types';

interface Props {
  result: GenerateResponse;
  onReset: () => void;
}

type TabKey = 'overview' | 'docs' | 'sdk' | 'curl' | 'hooks' | 'types' | 'openapi' | 'mockServer';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'docs', label: 'Docs' },
  { key: 'sdk', label: 'SDK' },
  { key: 'curl', label: 'cURL' },
  { key: 'hooks', label: 'Hooks' },
  { key: 'types', label: 'Types' },
  { key: 'openapi', label: 'OpenAPI' },
  { key: 'mockServer', label: 'Mock Server' },
];

const API_TYPE_CLASS: Record<string, string> = {
  REST: 'badge-rest',
  WEBHOOK: 'badge-webhook',
  WEBSOCKET: 'badge-websocket',
  SOAP: 'badge-soap',
};

export default function Results({ result, onReset }: Props) {
  const [active, setActive] = useState<TabKey>('overview');

  function downloadZip() {
    const byteChars = atob(result.zipBase64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart-api-builder-output.zip';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <h1>Generated Artifacts</h1>
        <div>
          <button onClick={downloadZip}>Download ZIP</button>
          <button onClick={onReset}>Start Over</button>
        </div>
      </div>

      {result.baseUrl && (
        <p className="base-url-display">
          Base URL: <code>{result.baseUrl}</code>
        </p>
      )}

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={active === tab.key ? 'tab active' : 'tab'}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === 'overview' ? (
        <table className="overview-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Path</th>
              <th>Name</th>
              <th>API Type</th>
              <th>Auth</th>
            </tr>
          </thead>
          <tbody>
            {result.endpointsMeta.map((ep, i) => (
              <tr key={`${ep.method}-${ep.path}-${i}`}>
                <td>{ep.method}</td>
                <td>{ep.path}</td>
                <td>{ep.name}</td>
                <td>
                  <span className={`badge ${API_TYPE_CLASS[ep.apiType] || 'badge-rest'}`}>{ep.apiType}</span>
                </td>
                <td>
                  <span className={`badge ${ep.authType === 'none' ? 'badge-auth-none' : 'badge-auth-set'}`}>
                    {ep.authType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <pre className="code-view">{result[active]}</pre>
      )}
    </div>
  );
}
