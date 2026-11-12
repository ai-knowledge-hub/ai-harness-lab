# Full-site Astro measurements · 11 November 2026

The four JSON files are unmodified output from `scripts/measure-migration-baseline.mjs`. Each contains five cold samples of home, API design, ChatGPT Ads and the algorithm lab, with independent paint and script/interaction navigations. They ran in `baseline-a`, `astro-a`, `baseline-b`, `astro-b` order on the same Apple M2. Hosted inspection took place between the first and second pair, with the inspection tab closed before measurements resumed; builds and browser test suites did not run alongside the benchmark.

The baseline artifact is the independent #42 application at `cc921b22699796c92fd30c9d33dcc7cce981f08f`, preserved in checkout `5c8d173` (subsequent changes there were measurement/docs only). The candidate implementation is `f024377bfc9e8685993b47f17fda012dca70e738`. [Artifact hashes](artifacts.json) identify the four documents, sitemap, robots and JavaScript files actually served; the follow-up evidence commit changes documentation only.

Both artifacts were built on Node 22.22.0 and served with Vite preview 7.3.2 to keep local transfer behaviour comparable. The benchmark used Node 25.8.2 and Chromium 147.0.7727.15. Each raw file records the unchanged profile: 390 × 844 at DPR 3, mobile touch, fourfold CPU throttling, cold caches, 150 ms latency, 1.6 Mb/s down and 0.75 Mb/s up. Paint is observed for five seconds without clicks or scrolling. Outstanding render assets make a sample inconclusive. A separate navigation counts same-origin successful script responses and independently gzipped executable inline scripts, then verifies stage 1 → Next → stage 2 before the interaction count.

## Reproduce

First build the two checkouts with their frozen lockfiles. Retain the original artifact separately from the candidate `dist`. From the candidate checkout, serve both using the same Vite version in separate terminals:

```sh
node node_modules/vite/bin/vite.js preview --outDir /absolute/path/to/baseline/dist --host 127.0.0.1 --port 4183 --strictPort
node node_modules/vite/bin/vite.js preview --outDir dist --host 127.0.0.1 --port 4184 --strictPort
```

Run these sequentially, with other test/build/browser work stopped:

```sh
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4183 > baseline-a.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4184 > astro-a.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4183 > baseline-b.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4184 > astro-b.json
```

See the [migration report](../../harness-astro-site.md#performance) and [machine-readable aggregates](summary.json) for medians, ranges, byte counts and gate decisions. Local measurements include the analytics SDK but exclude the platform-served script, because the Vercel endpoint is absent on loopback. Hosted injection was checked independently. These synthetic local results do not establish production field performance or analytics-dashboard ingestion.
