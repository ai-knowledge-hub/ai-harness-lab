# Harness discovery fit check

Findings for [issue #32](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/32), checked on 10 November 2026 against `dev` after [PR #36](https://github.com/ai-knowledge-hub/ai-harness-lab/pull/36). The [Google Ads reporting brief](google-ads-reporting-case-brief.md) maps the second provider. This note records the reader walkthrough and what it exposed.

## A coding-agent task outside advertising

The task is to ask an agent to fix an internal package installer that accepts an empty package identifier. The reader needs to define a small change, decide how to verify it, and find an example they can run.

| Step | What I found |
| --- | --- |
| Harness · AI Engineering | The “Use an agent to build software” step explains how to specify a change and a check. The track links to the Code Maintenance plugin under References. Its main action opens the control plane for agent permissions. The coding step has no guide of its own or link to the relevant Publication section. [AI Engineering track](https://harness.ai-knowledge-hub.org/learn/ai-engineering) |
| Publication · The Code Agent’s Playbook | I opened the section directly because Harness did not link to it. The article explains how to check one change and how to evaluate an agent over many tasks. I found no onward link to the specific Code Maintenance release, so I reached Skills via the Harness track instead. [Playbook section](https://ai-knowledge-hub.org/library/agent-maintenance-security-harness/#separate-validation-of-a-change-from-evaluation-of-the-maintainer) |
| Skills · Code Maintenance Plugin | The linked page identifies release `0.2.0`, the Node.js 22 requirement, and the first-use command. The Harness link goes to the catalogue entry, where the reader can find the versioned archive. The catalogue link itself does not pin the release. [Skills entry](https://skills.ai-knowledge-hub.org/plugins/engineering/code-maintenance-plugin) |

I ran `node scripts/first_use.mjs examples/first-use-input.json` with Node.js 22.23.4 using the helper and sample extracted from the checked-in release archive. The public download matched that archive byte for byte. The helper returned a maintenance plan for rejecting the empty identifier. It listed `go test ./internal/installer` as the verification step and returned `merge_authorized: false`. The result is a plan. Testing the actual fix would require a candidate change and observed test results. This check exercised the helper from the archive. The install and versioned handoff are tracked in [#31](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/31). [Versioned release archive](https://skills.ai-knowledge-hub.org/artifacts/engineering/code-maintenance-plugin/0.2.0.tar.gz)

## Missing guides

| Priority | Guide | What the reader should be able to do |
| --- | --- | --- |
| First | **Verify a small code change with an agent** · AI Engineering | Write the request, define what counts as a pass, and compare the plan with evidence from a real check. Use the installer example to show that the empty ID is rejected and valid IDs still work. Link the independent verification discussion to the Playbook and the first-use sample to Skills. This fills the gap between the track’s brief guidance and the runnable plan. |
| Next | **Take a workflow from sandbox to production** · Enterprise software | Decide who owns a scheduled internal job, how to release it, and what to do if it fails halfway through. Show how the queue and recovery examples fit into deployment, monitoring, and rollback. The browser walkthrough established that the recovery references are findable. The decision about operating a service still needs a guide. |
| Next | **Choose what evidence your decision needs** · Measurement & ML | Separate evidence that one case passed, evidence of performance across representative cases, and evidence of a change in the outcome that matters. Give readers a baseline and a rule for acting or waiting. The lift guide already covers one comparison. The coding-agent sample exposes a related gap in how to evaluate a proposed change against observed behaviour. |

These proposals build on the [#30 discovery map](publication-lens-discovery.md). After the first guide exists, repeat the non-advertising walkthrough and check whether a reader can choose the correct version, run the sample, and explain what the output establishes.

## Existing routes and examples

- **Desktop and phone.** On the local production build in Chromium at 1,440px and 390px, I entered the API design guide and the reporting case at section anchors and followed their links back to the tracks. The legacy algorithms route retained the selected approval lab and visualizer anchor. Advancing the lab changed its step, and its breadcrumb returned to Algorithms & Data. The legacy patterns route opened the agent control plane.
- **Static reading and visibility.** The API guide contents and reporting preview were readable with JavaScript disabled. The guide and case kept their canonical paths. The case had `noindex, follow`, and the sitemap omitted it and the planned examples index.
- **Assets and sample.** The local reference download URLs returned files from the production build. The case exposed the local collector instructions, and the synthetic complete scenario returned 2,300 impressions, 64 clicks, and £36.00 spend, with conversions unavailable.
- **Checks.** `pnpm check` passed all 29 unit tests and built the production site. The local preview reported a missing Vercel Analytics script. The walkthrough used the local build for Harness and the published pages for Publication and Skills.
