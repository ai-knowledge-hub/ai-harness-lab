# Accessible interaction audit — 12 November 2026

Issue #62; base `bdc9759` (merged #73), branch `feature/accessible-interactions`.
This is an expert implementation audit, not a reader study or accessibility certification.

## Confirmed gaps and bounded fixes

| Surface | Before | Repair and evidence |
| --- | --- | --- |
| Architecture Previous/Next boundaries | Keyboard Enter on the final Next disabled the focused native button and moved activeElement to BODY in all six viewport/theme probes | `aria-disabled` preserves the button in keyboard order and retains focus. Explicit activation guards prevent both boundary and complete-view actions. Native Chrome and browser checks retain focus on Next/Previous, and repeated Enter/Space does nothing |
| Lab live-region scope | The whole stage was `aria-live=polite`; mutations covered the diagram, active code line, controls and explanation (roughly 733–803 characters in the Token Bucket probe) | Only the existing current-step paragraph is a status, with an atomic algorithm/step/label name. The first Token Bucket explanation is 56 characters. Playback turns its live updates off; manual/paused reading remains available. This is verified DOM/AX behavior; actual speech delivery remains pending below |
| Lab Speed slider | Accessible value was a bare number such as 1050, although a larger number means a longer delay | `aria-valuetext` exposes “1050 milliseconds between steps”; native Chrome's accessibility tree reports the units and keyboard Home changes it to 500 milliseconds |

Boundary controls remain semantically unavailable and visibly subdued. They do not
silently wrap or leave complete view. The status contains the original authored
explanation; diagrams, code, step data and the independent #42 visual-state oracle
are unchanged. No new dependency, hidden duplicate prose or new test cases were added.

## Checked behavior

The same before/after browser probe used 320px, 390px and 1440px viewports, both themes
and reduced-motion media. It selected Control and Token Bucket with Enter, advanced
with Enter, played/paused with Space, reset, adjusted the range with Home/ArrowRight,
switched Context/Run and tabbed from Animation to Reference code. Each selected
state retained its authored explanation and visible text labels; colour is not the
only source of meaning. The architecture probe exercised all five stages and final
focus. Reduced-motion mode had no running decorative animations; playback starts
only on an explicit Play action, and Pause/manual steps remain available. Existing
reporting checks operate all five native disclosures by keyboard at 320px with
JavaScript disabled.

Native macOS Chrome in a dedicated Guest window independently exposed the named
Approval State Machine status, the slider's timing value and focus on the unavailable
final Next button. Space did not advance past the end. Shift+Tab recovered Previous.
At native 200% and 400% zoom, Tab revealed the focused controls and Enter changed
stages. Browser chrome showed those zoom values; these were not CSS transforms.
Zoom was restored and the dedicated Guest window closed. Automated viewport and AX
checks are recorded separately from these native keyboard observations.

The inherited browser-Back probe returns activeElement to BODY when a focused diagram
is replaced; the next Tab lands on the new Animation region at the working position.
No focus trap or jump to the site header was reproduced, so this slice does not add
forced focus movement during history navigation. Existing query/fragment/legacy and
horizontal-selection recovery coverage remains in place.

## Pending manual assistive-technology evidence

**The screen-reader walkthrough is pending.** VoiceOver Utility did not yield a
controllable window (computer-use timeout); the standard shortcut produced no
observable screen-reader startup. The native AX tree is not a transcript of VoiceOver
speech. No claim is made that live-announcement timing, verbosity or reading order has
been validated with a screen reader. The user was told why this check belongs to #62
and offered a manual handoff or an explicit pending record. Keep #62 open until this
remaining acceptance item is resolved; this draft is not a completion claim for it.

A follow-up walkthrough should cover Approval and Token Bucket manual stepping,
Play/Pause, slider units, Context/Run, selection/history, architecture boundary controls
and outcome selection, and reporting disclosures. Record the actual AT/browser pair,
what was announced and whether the reader can recover the current state after Pause.

## Validation

The existing lab audit checks all 15 visualizers/every independent frame, and now also
checks the single named status, manual versus playback live policy and slider units.
Existing pilot and Chromium/WebKit site cases check boundary focus and guarded keyboard
activation. `pnpm check` passed (types, 32 unit tests and production build), followed by
`pnpm check:authoring`, `pnpm check:routes`, 28 e2e cases, nine site cases and
11 pilot cases. The frozen reading snapshot, sitemap policy, five downloads and
lab oracle have not been regenerated.

The unchanged benchmark command `node scripts/measure-migration-baseline.mjs
http://127.0.0.1:4180 --route /learn/system-design/chatgpt-ads` produced five
conclusive mobile samples on Node 22.23.5 / Chromium 147.0.7727.15 with the
script’s 4× CPU/150ms latency profile. Initial JavaScript and JavaScript through
a successful first Next both measured **2,693 gzip bytes** in every sample, within
the **63,477-byte** gate. Candidate FCP/LCP medians were 468ms (range 464–632ms);
this is not a new paired paint comparison with the independent #42 artifact.
Shared shell, React and client runtime asset bytes are unchanged; only architecture
and lab interaction modules changed. Raw local measurements remain in the task’s
`benchmark.json`, `audit-base.json`, `audit-after.json` and `history-probe.log`.
