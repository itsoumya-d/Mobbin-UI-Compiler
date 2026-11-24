// SPDX-License-Identifier: MIT
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { validateComponent, INVARIANT_RULES } from '../src/validator.js';
import { SURFACES } from '../src/types.js';

describe('accessibility and design token validator', () => {
  const validTokens = {
    spacing: [4, 8, 12, 16, 24],
    radius: [12, 16],
    density: 'comfortable',
    primary: '#111111',
  };

  test('validates all compiled surface components with 100% invariant score', () => {
    for (const definition of Object.values(SURFACES)) {
      const source = readFileSync(join('generated', definition.slug, 'Component.tsx'), 'utf8');
      const result = validateComponent(source, validTokens);
      assert.equal(result.valid, true, `Expected valid component for ${definition.slug}`);
      assert.equal(result.score, 100, `Expected 100% score for ${definition.slug}`);
      assert.equal(result.violations.length, 0);
    }
  });

  test('validates that validation.json is generated for each surface', () => {
    for (const definition of Object.values(SURFACES)) {
      const valPath = join('generated', definition.slug, 'validation.json');
      assert.ok(existsSync(valPath), `validation.json should exist for ${definition.slug}`);
      const data = JSON.parse(readFileSync(valPath, 'utf8'));
      assert.equal(data.valid, true);
      assert.equal(data.score, 100);
      assert.ok(Array.isArray(data.checks));
    }
  });

  test('detects missing focus-visible rings as an error', () => {
    const brokenCode = `
      export default function Button() {
        return <button className="min-h-11 p-4 bg-blue-500 aria-label='Submit' motion-reduce:transition-none">Submit</button>;
      }
    `;
    const result = validateComponent(brokenCode, validTokens);
    assert.equal(result.valid, false);
    assert.ok(result.violations.some((v) => v.includes('a11y-focus-visible')));
  });

  test('detects target size violations under 44px', () => {
    const brokenCode = `
      export default function Link() {
        return <a href="#" className="h-6 p-1 focus-visible:ring-2 motion-reduce:transition-none aria-label='Link'">Small</a>;
      }
    `;
    const result = validateComponent(brokenCode, validTokens);
    assert.equal(result.valid, false);
    assert.ok(result.violations.some((v) => v.includes('a11y-min-target-size')));
  });

  test('detects missing motion-reduce overrides for animated components', () => {
    const brokenCode = `
      export default function Modal() {
        return <div className="min-h-11 focus-visible:ring-2 transition-all duration-300 aria-label='Dialog' role='dialog'>Content</div>;
      }
    `;
    const result = validateComponent(brokenCode, validTokens);
    assert.equal(result.valid, false);
    assert.ok(result.violations.some((v) => v.includes('a11y-motion-reduce')));
  });

  test('detects malformed design token structure', () => {
    const validCode = `
      export default function Card() {
        return <div className="min-h-11 focus-visible:ring-2 motion-reduce:transition-none aria-label='Card' role='region'>Card</div>;
      }
    `;
    const invalidTokens = { spacing: null, primary: 123 };
    const result = validateComponent(validCode, invalidTokens);
    assert.equal(result.valid, false);
    assert.ok(result.violations.some((v) => v.includes('token-density-radius')));
  });
});
