import { useState } from 'react';
import { GenerateResponse } from '../types';

interface Props {
  result: GenerateResponse;
  onReset: () => void;
}

const TABS: { key: keyof GenerateResponse; label: string }[] = [
  { key: 'docs', label: 'Docs' },
  { key: 'sdk', label: 'SDK' },
  { key: 'curl', label: 'cURL' },
  { key: 'hooks', label: 'Hooks' },
  { key: 'types', label: 'Types' },
  { key: 'openapi', label: 'OpenAPI' },
  { key: 'mockServer', label: 'Mock Server' },
];

export default function Results({ result, onReset }: Props) {
  const [active, setActive] = useState<keyof GenerateResponse>('docs');

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

      <pre className="code-view">{result[active]}</pre>
    </div>
  );
}
