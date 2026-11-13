# Harness discovery prototype

Track navigation started with issues [#26](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/26) and [#27](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/27) and was extended to all five tracks in [#29](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/29).

Harness is a practical reference for people building and operating AI products. The five tracks describe engineering disciplines. Publication categories such as Growth or Go to Market describe where a decision matters. A provider such as ChatGPT Ads describes one implementation of a case. Each dimension can change independently.

| Page | What it does | Where the reader goes |
| --- | --- | --- |
| Homepage | Explain what Harness is and let readers choose a discipline or jump to the featured case. | A track or a case; companion sites are secondary. |
| Track | Teach one reusable decision method in “Start here”. Provide one recommended next action and jumps to the available guides, examples, or references. | A principle, lab, worked example, or lookup page. List future topics last, as plain text. |
| Reusable guide | Explain a decision, its trade-offs, and how to verify the outcome. | A relevant application or the owning track; the guide is usable on direct entry. |
| Worked case | Follow a concrete task, show what changes from the general approach, and say what the reader can try. | The relevant step, reference, or runnable sample. One canonical URL can be linked from several tracks, optionally at different sections. |
| Platform or API reference | Explain a platform boundary or help readers find the right interface. Keep source dates and access scope explicit. | An official source or case that uses the interface. |
| Interactive lab | Let readers inspect a pattern with visible state, playback, and code. | A selected pattern can be linked directly; related tracks can reuse it. |

Harness owns the engineering explanation and its reference artifacts. Publication owns research, evidence, and domain context. Skills owns reusable packages and their versions, setup, and evidence of availability. Use curated links with a reason to follow them. Prefer a specific article or module for a concrete decision; use category links for broader context. The sites build independently.

See the [Publication link and guide discovery map](publication-lens-discovery.md) for proposed paths and gaps in Enterprise software, Measurement & ML, and AI Engineering.

## Authoring

- Keep the canonical guide and its existing `kind`, `trackId`, `path`, and `publicationStatus` in the guide registry. A case may have zero or more related platform records; its placement does not depend on a provider. Add a link from another track to the existing guide ID and optionally a section anchor.
- For a worked case that spans tracks, add its guide ID to `discovery.caseTracks` and give each participating track a distinct section anchor, action, and description. This one mapping supplies the track's Worked examples link, the case's track navigation, and the link back from each section.
- `src/content/discovery.js` declares the featured case, the track methods and resource placements, and any recommended guide continuation. Use an action that tells readers what they will find. The renderer derives destinations and status from the source records.
- Place each guide owned by a track in Start here or an appropriate group. Empty groups have no heading or navigation link. Planned work has no destination. A draft guide remains a linkable preview and stays out of the sitemap.
- Place each visualizer ID in one problem group on Algorithms & Data. The lab is the full interactive index and each grouped link opens the selected visualizer directly.
- A local sample project is available in sample mode only. A documented provider API, a runnable fixture, and a verified live setup describe different things. The local report collector and the planned live build are separate records.
- Build validation rejects missing destinations or anchors, repeated resource placements within a track, links to planned projects, and hidden canonical guides. The guide registry still checks unique paths, IDs, and section anchors.

## Local review

Run `pnpm dev` and open the tracks from the homepage. Each starts with a decision method and a practical next step.

1. From the homepage, choose System design and find its starting method and API design guide. Follow the recommended next step from that guide to the reporting preview.
2. From Software & production, open the lease queue lab. Return to the track, find the local collector instructions, and check how the page distinguishes sample execution from future deployment.
3. Open the featured case directly from the homepage. Follow the five track links into the contract, batch retrieval, recovery, measurement, and agent tool sections. Each section links back to its track, and the breadcrumb points to the case's owning track.
4. From Algorithms & Data, run the top-three campaign lab and check that links in the problem groups select the right visualizers. From Measurement & ML, work through the fictional lift example and follow it into the reporting case. From AI Engineering, trace a request through the control plane and step through the approval lab.

The first example lives at `/learn/system-design/chatgpt-ads-reporting`. The planned `/examples` route remains available by direct link. It can enter the sitemap and navigation when it offers an index readers can use.

Review at desktop and phone widths.

## Action requirements · 12 November 2026

[#59](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/59) audits the five tracks after merged #70 (`8ac34a8` on dev). Their methods, recommended destinations, available resources and canonical ownership remain useful. The missing information was the browser/setup requirement beside the first action and the explicit no-install reading note on direct guide entry.

| Track | Recommended action and useful context | Available resources and limits retained |
| --- | --- | --- |
| System design | Read API design principles in the browser. Its existing `http-basics` prerequisite explains requests/replies in plain language; the track now reuses that source description. No install, account or API key to read. | Platform/API references and the reporting preview; public documentation is not verified account access. |
| Algorithms & Data | Step through the Heap top-three example in the browser; JavaScript for selection/playback, no install or credentials. The starting method already explains the operation and memory limits. | All 15 visualizers, grouped pattern summaries, reporting section and related reading. Prepared examples do not contact a live account. |
| Software & production | Step through the lease queue example with the same browser requirements. Ownership, safe retries and completed results are already explained. | Separate local collector says Sample data and links to pinned setup (Node 20+ at that revision); durable service remains unlinked In development. The app checkout's Node 22 engine is a separate contributor requirement. |
| Measurement & ML | Read the attribution/lift guide without setup. Its starting method already asks for a decision, outcome and comparison; the guide explains attribution/holdout in context. | Fictional example, reporting interpretation, research and prototype write-up. Forecast/allocation work remains unlinked In development. |
| AI engineering | Read the small-code-change guide without setup. It explains the installer/identifier and independent checks before optional local practice. | Pinned Skills 0.2.0 helper needs Node 22 and prints a plan; suggested `go test` is not an observed repair or merge. Approval/control-plane examples and Skills references stay optional; the mock section retains Python/Skills setup and live-access limits. |

The recommended action's requirements are resolved in `discovery.js` using its existing guide/lab/pattern kind. Guide prerequisites come from `prerequisiteConceptIds` and the existing concept collection, not a second authored description. `TrackPage.jsx` associates visible setup prose with the action using `aria-describedby`. New guides retain the same authoring fields; there is no new taxonomy, persona choice or required sequence.

The guide reader adds only the missing no-install statement beside its existing account/access note. The lab intro states its JavaScript requirement and default static Binary Search fallback, and links to the existing pattern summaries. No control semantics, visualizer data, runtime installer or live integration is added. Detailed keyboard/assistive-technology improvements remain with #62; #63 owns practitioner evidence.

The independent #42 reading fixture remains frozen. `check:routes` requires exactly one new requirements block in each eligible retained track/guide/lab route, checks its specific location/kind and nonempty text, then excludes only that addition when comparing the original reading body and links. Existing metadata, original prose/anchors/links and download hashes remain checked. Discovery browser assertions independently check the new requirements, prerequisite explanation, accessible action descriptions and static reading alternative. Do not put existing guide content into the requirements block or weaken the original fixture to accept unrelated changes.
