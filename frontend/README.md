# Smart API Builder — Frontend

React + Vite + TypeScript SPA. Upload a Postman collection, preview generated artifacts, download the zip.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # tsc -b && vite build
npm run preview     # serve production build locally
```

Expects the backend running at `http://localhost:4000` (see `../backend/README.md`) — configure the API base in `src/api/client.ts` if pointing elsewhere.

## Flow (`src/App.tsx`)

```
Upload (no result yet) → POST /api/generate → Results (result set)
```

Single piece of state (`result: GenerateResponse | null`) toggles between the two pages — no router.

## Pages

- **`pages/Upload.tsx`** — file dropzone for the Postman collection + optional "Base URL" text input (auto-detected if left blank). Calls `api/client.ts#generate(file, baseUrl)`.
- **`pages/Results.tsx`** — tabbed view: `Overview` (default), `Docs`, `SDK`, `cURL`, `Hooks`, `Types`, `OpenAPI`, `Mock Server`. Overview renders `endpointsMeta` as a table with colored badges — API type (`REST`/`WEBHOOK`/`WEBSOCKET`/`SOAP`) and auth presence (`none` vs. set). Other tabs render the corresponding generated file in a `<pre>` code view. Includes zip download (base64 → `Blob` → object URL).

## `src/api/client.ts`

`generate(file: File, baseUrl?: string): Promise<GenerateResponse>` — posts `multipart/form-data` to `/api/generate`; `baseUrl` field only appended when non-empty. Surfaces backend validation errors (`error`, `details[]`) on failure.

## `src/types.ts`

Mirrors the backend response shape: `GenerateResponse` (`docs`, `sdk`, `curl`, `hooks`, `types`, `openapi`, `mockServer`, `baseUrl`, `endpointsMeta`, `zipBase64`), `EndpointMeta`, `ApiType`, `AuthType`.
