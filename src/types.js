// SPDX-License-Identifier: MIT
// Reference screen contract matching a Mobbin search_screens-style adapter.

export const SURFACES = {
  kyc: {
    slug: "kyc-stepper",
    name: "Neobank KYC Progressive Disclosure",
    query: "neobank identity verification stepper pre-flight",
    platform: "web",
    rules: [
      "Show an explicit step indicator and current step count.",
      "Explain why the next step needs camera or document access before invoking it.",
      "Keep a persistent trust badge with encryption and storage language.",
    ],
  },
  paywall: {
    slug: "tiered-paywall",
    name: "High-Converting Tiered Paywall",
    query: "tiered pricing paywall CTA price soft rejection",
    platform: "web",
    rules: [
      "Put the price inside the primary CTA and mark one column as best for you.",
      "Use em dashes for unavailable free-tier features, not red X marks.",
      "Put objection-killer microcopy directly above the CTA and a risk reversal below it.",
    ],
  },
  dashboard: {
    slug: "keyboard-dashboard",
    name: "Keyboard-First Telemetry Dashboard",
    query: "linear dashboard command palette dense table evidence drawer",
    platform: "web",
    rules: [
      "Expose a command-palette shortcut and keyboard focus rings.",
      "Use a dense table with a drill-through evidence drawer, not a spreadsheet grid.",
      "Show status with text plus color, never color alone.",
    ],
  },
  chat: {
    slug: "agentic-chat",
    name: "Agentic Chat with Citation Drill-Through",
    query: "claude chat empty state suggested questions citations",
    platform: "web",
    rules: [
      "Empty state offers suggested-question chips instead of a blank canvas.",
      "Every answer citation is a button that opens the source drawer.",
      "Keep the composer keyboard-accessible and label the send action.",
    ],
  },
  billing: {
    slug: "usage-billing",
    name: "Stripe-Style Usage Billing Ledger",
    query: "stripe billing usage meter invoice ledger",
    platform: "web",
    rules: [
      "Show usage against quota with a plain-language overage note.",
      "Use a semantic invoice table with status text and download actions.",
      "Never hide taxes or the next charge date in a tooltip only.",
    ],
  },
};
