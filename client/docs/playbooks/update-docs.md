# Playbook: Update Documentation

**Use when**: Updating, adding, or removing documentation files without changing code.

## Pre-requisites

Load these docs before starting:
- `maintenance.md` — the maintenance protocol
- `docs/knowledge-index.md` — current document structure
- The specific doc being updated

## Procedure

### Step 1: Identify Change Type

| Change | What To Do |
|---|---|
| New document | Create file, update `knowledge-index.md` |
| Modify existing document | Edit in place, check cross-references |
| Remove document | Delete file, update `knowledge-index.md` |
| Move document | Move file, update ALL cross-references |
| Rename document | Rename, update `knowledge-index.md` and cross-references |

### Step 2: Check the Single Responsibility Rule

Before creating a new document, verify:
- Does this concept already belong to an existing document?
- Can it be added to an existing document instead?
- Does it create duplication with another document?

**Never create a document that duplicates responsibility of another.**

### Step 3: Update Cross-References

If you rename or move a file, find all references to it:
- `AI.md`
- `knowledge-index.md`
- Other docs that link to it
- AGENTS.md (if referenced there)

Search for the filename across all `.md` files:
```
grep -r "old-filename.md" docs/ *.md
```

### Step 4: Update knowledge-index.md

- New document → add to the appropriate category table
- Deleted document → remove from table and cross-reference map
- Renamed document → update entry in table and all link paths
- Use correct relative path from `docs/` root

### Step 5: Update Cross-Reference Map

The Mermaid diagram at the bottom of `knowledge-index.md` must reflect the new relationships.

## Post-Implementation

- [ ] No broken links (verify all `[text](path.md)` resolve)
- [ ] No duplicated information
- [ ] `knowledge-index.md` updated
- [ ] Single responsibility maintained
- [ ] Cross-reference map updated
