# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists: it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/decisions/`** is this repo's ADR log: numbered, append-only records with a README index (`0001` onward). Read the ones that touch the area you're about to work in. There is no `docs/adr/`; do not create one. A new decision that reverses an old one says so, and the mission reading order in `docs/mission/README.md` comes first.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

This repo is single-context:

```
/
├── CONTEXT.md                 (glossary; created lazily by /domain-modeling)
├── docs/decisions/            (the ADR log, numbered, append-only, indexed in README.md)
│   ├── 0001-content-site-is-the-front-door.md
│   └── 0021-product-first-positioning.md
├── docs/mission/              (north star, compliance boundary, CDG rules; read first)
└── src/
```

Multi-context layout, not used here (would need `CONTEXT-MAP.md` at the root):

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context-specific decisions
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts decision 0014 (no CDG questions), but worth reopening because..._
