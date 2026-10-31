// SPDX-License-Identifier: MIT
import { readFileSync } from "node:fs";

export class FixtureMobbinAdapter {
  constructor(path = new URL("../fixtures/screens.json", import.meta.url)) {
    this.screens = JSON.parse(readFileSync(path, "utf8"));
  }

  async searchScreens({ query, platform = "web", limit = 10 }) {
    const terms = String(query).toLowerCase().split(/\s+/).filter(Boolean);
    return this.screens
      .filter((screen) => screen.platform === platform)
      .map((screen) => {
        const text = `${screen.title} ${screen.patterns.join(" ")} ${screen.microcopy.join(" ")}`.toLowerCase();
        return { screen, score: terms.filter((term) => text.includes(term)).length };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.screen.id.localeCompare(b.screen.id))
      .slice(0, limit)
      .map((item) => item.screen);
  }
}
