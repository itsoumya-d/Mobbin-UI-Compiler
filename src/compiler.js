// SPDX-License-Identifier: MIT
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SURFACES } from "./types.js";
import { FixtureMobbinAdapter } from "./adapter.js";
import { renderComponent, renderIndex, renderBoard, renderTokens } from "./templates.js";

function aggregate(screens) {
  const patterns = [...new Set(screens.flatMap((screen) => screen.patterns))];
  const microcopy = [...new Set(screens.flatMap((screen) => screen.microcopy))];
  const tokens = screens[0]?.tokens ?? { spacing: [4, 8, 12, 16, 24], radius: [12, 16], density: "comfortable", primary: "#111111" };
  return { patterns, microcopy, tokens, apps: [...new Set(screens.map((screen) => screen.app))] };
}

export async function compile({ adapter = new FixtureMobbinAdapter(), surface = "all", out = "generated" } = {}) {
  const keys = surface === "all" ? Object.keys(SURFACES) : [surface];
  const results = [];
  mkdirSync(join(out, ".mobbin"), { recursive: true });
  for (const key of keys) {
    const definition = SURFACES[key];
    if (!definition) throw new Error(`unknown surface: ${key}`);
    const screens = await adapter.searchScreens({ query: definition.query, platform: definition.platform, limit: 10 });
    if (screens.length === 0) throw new Error(`no reference screens for ${key}`);
    const extracted = aggregate(screens);
    const directory = join(out, definition.slug);
    mkdirSync(directory, { recursive: true });
    const boardPath = join(out, ".mobbin", `${definition.slug}.html`);
    writeFileSync(boardPath, renderBoard(definition, screens, extracted));
    writeFileSync(join(directory, "tokens.ts"), renderTokens(definition, extracted));
    writeFileSync(join(directory, "Component.tsx"), renderComponent(key, definition, extracted));
    writeFileSync(
      join(directory, "README.md"),
      `# ${definition.name}\n\nGenerated from ${screens.length} reference metadata rows: ${extracted.apps.join(", ")}.\n\nRules:\n${definition.rules.map((rule) => `- ${rule}`).join("\n")}\n`
    );
    results.push({ surface: key, slug: definition.slug, screens: screens.length, apps: extracted.apps, board: boardPath });
  }
  const index = renderIndex(results);
  writeFileSync(join(out, "index.html"), index);
  return results;
}
