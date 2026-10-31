# Mobbin-UI-Compiler Results

## Environment

| Item | Value |
|---|---|
| Date | 2026-10-31 |
| OS | macOS (Apple Silicon) |
| Node | 26.3.0 |
| Tests | 10/10 passing |
| Mobbin MCP | Unavailable; fixture adapter used |
| Browser audit | Not executed |

## Generated artifacts

| Surface | References | Apps represented | Component |
|---|---:|---|---|
| KYC stepper | 2 | Revolut, Monzo | `generated/kyc-stepper/Component.tsx` |
| Tiered paywall | 2 | Stripe, Revolut | `generated/tiered-paywall/Component.tsx` |
| Keyboard dashboard | 5 | Linear, Stripe, Notion, Perplexity | `generated/keyboard-dashboard/Component.tsx` |
| Agentic chat | 2 | Claude, Perplexity | `generated/agentic-chat/Component.tsx` |
| Usage billing | 1 | Stripe | `generated/usage-billing/Component.tsx` |

All five boards are in `generated/.mobbin/`; the gallery is
`generated/index.html`.

## What was verified

- The adapter returns ranked reference metadata for each surface query.
- Every surface emits a component, token file, board, and README.
- Paywall includes the price in the CTA, the "Best for you" column, em-dash
  unavailable features, and objection-killer microcopy.
- KYC includes the step indicator, pre-flight explanation, and encryption trust
  badge.
- Dashboard includes ⌘K and J/K hints, a semantic table, and an evidence drawer.
- Chat includes suggestion chips and a labelled citation drill-through.
- Billing includes a progressbar usage meter, invoice table, download actions,
  and tax note.
- Every component contains focus-visible, 44 px target, aria labels, and
  reduced-motion classes.
- Unknown surfaces fail closed.

## Not executed

- **Live Mobbin `search_screens`** — the MCP server is not available here.
- **Playwright/axe-core/Lighthouse** — generated source was not mounted in a
  browser; no WCAG AAA or Lighthouse 100 claim.
- **React 19/Tailwind/TanStack build** — no frontend dependency install.
- **Cloudflare Pages/Vercel/OCI compiler service** — no hosting/cloud access.
- **`npx ui-skills`** — constraints are encoded in templates, not enforced by
  the external CLI.

## Reproduce

```bash
cd repos/Mobbin-UI-Compiler
node bin/mobbin-compile.mjs --surface all
npm test
```
