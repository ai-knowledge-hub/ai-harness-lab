# Narrow layout and zoom audit — 12 November 2026

Issue #61; base `114b6dd` (merged #72), feature branch `feature/narrow-layout-zoom`.
This is a local implementation audit, not a reader study or accessibility certification.

## Confirmed causes and repairs

| State and element | Before | After |
| --- | --- | --- |
| Home, 300 CSS px, both themes, menu closed/open; `body` minimum width | Document client/scroll widths 300/320; body 320px | 300/300; body 300px after removing the evidenced minimum width |
| API guide, 300×164 CSS px, open menu, keyboard focus on Skills; wrapped header | With the former menu height rule on the reflowed shell, the final link extended below the viewport | Menu now subtracts the actual containing header height; full link and purpose fit, Escape returns focus to Tracks |
| Lab at 320px, changed steps; SVG label transforms | BFS authored 10px labels rendered at about 7.10px; Approval about 6.47px; Dijkstra scale about 0.603 | Existing local diagram scroller preserves at least the authored SVG text size with a 46rem minimum width (largest current viewBox: 730 units) |
| Lab reference code and scoped grant example at 320px | Local overflow: 288/278 and 341/280 scroll/client widths, respectively; no explicit keyboard focus or name | Named regions use existing visible labels, native sequential focus, ArrowRight scrolling and visible focus outlines |

The diagram scroller also has an explicit name and keyboard focus. Prose and ordinary
controls still reflow; only essential two-dimensional diagrams/code/tables scroll locally.
No global overflow suppression, text shrinkage, renderer replacement or dependency was added.
The animation content and independent #42 frame oracle remain unchanged.

## Evidence and reproduction

The initial Chromium audit covered home, all five tracks, ChatGPT Ads, its reporting
case, API design, the coding workflow guide, attribution/lift, the control-plane pattern
and the hydrated lab. At 320px and 390px, both themes and menu states had no document
overflow. The additional 300px width reproduced 300/320 document geometry across all
13 routes. After repair, all 156 route/width/theme/menu samples had document scroll
width no larger than client width. The final pass expanded native main-content
disclosures, advanced the architecture stage and showed its complete diagram, and
advanced the lab before measuring.

Native macOS Chrome controls independently showed **200%** and **400%** zoom in browser
chrome. The 1200-point-wide desktop window at 400% exposed approximately 300 CSS pixels;
this was not a CSS zoom transform or pinch simulation. The ChatGPT Ads guide's Next
control advanced stages at both zoom levels; the final companion menu link and its
purpose were visible at 400%, and Escape returned focus to Tracks. Light and dark
reading states were inspected. Zoom was restored and the dedicated audit tab closed.
The automated 300×164 viewport is a regression surrogate, not a claim of native zoom.

Paired screenshots and raw geometry are local audit artifacts under
`output/playwright/ux61-*` and the task's temporary `ux61-*.json` files. Paired screenshot
probes restore only the former body minimum, menu height rule or SVG minimum in an
otherwise identical candidate page, then reload to capture the repair. This isolates
CSS causes; those controlled probes are distinct from the initial unmodified-base audit.

## Regression coverage and limits

Existing smoke reflow coverage now includes 300px and the short 300×164 menu state.
At 320px in both themes it checks native Tab focus, visible outline and actual
ArrowRight scrolling for the lab diagram, reference code and grant example. The
existing 15-lab audit additionally checks SVG text transforms before comparing every
rendered frame to the retained independent oracle. No new browser test cases or
snapshot inventory were added.

Validation: `pnpm check` (32 unit tests, type check and build), `pnpm check:authoring`,
`pnpm check:routes`, 28 existing e2e cases, nine site cases and 11 pilot cases passed.
All 16 retained routes, 14 sitemap entries and five download hashes match the existing
contract. The four non-lab JavaScript assets are byte-identical to #72's artifact;
only the lab island changes for region attributes. The reading JavaScript budget is
unaffected; this task did not rerun paint benchmarks.

OS text scaling and a text-only browser enlargement mode were not exercised. Native
page zoom and CSS viewport reflow are the evidence here. Screen-reader announcements,
remaining interaction semantics and reader task research belong to #62/#63. Existing
label truncation inside authored graph nodes was not redesigned. No production release,
deployment protection change or claim of complete WCAG conformance is included.
