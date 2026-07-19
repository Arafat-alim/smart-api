# Smart API Builder

Upload a Postman v2.1 collection. Get a full API project scaffold back — docs, TypeScript SDK, cURL examples, React Query hooks, TypeScript interfaces, OpenAPI 3.0 spec, and a runnable Express mock server. Zipped, ready to drop into your codebase.

**Zero AI calls at runtime.** Every artifact is produced by deterministic parsing, heuristics, and templated codegen — no LLM in the request path.

**Live demo:** https://hackathon.arafat-alim.co.in/

## What it does

1. **Validate** — collection checked against the official Postman v2.1 JSON Schema (draft-04, vendored, no network fetch).
2. **Parse** — recursively flattens folders, resolves base URL (auto-detected from request URLs, or user-supplied override), resolves auth per endpoint (request-level auth wins, falls back to collection-level).
3. **Classify** — each endpoint tagged as `REST`, `WEBHOOK`, `WEBSOCKET`, or `SOAP` via pure heuristics: protocol scheme (`ws`/`wss`), `Content-Type`/`SOAPAction` headers + body shape (XML/SOAP envelope), naming/path patterns (`webhook|callback|hook`) for POST endpoints, REST as default.
4. **Generate** — 7 artifacts from the parsed + classified endpoint list, all deterministic template code, no AI:
   - `docs/API.md` — Markdown API documentation
   - `sdk/api.ts` — Axios-based TypeScript SDK
   - `curl/examples.md` — cURL command examples
   - `hooks/hooks.ts` — React Query hooks
   - `types/models.ts` — TypeScript interfaces inferred from response examples
   - `openapi.yaml` — OpenAPI 3.0 spec, with `servers:` from the resolved base URL and `components.securitySchemes` derived from detected auth types
   - `mock/server.ts` — runnable Express mock server
5. **Ship** — all artifacts zipped and returned alongside a JSON preview (`endpointsMeta`: name, method, path, apiType, authType) rendered as a dashboard.

## Stack

- **Backend:** Express + TypeScript, `ajv-draft-04` for schema validation, `archiver` for zip, `vitest` + `supertest` for tests (28/28 passing). Deployed as a Vercel serverless function via `api/index.ts`.
- **Frontend:** React + Vite + TypeScript. Upload page (file + optional base URL override) → Results page (tabbed preview: Overview dashboard + one tab per artifact, zip download).

## Repo layout

```
backend/    Express API — validation, parsing, classification, codegen (see backend/README.md)
frontend/   React SPA — upload + results dashboard (see frontend/README.md)
api/        Vercel serverless entrypoint (thin re-export of backend/src/index.ts)
vercel.json Vercel rewrite config (routes everything through api/)
sample-collection.json  Minimal Postman v2.1 fixture for local testing
```

## Quick start (local)

```bash
# Backend
cd backend
npm install
npm run dev        # http://localhost:4000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev         # http://localhost:5173
```

Upload `sample-collection.json` from the root through the UI, or hit the API directly:

```bash
curl -X POST http://localhost:4000/api/generate \
  -F "collection=@sample-collection.json" \
  -F "baseUrl=https://api.example.com"
```

