# Playbook: Fix Bug

**Use when**: Fixing a bug in components, store logic, or API integration.

## Pre-requisites

Load these docs before starting:
- Feature doc at `docs/04-features/<feature-name>.md` for context
- `docs/02-domain/business-rules.md` — verify the bug isn't a misunderstood rule
- `docs/02-domain/state-machines.md` — if status-related bug

## Procedure

### Step 1: Reproduce the Bug

Understand the expected behavior vs actual behavior.

### Step 2: Identify Root File

| Symptom | Likely Location |
|---|---|
| Wrong UI state | Component rendering logic |
| State not updating | Store action or reducer |
| API returns unexpected data | Service layer or request types |
| Form validation issue | Zod schema or react-hook-form setup |
| Visual/styling issue | Tailwind classes or CSS |

### Step 3: Check Business Rules

Before fixing, verify the expected behavior against `docs/02-domain/business-rules.md`. The "bug" might be intentional behavior.

### Step 4: Fix the Code

Minimal change. Follow existing patterns in the file. Do not refactor unrelated code.

### Step 5: Check for Documentation Drift

If the bug was caused by docs being wrong (not code being wrong):
- Update the feature doc
- Update business rules if the rule was documented incorrectly

If the fix doesn't change behavior (pure implementation fix):
- No docs update needed

### Step 6: Verify Fix

Confirm the fix resolves the bug and doesn't introduce new issues.

## Post-Implementation

- [ ] Run `npm run lint`
- [ ] Bug is fixed and verified
- [ ] No regression in related features
- [ ] Docs updated only if behavior changed
