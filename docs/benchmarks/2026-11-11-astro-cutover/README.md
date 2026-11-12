# Final Astro cutover measurements · 11 November 2026

The four sample files are unmodified output of the reviewed `scripts/measure-migration-baseline.mjs`. Baseline/Astro/baseline/Astro order, five cold samples of each of four routes in each batch: **80/80 conclusive samples**, ten per route/build. Paint and script/interaction measurements use separate navigations; paint has no clicks or scrolling. Outstanding render assets make a sample inconclusive. Both walkthrough/lab script samples assert step 1 → Next → step 2.

The independent #42 artifact is application `cc921b22699796c92fd30c9d33dcc7cce981f08f`, preserved in checkout `5c8d173`. Its previously recorded document/script hashes were checked before measurement. The measured Astro implementation is `0c3b79cf0d2a1d7918f14f9d612b51f7efd6e85a`. The subsequent Node-major constraint changes deployment selection, not application output: rebuilding with that constraint reproduces all 52 file hashes. [Complete artifact hashes and environment-parity evidence](artifacts.json).

The Astro artifact was built with Node 22.23.5; the frozen independent artifact retains the previously verified Node 22.22.0 build. Both are served through the same Vite preview 8.3.8 transport. The unchanged benchmark runs with Node 25.8.2 and Chromium 147.0.7727.15 on Apple M2: 390 × 844, DPR 3, mobile touch, fourfold CPU slowdown, 150 ms latency, 1.6 Mb/s down and 0.75 Mb/s up. Builds, other browser tests and hosted inspection were stopped during all four batches.

| Route | Baseline → Astro FCP median, ms | Baseline → Astro LCP median, ms | Baseline → Astro gzip JavaScript |
| --- | ---: | ---: | ---: |
| Home | 540 → 498 | 1,284 → 858 | 126,954 → 1,470 |
| API design | 478 → 446 | 478 → 446 | 126,954 → 1,470 |
| ChatGPT Ads | 500 → 484 | 500 → 484 | 126,954 → 2,674 through Next |
| React lab | 502 → 420 | 502 → 476 | 126,954 → 96,412 through Next |

All reading routes are below the 63,477-byte gate. The lab transfers 30,542 fewer bytes (**24.1% less**) than baseline and is evaluated separately from the reading budget. Every FCP/LCP median passes the paired allowance of baseline + max(100 ms, 10%), with more than 40 ms margin. [Aggregates, ranges and individual gate decisions](summary.json). These local counts include the analytics SDK but exclude Vercel's platform-served script absent on loopback; hosted SDK injection is verified separately. Synthetic timings do not establish production field performance.

## Reproduce

Use the frozen independent artifact and a frozen candidate build. From the candidate checkout, serve each with the same transport in separate terminals:

```sh
node node_modules/vite/bin/vite.js preview --outDir /absolute/path/to/baseline/dist --host 127.0.0.1 --port 4183 --strictPort
node node_modules/vite/bin/vite.js preview --outDir dist --host 127.0.0.1 --port 4184 --strictPort
```

Then run sequentially, with other builds/browser work stopped:

```sh
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4183 > baseline-a.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4184 > astro-a.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4183 > baseline-b.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4184 > astro-b.json
```

The application was rebuilt with `pnpm build:deployment` with `VERCEL_ENV` unset, `preview` and `production`, and all 52 files matched. This varies that selector in the same local public environment; it does not claim hosted public analytics configuration is identical across deployment environments. Keep actual production-environment verification in the [release runbook](../../harness-astro-cutover.md).
