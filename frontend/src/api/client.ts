import { GenerateResponse } from '../types';

export async function generate(file: File, baseUrlOverride?: string): Promise<GenerateResponse> {
  const formData = new FormData();
  formData.append('collection', file);
  if (baseUrlOverride && baseUrlOverride.trim() !== '') {
    formData.append('baseUrl', baseUrlOverride.trim());
  }

  const apiUrl = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${apiUrl}/api/generate`, {
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
