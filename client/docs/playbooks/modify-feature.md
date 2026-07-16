# Playbook: Modify Feature

**Use when**: Modifying code within an existing feature (components, store, hooks, pages).

## Pre-requisites

Load these docs before starting:
- `docs/04-features/<feature-name>.md` — feature documentation
- `docs/03-development/conventions.md` — patterns to follow
- `docs/02-domain/entities.md` — if entity attributes change
- `docs/02-domain/state-machines.md` — if status transitions change
- `docs/02-domain/business-rules.md` — if business rules change

## Procedure

### Step 1: Identify Scope

- What feature is affected?
- What specific files will change?
- Does this affect entities, rules, or state machines?

### Step 2: Load Feature Context

Read the feature doc at `docs/04-features/<feature-name>.md`. Understand current behavior before changing it.

### Step 3: Implement Change

Follow existing patterns in the feature. Do not introduce new patterns without updating `conventions.md`.

### Step 4: Detect Documentation Impact

Ask these questions:
- Did entity attributes change? → `docs/02-domain/entities.md`
- Did statuses or transitions change? → `docs/02-domain/state-machines.md`
- Did business rules change? → `docs/02-domain/business-rules.md`
- Did component responsibilities change? → `docs/04-features/<feature-name>.md`
- Did the feature's architecture change? → `docs/01-architecture/architecture-overview.md`
- Did API endpoints change? → `docs/05-reference/api-endpoints.md`

### Step 5: Update Only Affected Docs

Update only docs flagged in Step 4. Do not reindex everything.

### Step 6: Register Decision (if applicable)

If the change introduces a new convention, architectural pattern, or reverses a prior decision → `docs/decision-log.md`.

## Post-Implementation

- [ ] Run `npm run lint`
- [ ] Verify `npm run build` passes
- [ ] All affected docs updated
- [ ] No new doc duplication created
- [ ] Follow `maintenance.md` protocol
