# Astro pilot optimisation measurements — 11 November 2026

Four unmodified JSON outputs from `scripts/measure-migration-baseline.mjs`, collected sequentially in this order:

1. [baseline-a.json](baseline-a.json)
2. [astro-a.json](astro-a.json)
3. [baseline-b.json](baseline-b.json)
4. [astro-b.json](astro-b.json)

Each output contains five cold mobile samples, with paint and interaction measured in separate navigations. All 20 samples are conclusive. The runner, CPU/network settings, viewport, and timing windows are embedded in each JSON file. Both servers used Vite preview 7.3.2 on the same Apple M2; no browser test suite ran during the benchmark. Artifacts were built with Node 22.22.0; measurements ran with Node 25.8.2 and Chromium 147.0.7727.15.

- Baseline application: `cc921b2`, preserved in the #42 checkout at `5c8d173daec3249c7403ba328478dfe21c9faea5`. Intervening commits only added measurement code and documentation.
- Optimised application: `bb21aada1c73e83aeabe52ce8cbbbd10fed67064`.
- Unchanged measurement script SHA-256: `faa0ab1860d6929f3a5fe04bf2a4feb728d761b1fbe725305d6623a5457f98f5`.
- Baseline JavaScript artifact SHA-256: `0be1717d2d5a9b3d15bc1c440ba170fc2505efebebed76b16f93969a9eef58af` (`assets/index-DUeuyHZH.js`).
- Optimised guide HTML SHA-256: `53665ab64cd561ad1f78350f42191f2166e85b6ab5705255c9b4b44507f9cd3a` (`learn/system-design/chatgpt-ads/index.html`).

The [pilot report](../../harness-astro-pilot.md#measurements) gives the reproduction commands, summary statistics, limits, and migration decision. These local controlled measurements exclude the Vercel preview toolbar and authentication flow, as did the original baseline protocol.
