# Smart API Builder — Backend

Express + TypeScript API. Validates a Postman v2.1 collection, parses it, classifies each endpoint's API type, and generates 7 deterministic code artifacts. No AI calls at runtime.

## Run

```bash
npm install
npm run dev      # ts-node-dev, http://localhost:4000
npm run build     # tsc -> dist/
npm start          # node dist/index.js
npm test            # vitest run (28 tests)
```

## Endpoint

### `POST /api/generate`

`multipart/form-data`:
- `collection` (file, required) — Postman v2.1 collection JSON
- `baseUrl` (string, optional) — overrides auto-detected base URL

**Responses:**
- `200` — `{ docs, sdk, curl, hooks, types, openapi, mockServer, baseUrl, endpointsMeta, zipBase64 }`
- `400` — invalid JSON, failed schema validation (`details: string[]`), or invalid `baseUrl` override
- `500` — artifact generation failed

## Pipeline (`src/routes/generate.ts`)

```
req.file → JSON.parse → validatePostmanCollection (ajv, draft-04)
         → parseCollection (baseUrl resolve + auth extract + classify)
         → 7x generate*(endpoints) → buildZip → base64 response
```

## Modules

| File | Responsibility |
|---|---|
| `validator.ts` | Validates against vendored official Postman v2.1 JSON Schema (`schemas/postman-collection-v2.1.schema.json`) via `ajv-draft-04` — required since the official schema is draft-04 and plain `ajv` v8 dropped draft-04 support. No network fetch. |
| `parser.ts` | `parseCollection(collection, {baseUrlOverride?})` → `ParsedCollection`. Recursively flattens folders, extracts auth (`extractAuth`: request-level wins, falls back to collection-level, never captures the secret `value` field for apikey auth — only `key`/`in`), resolves base URL (`autoExtractBaseUrl`, or override — throws on invalid override rather than silently falling back). |
| `classifier.ts` | `classifyEndpoint(input)` → `'REST' \| 'WEBHOOK' \| 'WEBSOCKET' \| 'SOAP'`. Pure function, priority order: WebSocket (protocol `ws`/`wss`) → SOAP (XML content-type + `SOAPAction` header or SOAP envelope body) → Webhook (POST + name/path/folder matches `/webhook\|callback\|hook/i`) → REST default. |
| `generators/docs.ts` | Markdown API documentation. |
| `generators/sdk.ts` | Axios-based TypeScript SDK, one function per endpoint. |
| `generators/curl.ts` | cURL command per endpoint. |
| `generators/hooks.ts` | React Query hooks (`useQuery`/`useMutation`) wrapping the generated SDK. |
| `generators/typesGen.ts` | TypeScript interfaces inferred from response examples. |
| `generators/openapi.ts` | OpenAPI 3.0 YAML — `servers:` from resolved base URL, `components.securitySchemes` derived per distinct detected auth type, per-path `security:` for authenticated endpoints. |
| `generators/mock.ts` | Runnable Express mock server returning recorded response examples. |
| `generators/util.ts` | Shared name-derivation (`deriveFunctionName`, `deriveTypeName`, case conversion) and string-sanitization helpers used across generators. |
| `zip.ts` | Bundles all generated files into a zip (`archiver`). |
| `types.ts` | Shared types: `Endpoint`, `ApiType`, `AuthType`, `AuthInfo`, `ParsedCollection`. |

## Tests

`src/__tests__/` — `vitest` + `supertest`, 28 tests: validator (3), classifier (9), parser (7), openapi (5), generate route (4).

## Deployment

Deployed as a Vercel serverless function. `api/index.ts` at the repo root re-exports the Express `app` from `src/index.ts`; `app.listen()` is skipped when `process.env.VERCEL === '1'`. Root `vercel.json` rewrites all traffic to `api/`.
