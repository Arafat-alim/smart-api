import { GenerateResponse } from '../types';

export async function generate(file: File, baseUrl?: string): Promise<GenerateResponse> {
  const formData = new FormData();
  formData.append('collection', file);
  if (baseUrl && baseUrl.trim() !== '') {
    formData.append('baseUrl', baseUrl.trim());
  }

  const baseUrl = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    const detail = Array.isArray(data.details) ? `: ${data.details.join('; ')}` : '';
    throw new Error((data.error || 'Generation failed') + detail);
  }

  return data as GenerateResponse;
}
