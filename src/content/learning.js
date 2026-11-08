import { advertisingPlatformsGuide } from "./lessons/advertising-platforms";
import { chatgptAdsGuide } from "./lessons/chatgpt-ads";
import { apiDesignLesson } from "./lessons/api-design";
import { articleUrl } from "./site";

export const learningContent = {
  concepts: [
    {
      id: "http-basics",
      title: "HTTP requests and responses",
      description:
        "Working knowledge of HTTP methods, status codes, JSON, and request/response boundaries.",
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
      status: "research-planned",
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
      title: "A reliable advertising reporting pipeline",
      status: "planned",
      href: null,
      description:
        "A reproducible reporting example with synthetic fixtures, followed by a separately verified live-account setup.",
      lessonIds: ["api-design"],
    },
  ],
  publications: [
    {
      id: "christmas-pilot",
      title: "Should You Test ChatGPT Ads Before Christmas?",
      href: articleUrl("chatgpt-ads-christmas-pilot"),
      kind: "case-study",
      relationship:
        "A seasonal application of the reporting principles: a bounded Christmas pilot, its commercial decision and the distinction between attributed orders and additional sales. The core reference works independently of this case.",
    },
    {
      id: "tool-layer",
      title: "The Muscles of the Machine",
      href: articleUrl(
        "muscles-of-the-machine-tools-mcp-cli-first-principles-marketing",
      ),
      relationship:
        "The engineering context: bounded capabilities, explicit operation contracts, and MCP/CLI interfaces.",
    },
  ],
  capabilities: [
    {
      id: "auth-review",
      title: "Ad-platform authentication review",
      href: "https://skills.ai-knowledge-hub.org/skills/security/ad-platform-agent-auth-review",
      relationship:
        "Related review guidance in Skills. This is not a ChatGPT Ads connector or a verified account integration.",
    },
  ],
  videos: [
    {
      id: "api-design-walkthrough",
      title: "API design: from principle to reporting contract",
      status: "planned",
      href: null,
    },
  ],
  lessons: [advertisingPlatformsGuide, chatgptAdsGuide, apiDesignLesson],
};

export const lessons = learningContent.lessons;
export const getLesson = (id) => lessons.find((lesson) => lesson.id === id);
export const normalizePath = (path) =>
  path === "/" ? path : path.replace(/\/+$/, "");
export const getLessonByPath = (path) =>
  lessons.find((lesson) => lesson.path === normalizePath(path));
export const lessonsForTrack = (trackId) =>
  lessons.filter((lesson) => lesson.trackId === trackId);
export function relatedContent(lesson, collection, field) {
  return lesson[field].map((id) =>
    learningContent[collection].find((item) => item.id === id),
  );
}
