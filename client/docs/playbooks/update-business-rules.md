# Playbook: Update Business Rules

**Use when**: Changing domain rules, entity attributes, or state machine transitions.

## Pre-requisites

Load ALL of these docs before starting:
- `docs/02-domain/entities.md` — entity definitions
- `docs/02-domain/state-machines.md` — status transitions
- `docs/02-domain/business-rules.md` — current business rules
- Feature docs for affected features (`docs/04-features/`)
- `docs/00-core/glossary.md` — if terminology changes

## Procedure

### Step 1: Identify What Changes

| Type of Change | Docs to Update |
|---|---|
| New entity or attribute | `entities.md` + glossary |
| Changed attribute type/required | `entities.md` |
| New status value | `state-machines.md` + glossary + entities.md |
| New/removed transition | `state-machines.md` |
| New business rule | `business-rules.md` |
| Changed constraint/invariant | `business-rules.md` |

### Step 2: Update Domain Files First

Start at the most fundamental level and work up:
1. `glossary.md` — if new terms
2. `entities.md` — if entity structure changes
3. `state-machines.md` — if transitions change
4. `business-rules.md` — if rules change

### Step 3: Update Feature Docs

For each affected feature, update the corresponding `docs/04-features/` file to reflect the new domain rules.

### Step 4: Update Reference Docs (if needed)

- `docs/05-reference/api-endpoints.md` — if API contract changes
- `docs/05-reference/configuration.md` — if config changes

### Step 5: Update Types in Code

Sync TypeScript types with updated entity definitions:
- `features/<name>/types/index.ts`
- API request/response types
- Constants (status labels, colors)

### Step 6: Register Decision

Add an ADR in `docs/decision-log.md` if:
- This is a significant domain model change
- It reverses a prior business rule
- It introduces a new architectural constraint

## Post-Implementation

- [ ] All domain files consistent with each other
- [ ] Glossary updated with new/changed terms
- [ ] Code types match domain documentation
- [ ] Feature docs reflect new rules
- [ ] ADR registered if significant
