# Mobbin-UI-Compiler

Reference-driven UI compiler for the five highest-value SaaS surfaces. It takes a
surface definition (or PRD), queries a **Mobbin `search_screens`-style adapter**,
extracts layout tokens and microcopy patterns, writes a local reference board,
and emits React 19 + TypeScript + Tailwind component source.

> **Environment boundary:** the live Mobbin Model Context Protocol server is not
> available in this workspace. The compiler ships a `FixtureMobbinAdapter` that
> implements the same `searchScreens({ query, platform, limit })` contract with
> synthetic reference metadata. The boards are explicitly labelled as fixtures,
> not copied Mobbin screenshots. No claim of live Mobbin retrieval is made.

## Surfaces

| Surface | Generated component | Key reference mechanisms |
|---|---|---|
| Neobank KYC | `kyc-stepper/Component.tsx` | 3-step progress, pre-flight explanation, encryption trust badge |
| Tiered paywall | `tiered-paywall/Component.tsx` | price in CTA, "Best for you", em-dash soft rejection, objection killer |
| Keyboard dashboard | `keyboard-dashboard/Component.tsx` | ⌘K hint, dense table, status text+color, evidence drawer |
| Agentic chat | `agentic-chat/Component.tsx` | suggestion chips, citation drill-through, labelled composer |
| Usage billing | `usage-billing/Component.tsx` | usage meter, invoice ledger, download actions, tax note |

## Commands

```bash
npm run compile      # regenerate all five surfaces into generated/
npm test             # adapter + surface + accessibility invariant tests
node bin/mobbin-compile.mjs --surface paywall --out generated
```

Generated artifacts per surface:

- `Component.tsx` — Tailwind component source with semantic landmarks and focus
  states.
- `tokens.ts` — spacing, radius, density, primary role, and type scale.
- `README.md` — provenance and extracted rules.
- `generated/.mobbin/<slug>.html` — self-contained reference board.
- `generated/index.html` — gallery.

## UI constraints encoded in templates

- Minimum 44 px targets (`min-h-11`).
- Visible `focus-visible:ring-2` focus states.
- `aria-label` / `aria-labelledby` on navigation, drawers, meters, citations, and
  icon-free controls.
- Status always includes text, not color alone.
- `motion-reduce:transition-none` on interactive surfaces.
- Semantic `main`, `nav`, `section`, `table`, `form`, and labelled inputs.

These are source-level invariants tested in Node. They are **not** a substitute
for a browser accessibility audit.

## Tests

`npm test` — 10 tests:

- adapter ranking and contract,
- all five surfaces compile with boards/tokens/components,
- paywall CTA/price/em-dash/objection copy,
- KYC stepper/pre-flight/trust badge,
- dashboard keyboard hints and evidence drawer,
- chat suggestions and citation drill-through,
- billing usage meter and invoice ledger,
- accessibility invariants across every component,
- fixture provenance labeling,
- unknown surface fails closed.

## Status and limitations

- **Live Mobbin MCP not executed.** Fixture data only.
- **No Playwright, axe-core, or Lighthouse run.** No browser dependency was
  installed; generated components were not mounted.
- **No React build/typecheck.** The compiler emits source; it does not install
  React 19/Tailwind/TanStack.
- **No Cloudflare/Vercel/OCI deployment.** No hosting credentials.
- **No `npx ui-skills` execution.** Constraints are encoded as template rules and
  source tests.

## License

MIT. Copyright (c) 2024-2026 Soumya Debnath.
