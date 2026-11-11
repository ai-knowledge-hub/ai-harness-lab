import { guides } from "./guides";
import { articleUrl, site } from "./site";
import { discovery, discoverGuides } from "./discovery";

export const learningContent = {
  discovery: discoverGuides(discovery, guides),
  concepts: [
    {
      id: "http-basics",
      title: "HTTP requests and responses",
      description:
        "The examples use HTTP, the rules software follows to send a request over the web and receive a reply.",
    },
    {
      id: "api-contracts",
      title: "Operation contracts",
      description:
        "Explicit inputs, outputs, permissions, effects, limits, and failures.",
    },
    {
      id: "reporting-evidence",
      title: "Reporting evidence",
      description:
        "Scope, definitions, attribution, coverage, and freshness travel with the values.",
    },
  ],
  platforms: [
    {
      id: "chatgpt-ads",
      title: "ChatGPT Ads",
      status: "documented",
      accountAccess: "unverified",
      checkedAt: "2026-11-08",
      sources: [
        { title: "Published ad-stack architecture", href: "https://openai.com/index/building-chatgpt-ad-stack/" },
        { title: "Advertiser experience", href: "https://ads.openai.com/" },
        { title: "Measurement interfaces", href: "https://developers.openai.com/ads" },
        { title: "Insights reference", href: "https://developers.openai.com/ads/api-reference/insights" },
        { title: "Conversion-optimised campaigns", href: "https://developers.openai.com/ads/conversion-optimized-campaigns" },
        {
          title: "Advertiser API overview",
          href: "https://developers.openai.com/ads/api-overview",
        },
        {
          title: "Reporting",
          href: "https://developers.openai.com/ads/reporting",
        },
        {
          title: "Authentication",
          href: "https://developers.openai.com/ads/api-reference/authentication",
        },
      ],
    },
    {
      "id": "google-ads",
      "title": "Google Ads",
      "status": "research-planned",
      "accountAccess": "unverified",
      "checkedAt": "2026-11-07",
      "sources": [
        {
          "title": "Google Ads overview",
          "href": "https://business.google.com/en-all/google-ads/"
        }
      ]
    },
    {
      "id": "meta-ads",
      "title": "Meta",
      "status": "research-planned",
      "accountAccess": "unverified",
      "checkedAt": "2026-11-07",
      "sources": [
        {
          "title": "Ad delivery and transparency",
          "href": "https://about.fb.com/news/2023/02/increasing-our-ads-transparency/"
        }
      ]
    },
    {
      "id": "amazon-ads",
      "title": "Amazon Ads",
      "status": "research-planned",
      "accountAccess": "unverified",
      "checkedAt": "2026-11-07",
      "sources": [
        {
          "title": "Amazon Marketing Cloud",
          "href": "https://advertising.amazon.com/solutions/products/amazon-marketing-cloud"
        }
      ]
    },
    {
      "id": "tiktok-ads",
      "title": "TikTok",
      "status": "research-planned",
      "accountAccess": "unverified",
      "checkedAt": "2026-11-07",
      "sources": [
        {
          "title": "TikTok for Business",
          "href": "https://ads.tiktok.com/business/en"
        }
      ]
    },
    {
      "id": "dv360",
      "title": "Display & Video 360",
      "status": "research-planned",
      "accountAccess": "unverified",
      "checkedAt": "2026-11-07",
      "sources": [
        {
          "title": "Configuration and reporting API boundaries",
          "href": "https://developers.google.com/display-video/api/support/faq?hl=en"
        }
      ]
    },
  ],
  projects: [
    {
      id: "advertising-reporting",
      title: "Local report collector",
      status: "available",
      mode: "sample",
      href: "https://github.com/ai-knowledge-hub/ai-harness-lab/blob/fbddf8b079578848adc943b85b34d925c870ca34/docs/chatgpt-ads-reporting-collector.md",
      description:
        "Run the collector from a checkout with Node.js 20 or later. Compare a complete report with a partial run using fictional data. No account is needed.",
      lessonIds: ["chatgpt-ads-reporting"],
    },
    {
      id: "local-reporting-adapters",
      title: "Local reporting CLI and MCP tool",
      status: "available",
      mode: "sample",
      href: "https://github.com/ai-knowledge-hub/ai-harness-lab/blob/f8611ae47ff131acce392e90688ef421e41bf01e/docs/chatgpt-ads-reporting-adapters.md",
      description: "Use Node.js 20.3 or later to run the CLI or connect a local MCP host. Both return the same report from fictional campaign data.",
      lessonIds: ["chatgpt-ads-reporting"],
    },
    {
      id: "live-advertising-reporting",
      title: "Connect to a live account",
      status: "planned",
      href: null,
      description:
        "A deployment walkthrough and verified account setup are in development.",
      lessonIds: ["chatgpt-ads-reporting"],
    },
  ],
  publications: [
    {
      id: "christmas-pilot",
      title: "Should You Test ChatGPT Ads Before Christmas?",
      href: articleUrl("chatgpt-ads-christmas-pilot"),
      kind: "case-study",
      relationship:
        "A small Christmas test that asks whether ChatGPT Ads are worth running. It explains the difference between orders the platform credits to an ad and extra sales the campaign caused.",
    },
    {
      id: "tool-layer",
      title: "The Muscles of the Machine",
      href: articleUrl(
        "muscles-of-the-machine-tools-mcp-cli-first-principles-marketing",
      ),
      relationship:
        "How software and AI agents use tools, and why each tool needs a clear job, rules and limits.",
    },
    {
      id: "secure-marketing-agents",
      title: "Secure marketing agents",
      href: articleUrl("building-secure-marketing-agents-ad-platform-authentication-architecture"),
      relationship: "See how account permissions shape the boundary between a worker and the platform it calls.",
    },
    {
      id: "deterministic-core",
      title: "The Deterministic Core",
      href: articleUrl("deterministic-core-algorithms-data-structures-marketing-agents"),
      relationship: "See where software can give an agent a repeatable way to search, order, and check data.",
    },
    {
      id: "geo-experiments",
      title: "Measuring Ad Effectiveness Using Geo Experiments",
      href: "https://research.google/pubs/measuring-ad-effectiveness-using-geo-experiments/",
      kind: "research",
      relationship: "Jon Vaver and Jim Koehler show how to compare regions where a campaign runs with regions where it is held back.",
    },
    {
      id: "building-to-learn",
      title: "Building to learn",
      href: articleUrl("building-to-learn-agentic-marketing-optimization"),
      relationship: "Follow the decisions and trade-offs in a marketing optimisation prototype.",
    },
    {
      id: "code-agent-playbook",
      title: "The Code Agent’s Playbook · Check a change and evaluate the agent",
      href: `${articleUrl("agent-maintenance-security-harness")}#separate-validation-of-a-change-from-evaluation-of-the-maintainer`,
      relationship: "See how an independent check supports a review and how to measure an agent’s reliability across different tasks.",
    },
  ],
  capabilities: [
    {
      id: "auth-review",
      title: "Ad-platform authentication review",
      href: "https://skills.ai-knowledge-hub.org/skills/security/ad-platform-agent-auth-review",
      relationship:
        "A guide in Skills for reviewing how an agent gets permission to use an ad account.",
    },
    {
      id: "code-maintenance",
      title: "Code Maintenance Plugin",
      href: `${site.skills}/plugins/engineering/code-maintenance-plugin`,
      relationship: "Run the local example to turn a proposed code change into a plan with verification steps.",
    },
    {
      id: "harness-governance",
      title: "Harness Governance Plugin",
      href: `${site.skills}/plugins/agentops/harness-governance-plugin`,
      relationship: "Run the local example to record how you would evaluate a change to the rules and tools around an agent before adopting it.",
    },
  ],
  videos: [
    {
      id: "api-design-walkthrough",
      title: "How to design a request for a campaign report",
      status: "planned",
      href: null,
    },
  ],
  lessons: guides,
};

export const lessons = learningContent.lessons;
export const getLesson = (id) => lessons.find((lesson) => lesson.id === id);
export const normalizePath = (path) =>
  path === "/" ? path : path.replace(/\/+$/, "");
export const getLessonByPath = (path) =>
  lessons.find((lesson) => lesson.path === normalizePath(path));
