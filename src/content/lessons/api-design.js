export const apiDesignLesson = {
  id: "api-design",
  path: "/learn/system-design/api-design",
  title: "API design for advertising systems",
  shortTitle: "API design",
  description:
    "Design a bounded reporting contract: account scope, metric meaning, complete results, and useful failures. A reusable foundation for advertising integrations.",
  trackId: "system-design",
  publicationStatus: "draft",
  format: "Practical guide",
  readingMinutes: 14,
  updatedAt: "2026-11-07",
  objectives: [
    "Define the operation before choosing an interface.",
    "Preserve account scope, reporting meaning, and result coverage.",
    "Distinguish an attributed outcome from evidence of additional sales.",
  ],
  prerequisiteConceptIds: ["http-basics"],
  conceptIds: ["api-contracts", "reporting-evidence"],
  projectIds: ["advertising-reporting"],
  platformIds: ["chatgpt-ads"],
  publicationIds: ["christmas-pilot", "tool-layer"],
  capabilityIds: ["auth-review"],
  videoIds: ["api-design-walkthrough"],
  relatedGuideIds: ["advertising-platforms", "chatgpt-ads"],
  introduction:
    "An advertising report can be technically successful and still answer the wrong question. A useful API contract tells the caller which account, period, metrics, and evidence the result actually covers.",
  sections: [
    {
      id: "start-with-the-operation",
      title: "Start with the operation",
      blocks: [
        {
          type: "paragraph",
          text: "Begin with a concrete task: retrieve campaign performance for a specified account and period. Decide what the caller needs to know before choosing REST, a command-line interface, or an agent tool.",
        },
        {
          type: "paragraph",
          text: "The reporting operation supplies observations for decisions about delivery, cost and outcomes. It must carry enough context for the caller to judge what those observations mean, whether the requested population is complete, and what evidence is still missing.",
        },
        {
          type: "flow",
          label: "A reporting capability from request to decision",
          steps: [
            "Specify the question",
            "Retrieve bounded data",
            "Return evidence",
            "Evaluate the result",
          ],
        },
        {
          type: "callout",
          title: "The build starts here",
          text: "Start with the reporting contract. An interactive reporting walkthrough, runnable connector, and live-account workflow are planned next steps.",
        },
      ],
    },
    {
      id: "define-the-contract",
      title: "Define the contract",
      blocks: [
        {
          type: "paragraph",
          text: "A contract describes an operation’s meaning as well as its fields. Give each input a unit, scope, and boundary. Explain what a successful, empty, partial, or rejected result means before an agent starts using it.",
        },
        {
          type: "table",
          columns: ["Decision", "What the contract must preserve"],
          rows: [
            [
              "Account",
              "The authenticated account and its permitted scope. A model-proposed identifier does not establish permission.",
            ],
            [
              "Period",
              "Start, end, inclusive or exclusive boundaries, and the account’s reporting timezone.",
            ],
            [
              "Metrics",
              "Names, units, currency, attribution settings, and the source of each value.",
            ],
            [
              "Coverage",
              "Which requested segments were retrieved and which remain unavailable.",
            ],
            [
              "Freshness",
              "When the data was retrieved and whether the reported period is still changing.",
            ],
          ],
        },
        {
          type: "code",
          label: "Illustrative reporting envelope",
          language: "json",
          code: '{\n  "request": {\n    "account_id": "sample-account",\n    "period": {"from": "2026-11-01", "to": "2026-11-07"},\n    "timezone": "Europe/London",\n    "currency": "GBP"\n  },\n  "result": {\n    "status": "partial",\n    "coverage": {"completed_segments": 2, "expected_segments": 3},\n    "rows": [],\n    "warnings": ["One requested segment is unavailable"]\n  }\n}',
        },
        {
          type: "callout",
          title: "An illustrative application contract",
          text: "This envelope is an illustrative application design, not an OpenAI Ads request or response schema. It contains no live account data. Provider-specific fields and reporting behaviour will be established in the platform research.",
        },
      ],
    },
    {
      id: "preserve-reporting-meaning",
      title: "Preserve reporting meaning",
      blocks: [
        {
          type: "paragraph",
          text: "Keep provider identity and metric definitions alongside the values. Two columns with the same friendly name can describe different attribution windows, currencies, or periods. An adapter should make those differences inspectable before a report combines them.",
        },
        {
          type: "paragraph",
          text: "OpenAI’s reporting documentation describes account, campaign, ad-group, and ad reporting, together with attribution settings and data-freshness limits. These are useful questions for our design. They do not establish which features are enabled for our own advertising account.",
        },
        {
          type: "list",
          items: [
            "Record the provider and reporting scope.",
            "Keep attribution settings and the timezone with the result.",
            "Treat a current or recently completed period as potentially incomplete.",
            "Explain whether a value came from the provider or was calculated locally.",
          ],
        },
      ],
    },
    {
      id: "make-failures-useful",
      title: "Make failures useful",
      blocks: [
        {
          type: "paragraph",
          text: "Transport success is only one part of success. If one requested segment is missing, the result should retain that gap. An empty report, a denied account, and an unfinished report require different next steps.",
        },
        {
          type: "table",
          columns: ["Result", "Useful response"],
          rows: [
            ["Complete", "Explain the covered scope, period, and freshness."],
            [
              "Empty",
              "Confirm what was queried; do not invent activity or imply tracking is healthy.",
            ],
            [
              "Partial",
              "Retain the retrieved evidence and identify the missing coverage.",
            ],
            [
              "Rejected",
              "Explain the input or permission problem without leaking credentials.",
            ],
            [
              "Unavailable",
              "Describe the failure and whether a bounded retry or smaller request is appropriate.",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Retry rules belong to the operation. Re-reading a report and retrying a write have different consequences. Preserve resource identity and request boundaries, and verify a provider’s documented repetition behaviour before automating changes.",
        },
      ],
    },
    {
      id: "connect-to-chatgpt-ads",
      title: "Connect it to ChatGPT Ads",
      blocks: [
        {
          type: "paragraph",
          text: "ChatGPT Ads is the first platform used to apply this reporting contract. The Advertiser API documentation requires an ad account and an Advertiser API key. Its authentication reference scopes each key to an ad account and instructs callers to keep it server-side.",
        },
        {
          type: "callout",
          title: "Account access is a separate check",
          text: "Having a ChatGPT account does not verify Ads Manager access, an Advertiser API key, feature eligibility, or measurement readiness. The platform research will record what is documented and what is verified for the owner’s account.",
        },
        {
          type: "paragraph",
          text: "First establish the reporting operation and a credential-free example. A future live connector can implement that contract using the capabilities actually available. Keep credentials out of the reading page. This guide covers the design; campaign launch and media spend are outside its scope.",
        },
      ],
    },
    {
      id: "from-report-to-decision",
      title: "From report to decision",
      blocks: [
        {
          type: "paragraph",
          text: "A report of credited orders describes attribution under stated rules. Estimating additional sales requires a comparison and assumptions that the reporting endpoint cannot supply by itself.",
        },
        {
          type: "paragraph",
          text: "Preserve spend, delivery, attributed outcomes, and independently reconciled business outcomes as distinct observations. State what the report can answer, what remains uncertain, and what evidence would justify the next decision.",
        },
        {
          type: "list",
          items: [
            "Can another reader reproduce the period and definitions?",
            "Can they identify missing or late evidence?",
            "Can they separate an observed result from a causal claim?",
            "Can they explain what would change the next decision?",
          ],
        },
      ],
    },
  ],
};
