# Practitioner guides and content authoring

This is the first implementation for [#11](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/11) and [#12](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/12), under [epic #10](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/10).

Harness is a how-to reference for practitioners building and operating AI products. Use guides, implementation steps, design decisions and working examples in public copy. Avoid framing the site as a course, curriculum or study programme. Keep the underlying explanations and explicit limits of each example.

The existing `/learn/` routes and internal `lesson`/`learning` identifiers remain compatibility details; public labels use guide terminology.

## Ownership and relationships

`src/content/learning.js` owns the related-resource collections. `src/content/guides.ts` discovers each default-exported guide record in `src/content/lessons/`; the resulting catalogue supplies the guide registry, routes, metadata, track discovery, and sitemap eligibility. Each collection has stable, unique kebab-case IDs. The guide files are authored practitioner references, not a scrape of external articles.

| Object | Role |
| --- | --- |
| Concept | A principle or prerequisite; an ID does not imply a separate published page |
| Track | Existing engineering discipline in `site.js`; one primary track owns a guide |
| Guide | One canonical path, reading metadata, intended outcomes, working context and ordered sections |
| Project | A runnable build; planned builds have no destination |
| Platform | Source-reviewed capabilities and separately recorded account-access state |
| Publication | A curated article and an explanation of its relationship to the guide |
| Capability | A relevant Skills resource and its actual relationship/readiness |
| Video | A real walkthrough destination or an explicit planned record |

Cross-track relevance creates relationships, not copies of the guide. A reusable implementation belongs in Skills once that ownership is established; Harness owns the implementation guidance, fixtures and reference build. No runtime or build imports refer to sibling repositories.

## Guide fields

A guide defines `id`, `path`, `title`, optional `shortTitle`, `description`, `trackId`, `kind`, `publicationStatus`, `format`, `readingMinutes`, `updatedAt`, `introduction`, `objectives`, `prerequisiteConceptIds`, `conceptIds`, `projectIds`, `platformIds`, `publicationIds`, `capabilityIds`, `videoIds`, `relatedGuideIds`, and ordered `sections`.

Canonical paths use `/learn/<trackId>/<lessonId>`. A section has a stable `id`, `title`, and blocks. Current prose block types are paragraph, list, callout, code, flow and table. Closed visual blocks are `ads-architecture`, `ads-orchestrator`, `ads-capabilities` and `ads-reporting-reference`. The `reference-downloads` block selects a known collection from `src/content/reference-downloads.js`. Paragraph blocks can carry a source citation. Code and text render through React escaping; content does not inject raw HTML. Section IDs form contents/deep-link anchors and must remain unique within the guide.

Supported lifecycle rules:

- Guides are `draft` or `published`. A draft has a visible Guide preview label, a canonical URL, `noindex, follow`, and is excluded from the sitemap. Drafts still require coherent reading content.
- Projects and videos are `planned` with `href: null`, or `available` with a destination. A planned item never creates a working-looking build/watch link.
- Platforms distinguish `research-planned`, `documented`, and `account-verified`, plus `unverified`, `verified`, or `unavailable` account access. Source review alone does not establish account access.
- Publication and capability links are curated reference relationships, not claims that an article's example and a package are identical or that an integration has been deployed.

To add a standard guide, create one `.ts` file in `src/content/lessons/` and default-export the record with `satisfies Guide` from `src/content/guide-types.ts`. Run `pnpm check`. Its route, primary-track listing, metadata and eligible sitemap entry are automatic. New principles enter Reusable guides, cases enter Worked examples, and platform/reference kinds enter References. Existing curated starting paths, custom actions and cross-track case relationships remain in `discovery.js`; they continue to resolve metadata from the same records. Do not add a navigation entry pointing to a nonexistent guide. Use `pnpm check:authoring` to exercise published, draft and invalid-reference records end to end.

## Validation

TypeScript checks guide and block shapes during authoring. `validateLearningContent` checks IDs, paths, track membership, relationship targets, metadata, objectives, sections, anchors, block shapes and lifecycle consistency. The production build invokes it and fails on invalid content. Failure cases have unit coverage.

Current validation is structural. It does not establish the accuracy of an external article, API compatibility, permissions, causal conclusions, or actual account availability. Those require source and implementation review.

## Rendering and metadata

`src/views/LessonPage.tsx` supplies the shared build-time reader: breadcrumbs, desktop contents, native mobile contents, intended outcomes, working context, typed content blocks, related resources, source dates and planned-next-step information. Data drives labels and update dates. Astro owns the shell and `/learn/[trackId]/[id]` routes.

`pnpm build` validates content and emits static Astro HTML into `dist/`. The existing React reading components render only at build time. The native sitemap endpoint includes indexable canonical routes, and the robots endpoint points to it. The build mirrors directory-index HTML to the previous flat `.html` addresses for compatibility; it does not rewrite a client template into pages.

Reading links use normal document navigation. A React island on the lab route hydrates the static default lab in place, then reads the actual query; this retains scrolling targets while avoiding a query/HTML hydration mismatch. Existing algorithm selection, playback and history behaviour remain supported. Metadata comes from the shared catalogue at build time.

The site remains static. Vercel previews use Astro and production keeps the compatibility renderer until #47. `cleanUrls: true`, canonical metadata and mirrored HTML addresses preserve the existing route forms. The `/algorithms` and `/patterns` aliases retain query strings and fragments.

## Platform references and supporting cases

See [Harness discovery prototype](harness-discovery-prototype.md) for the page roles, pilot track placement rules, and local review paths. The pilot uses guide IDs and section anchors for navigation without changing canonical guide routes.

Each guide declares a `kind`: overview, platform, capabilities, principle or case. The track groups platform references, reusable principles and implementation cases, preserving registry order inside each group. `reference-context.js` defines the small workflow navigation shared by the current principles, platform, public-capability and reporting-case pages. Extend it deliberately when another case is added; do not copy provider details back into the reusable principles. `relatedGuideIds` resolve to canonical guide records and are validated with other relationships. Paragraph blocks may include a `source` with an HTTPS `href` and descriptive `title`; the reader renders it beside the claim.

A publication relationship with `kind: "case-study"` renders as a labelled supporting aside after the main guide body. Keep the core explanation useful without opening that article. Only render related-reading, source and planned-build sections when they have content. Selected source review does not establish a full platform dossier or verified account access.

## Staged ChatGPT Ads architecture

The closed `ads-architecture` block renders the dedicated HTML/SVG walkthrough, backed by `src/content/chatgpt-ad-architecture.js`. The guide/section/block position supplies deterministic DOM and SVG IDs. The server renders the complete map and all explanations; typed client enhancement adds stage controls and illustrative delivery outcomes. Inactive explanations use searchable `hidden="until-found"` where supported, with `beforematch` and fragment state synchronisation. Other browsers retain the linear reference. SVG edges and HTML nodes share fixed layout coordinates inside a keyboard-scrollable region. Documented responsibilities use solid borders; the planned Harness worker and evidence store use dashed borders. No internal logs-to-reporting pipeline is asserted.

## Reference artifacts

`public/references/chatgpt-ads/v1/` holds versioned Harness files. `capabilities.json` supplies both the rendered public capability map and its JSON download. The official OpenAPI link stays external to OpenAI. Do not relabel the internal reference schema as a provider contract. The README records provenance, synthetic conventions and limitations.

`checkReferenceContracts` runs during the build using development-only Ajv 2020 and format validation; it validates each synthetic architecture event against the reference schema. The event discriminator, embedding-tool shape, contextual gate and frontend timing are distinct boundaries. Negative unit tests cover those boundaries. The browser suite checks deployed download URLs, context navigation, native no-JavaScript disclosures and responsive reflow. No validator is bundled into the site runtime.
