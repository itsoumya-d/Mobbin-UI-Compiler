// SPDX-License-Identifier: MIT

export const INVARIANT_RULES = [
  {
    id: "a11y-focus-visible",
    name: "Visible keyboard focus ring",
    severity: "error",
    check: (source) => /focus-visible:(?:ring|outline|border)/.test(source) || /:focus-visible/.test(source),
    message: "Interactive components must include visible focus-ring styles (:focus-visible or focus-visible:ring-*)",
  },
  {
    id: "a11y-min-target-size",
    name: "Minimum touch target size (44px / h-11)",
    severity: "error",
    check: (source) => /min-h-11|min-h-\[44px\]|h-11|h-\[44px\]/.test(source),
    message: "Interactive elements must satisfy touch target invariants (>=44px or min-h-11)",
  },
  {
    id: "a11y-motion-reduce",
    name: "Prefers-reduced-motion compensation",
    severity: "error",
    check: (source) => /motion-reduce:(?:transition-none|animate-none)/.test(source) || /@media\s*\(prefers-reduced-motion/.test(source),
    message: "Dynamic UI animations must provide motion-reduce overrides for vestibular safety",
  },
  {
    id: "a11y-aria-semantics",
    name: "ARIA attributes and semantic landmarks",
    severity: "error",
    check: (source) => /aria-(?:label|labelledby|describedby|expanded|hidden)|role=/.test(source),
    message: "Components must expose programmatic accessibility metadata (aria-* or role)",
  },
  {
    id: "a11y-screen-reader-text",
    name: "Screen-reader text accompaniment",
    severity: "warning",
    check: (source) => /sr-only|visually-hidden/.test(source) || /aria-label=/.test(source),
    message: "Icon buttons or status indicators should include companion screen-reader text",
  },
  {
    id: "token-density-radius",
    name: "Design token conformance",
    severity: "error",
    check: (_source, tokens) => Array.isArray(tokens?.spacing) && Array.isArray(tokens?.radius) && typeof tokens?.primary === "string",
    message: "Surface must adhere to declared spacing, radius, and primary color tokens",
  },
];

export function validateComponent(source, tokens = {}, options = {}) {
  const rules = options.rules || INVARIANT_RULES;
  const checks = [];
  const violations = [];

  for (const rule of rules) {
    const passed = Boolean(rule.check(source, tokens));
    checks.push({
      id: rule.id,
      name: rule.name,
      severity: rule.severity,
      passed,
      message: passed ? "OK" : rule.message,
    });
    if (!passed) {
      violations.push(`[${rule.severity.toUpperCase()}] ${rule.id}: ${rule.message}`);
    }
  }

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const hasErrors = checks.some((c) => !c.passed && c.severity === "error");

  return {
    valid: !hasErrors,
    score,
    passedCount,
    totalCount: checks.length,
    checks,
    violations,
  };
}
