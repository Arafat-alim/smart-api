import { useState } from 'react';
import Upload from './pages/Upload';
import Results from './pages/Results';
import { GenerateResponse } from './types';

export default function App() {
  const [result, setResult] = useState<GenerateResponse | null>(null);

  if (!result) {
    return <Upload onGenerated={setResult} />;
  }

  return <Results result={result} onReset={() => setResult(null)} />;
}
