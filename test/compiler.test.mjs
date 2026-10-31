// SPDX-License-Identifier: MIT
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compile } from '../src/compiler.js';
import { FixtureMobbinAdapter } from '../src/adapter.js';
import { SURFACES } from '../src/types.js';

async function build() {
  const out = mkdtempSync(join(tmpdir(), 'mobbin-ui-'));
  const results = await compile({ out });
  return { out, results };
}

describe('Mobbin adapter contract', () => {
  test('searchScreens returns ranked reference metadata', async () => {
    const adapter = new FixtureMobbinAdapter();
    const screens = await adapter.searchScreens({ query: SURFACES.paywall.query, platform: 'web', limit: 10 });
    assert.ok(screens.length >= 2);
    assert.ok(screens.some((screen) => screen.app === 'Revolut'));
    assert.ok(screens.every((screen) => Array.isArray(screen.patterns)));
  });
});

describe('surface compiler', () => {
  test('compiles all five surfaces with boards and tokens', async () => {
    const { out, results } = await build();
    assert.equal(results.length, 5);
    for (const result of results) {
      assert.ok(existsSync(join(out, result.slug, 'Component.tsx')));
      assert.ok(existsSync(join(out, result.slug, 'tokens.ts')));
      assert.ok(existsSync(join(out, '.mobbin', `${result.slug}.html`)));
    }
    assert.ok(existsSync(join(out, 'index.html')));
  });

  test('paywall includes price CTA, soft rejection, and objection copy', () => {
    const source = readFileSync('generated/tiered-paywall/Component.tsx', 'utf8');
    assert.match(source, /Best for you/);
    assert.match(source, /Start Pro — \$299\/mo/);
    assert.match(source, /—/);
    assert.match(source, /Cancel anytime/);
    assert.match(source, /focus-visible:ring-2/);
    assert.match(source, /min-h-11/);
    assert.doesNotMatch(source, /✕/);
  });

  test('KYC uses a stepper, pre-flight, and trust badge', () => {
    const source = readFileSync('generated/kyc-stepper/Component.tsx', 'utf8');
    assert.match(source, /aria-label="Verification steps"/);
    assert.match(source, /Step 2 of 3/);
    assert.match(source, /Before you start/);
    assert.match(source, /Encrypted and stored securely/);
  });

  test('dashboard is keyboard-first with an evidence drawer', () => {
    const source = readFileSync('generated/keyboard-dashboard/Component.tsx', 'utf8');
    assert.match(source, /⌘K/);
    assert.match(source, /aria-label="Evidence drawer"/);
    assert.match(source, /<table/);
    assert.match(source, /focus-visible/);
  });

  test('chat has suggestion chips and citation drill-through', () => {
    const source = readFileSync('generated/agentic-chat/Component.tsx', 'utf8');
    assert.match(source, /Suggested questions/);
    assert.match(source, /Citation 1/);
    assert.match(source, /aria-label="Open source citation 1"/);
    assert.match(source, /sr-only/);
  });

  test('billing has usage meter and invoice ledger', () => {
    const source = readFileSync('generated/usage-billing/Component.tsx', 'utf8');
    assert.match(source, /role="progressbar"/);
    assert.match(source, /Invoices/);
    assert.match(source, /Download/);
    assert.match(source, /Taxes included/);
  });

  test('all generated components carry accessibility invariants', () => {
    for (const definition of Object.values(SURFACES)) {
      const source = readFileSync(join('generated', definition.slug, 'Component.tsx'), 'utf8');
      assert.match(source, /focus-visible/, definition.slug);
      assert.match(source, /min-h-11/, definition.slug);
      assert.match(source, /aria-/, definition.slug);
      assert.match(source, /motion-reduce/, definition.slug);
    }
  });

  test('board labels fixture provenance honestly', () => {
    const board = readFileSync('generated/.mobbin/tiered-paywall.html', 'utf8');
    assert.match(board, /fixture metadata/);
    assert.match(board, /not copied screenshots/);
    assert.match(board, /Best for you/);
  });

  test('unknown surface fails closed', async () => {
    await assert.rejects(() => compile({ surface: 'nope', out: '/tmp/nope' }));
  });
});
