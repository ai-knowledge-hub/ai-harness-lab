# Harness discovery prototype

Issues [#26](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/26) and [#27](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/27), under [epic #25](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/25).

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

## Authoring

- Keep the canonical guide and its existing `kind`, `trackId`, `path`, and `publicationStatus` in the guide registry. A case may have zero or more related platform records; its placement does not depend on a provider. Add a link from another track to the existing guide ID and optionally a section anchor.
- For a worked case that spans tracks, add its guide ID to `discovery.caseTracks` and give each participating track a distinct section anchor, action, and description. This one mapping supplies the track's Worked examples link, the case's track navigation, and the link back from each section.
- `src/content/discovery.js` declares the featured case, the pilot track methods and resource placements, and any recommended guide continuation. Resources refer to existing guide, lab, project, publication, or capability IDs. The renderer derives destinations and status from the source record. Context-specific descriptions are optional; use an action that tells readers what they will find.
- For a pilot track, place each guide owned by that track in Start here or an appropriate group. Empty groups have no heading or navigation link. Planned work has no destination. A draft guide remains a linkable preview and stays out of the sitemap.
- A local sample project is available in sample mode only. A documented provider API, a runnable fixture, and a verified live setup describe different things. The local report collector and the planned live build are separate records.
- Build validation rejects missing destinations or anchors, repeated placements within a track, links to planned projects, and hidden canonical guides in a pilot track. The guide registry still checks unique paths, IDs, and section anchors.

## Local review

Run `pnpm dev` and open `/`, `/learn/system-design`, and `/learn/software-production`. The prototype keeps the existing optical art and reading surfaces. The homepage goes directly from its promise to the five tracks, a single featured case, and links to the companion sites. On the pilot tracks, a short introduction and section jumps lead into the decision method and available material. The other three tracks use their existing layout.

1. From the homepage, choose System design and find its starting method and API design guide. Follow the recommended next step from that guide to the reporting preview.
2. From Software & production, open the lease queue lab. Return to the track, find the local collector instructions, and check how the page distinguishes sample execution from future deployment.
3. Open the featured case directly from the homepage. Follow the five track links into the contract, batch retrieval, recovery, measurement, and agent tool sections. Each section links back to its track, and the breadcrumb points to the case's owning track.

The first example lives at `/learn/system-design/chatgpt-ads-reporting`. The planned `/examples` route remains available by direct link. It can enter the sitemap and navigation when it offers an index readers can use.

Review at desktop and phone widths. The next design decision is whether the starting method and first action are clear at both widths before using the template for the remaining tracks.
