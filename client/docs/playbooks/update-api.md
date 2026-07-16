# Playbook: Update API

**Use when**: Changing API endpoints, request/response types, or service layer.

## Pre-requisites

Load these docs before starting:
- `docs/05-reference/api-endpoints.md` — current endpoint reference
- `API-CONTRATO.md` — full backend contract
- Feature docs for affected features (`docs/04-features/`)
- `docs/01-architecture/state-management.md` — if store actions change

## Procedure

### Step 1: Identify Impact

| Change | Affected Files |
|---|---|
| New endpoint | Service file, requests.ts, responses.ts, api-endpoints.md |
| Changed endpoint URL | Service file, api-endpoints.md |
| Changed request body | requests.ts, api-endpoints.md, store action |
| Changed response shape | responses.ts, api-endpoints.md, store action |
| Removed endpoint | Service file, api-endpoints.md, store actions |
| New error format | `shared/api/client.ts`, api-endpoints.md |

### Step 2: Update API Types

Follow the three-file pattern:
- `features/<name>/api/requests.ts` — input types
- `features/<name>/api/responses.ts` — output types
- `features/<name>/api/<name>.service.ts` — function signatures

### Step 3: Update Store Actions

If the store consumes the API:
- Update action to match new signature
- Adjust state shape if response changed
- Update error handling if error format changed

### Step 4: Update API Reference

In `docs/05-reference/api-endpoints.md`:
- Add new endpoint with request/response schema
- Update changed endpoint details
- Remove deleted endpoints

### Step 5: Update Contract (if shared)

If `API-CONTRATO.md` is the shared contract with backend:
- Sync changes with the contract document
- Coordinate with backend team if contract changes

## Post-Implementation

- [ ] Service file updated with new endpoint/changes
- [ ] Request/response types match new contract
- [ ] `docs/05-reference/api-endpoints.md` synchronized
- [ ] `API-CONTRATO.md` synchronized (if applicable)
- [ ] Store actions updated
- [ ] Feature docs updated if API usage changed
- [ ] ADR registered if this is a new API pattern or breaking change
