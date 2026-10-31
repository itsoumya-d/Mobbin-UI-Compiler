#!/usr/bin/env node
// SPDX-License-Identifier: MIT
import { compile } from "../src/compiler.js";
import { SURFACES } from "../src/types.js";

const args = process.argv.slice(2);
const surfaceIndex = args.indexOf("--surface");
const outIndex = args.indexOf("--out");
const surface = surfaceIndex >= 0 ? args[surfaceIndex + 1] : "all";
const out = outIndex >= 0 ? args[outIndex + 1] : "generated";
if (args.includes("--help")) {
  console.error("Usage: mobbin-compile [--surface all|kyc|paywall|dashboard|chat|billing] [--out dir]");
  process.exit(0);
}
const results = await compile({ surface, out });
console.log(`compiled ${results.length} surface(s) to ${out}`);
for (const result of results) console.log(`- ${result.surface}: ${result.screens} refs, ${result.apps.join(", ")}`);
