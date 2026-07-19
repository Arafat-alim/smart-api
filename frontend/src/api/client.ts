import { GenerateResponse } from '../types';

export async function generate(file: File): Promise<GenerateResponse> {
  const formData = new FormData();
  formData.append('collection', file);

  const res = await fetch('/api/generate', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Generation failed');
  }

  return data as GenerateResponse;
}
