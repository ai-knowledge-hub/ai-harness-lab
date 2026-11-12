# React lab mobile comparison · 11 November 2026

These four JSON files are unmodified output from the reviewed #42 script, using `--route /learn/algorithms/visualizers`. The order was baseline-a, astro-a, baseline-b, astro-b, with five cold samples in each batch. The independent baseline application is `cc921b2`, preserved at `5c8d173`; the candidate application is `644e62c`. [SHA-256 identities](artifacts.json) record the lab document and browser modules actually served. Follow-up evidence/test changes do not alter application output.

Both artifacts were built with Node 22.22.0 and served by Vite preview 7.3.2 on the same Apple M2, to keep local transfer behaviour comparable. Measurement used Node 25.8.2 and Chromium 147.0.7727.15. Each raw file records the same mobile profile: 390 × 844 at DPR 3, fourfold CPU throttling, cold caches, 150 ms latency, 1.6 Mb/s down and 0.75 Mb/s up. Paint is a separate uninterrupted five-second navigation. Script/interaction measurement verifies step 1 → Next → step 2. Local tests/builds and hosted-browser work did not run concurrently with measurement.

From the candidate checkout, serve both artifacts in separate terminals:

```sh
node node_modules/vite/bin/vite.js preview --outDir /absolute/path/to/baseline/dist --host 127.0.0.1 --port 4183 --strictPort
node node_modules/vite/bin/vite.js preview --outDir dist --host 127.0.0.1 --port 4184 --strictPort
```

Then run sequentially:

```sh
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4183 --route /learn/algorithms/visualizers > baseline-a.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4184 --route /learn/algorithms/visualizers > astro-a.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4183 --route /learn/algorithms/visualizers > baseline-b.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4184 --route /learn/algorithms/visualizers > astro-b.json
```

Aggregates and scope are in the [lab integration report](../../harness-react-lab.md). The 63,477-byte gate applies to reading pages, rather than this interactive lab. Local counts include the analytics SDK but exclude the platform-only analytics script, whose endpoint is absent on loopback. Hosted preview routing is verified separately. These timings are synthetic local evidence, not production real-user measurements; #47 still owns measurements on the final release candidate.
