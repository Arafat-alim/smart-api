import { useState, useRef } from 'react';
import { generate } from '../api/client';
import { GenerateResponse } from '../types';

interface Props {
  onGenerated: (result: GenerateResponse) => void;
}

export default function Upload({ onGenerated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const result = await generate(file, baseUrl);
      onGenerated(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="upload-page">
      <h1>Smart API Builder</h1>
      <p>Upload a Postman Collection (v2.1 JSON) to generate docs, SDK, hooks, types, OpenAPI spec, and a mock server.</p>

      <input
        type="text"
        className="base-url-input"
        placeholder="Base URL (optional — auto-detected if blank)"
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
      />

      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? 'Generating...' : 'Click or drag a collection.json file here'}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />

      {error && <div className="error-banner">{error}</div>}
    </div>
  );
}
