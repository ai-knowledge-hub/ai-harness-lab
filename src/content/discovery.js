import { visualizerUrl } from "./site";
import { algorithms } from "../visualizers/algorithms-data";

export const discovery = {
  featuredCase: {
    kind: "guide",
    id: "chatgpt-ads-reporting",
    action: "Read the reporting case",
    description: "Follow a reporting request from its API contract to the results. Use sample data to see how a system can make incomplete reports useful.",
  },
  nextByGuide: {
    "api-design": {
      kind: "guide",
      id: "chatgpt-ads-reporting",
      action: "Read the reporting case",
      description: "Apply the contract to a daily campaign report and see how the response explains missing data.",
    },
    "chatgpt-ads": {
      kind: "guide",
      id: "chatgpt-ads-reporting",
      action: "Read the reporting case",
      description: "Start with one reporting request and follow it across the five engineering tracks.",
    },
  },
  caseTracks: {
    "chatgpt-ads-reporting": {
      "system-design": {
        anchor: "scope-the-operation",
        action: "Define the report contract",
        description: "Decide who can ask for campaign results and what the response should guarantee.",
      },
      algorithms: {
        anchor: "complete-retrieval",
        action: "Check that you have every batch",
        description: "Follow page markers, detect repeats, and check whether you received the full result.",
      },
      "software-production": {
        anchor: "application-result",
        action: "Handle an interrupted report",
        description: "Decide what to retry, what progress to keep, and how to reconcile revised results.",
      },
      "measurement-ml": {
        anchor: "interpret-metrics",
        action: "Interpret credited conversions",
        description: "Separate what the report credits from the additional sales the campaign may have caused.",
      },
      "ai-engineering": {
        anchor: "bounded-agent-tool",
        action: "Give an agent a bounded reporting tool",
        description: "Define what the tool can read and what it returns when a result is partial or stale.",
      },
    },
  },
  tracks: {
    "system-design": {
      start: {
        title: "Map the system before choosing components",
        steps: [
          ["Identify the actors", "Name who requests the work, who does it, and who uses the result."],
          ["Draw the boundaries", "Follow one request. Mark where data and permissions change hands."],
          ["Define a useful result", "Decide what to guarantee and how to show an incomplete or failed result."],
        ],
        next: { kind: "guide", id: "api-design", action: "Read API design principles" },
      },
      references: [
        { kind: "guide", id: "advertising-platforms", action: "Read the platform overview" },
        { kind: "guide", id: "chatgpt-ads", action: "Explore ad delivery" },
        { kind: "guide", id: "chatgpt-ads-apis", action: "Find an advertiser API" },
      ],
    },
    "software-production": {
      start: {
        title: "Design for an interrupted run",
        steps: [
          ["Give the work an owner", "Define what a worker claims and when another worker can take over."],
          ["Make retries safe", "Record enough to repeat a step without writing the same change twice."],
          ["Report what completed", "Keep the last confirmed checkpoint and name any missing or stale results."],
        ],
        next: { kind: "lab", id: "leaseQueue", action: "Explore the lease queue lab" },
      },
      examples: [
        { kind: "project", id: "advertising-reporting", action: "Open run instructions" },
      ],
      references: [
        { kind: "publication", id: "secure-marketing-agents", action: "Read the authentication guide" },
      ],
      future: [
        "Deploy a reporting service with durable checkpoints, backfills, and monitoring.",
      ],
    },
  },
};

export const discoveryGroups = [
  ["guides", "Reusable guides"],
  ["examples", "Worked examples"],
  ["references", "References"],
];

export function caseLinksForTrack(discovery, trackId) {
  return Object.entries(discovery.caseTracks ?? {}).flatMap(([id, trackLinks]) => {
    const link = trackLinks?.[trackId];
    return link ? [{ ...link, kind: "guide", id }] : [];
  });
}

export function resolveDiscoveryLink(content, link) {
  if (!link) return null;
  const { kind, id, anchor, action, description } = link;
  if (anchor !== undefined && kind !== "guide") return null;
  if (kind === "guide") {
    const guide = content.lessons.find((item) => item.id === id);
    if (!guide || (anchor !== undefined && !guide.sections?.some((section) => section.id === anchor)))
      return null;
    return {
      title: guide.title,
      description: description ?? guide.description,
      label: guide.format + (guide.publicationStatus === "draft" ? " · Preview" : ""),
      preview: guide.publicationStatus === "draft",
      href: guide.path + (anchor ? `#${anchor}` : ""),
      action,
    };
  }
  if (kind === "lab") {
    const lab = algorithms.find((item) => item.id === id);
    return lab ? {
      title: lab.title,
      description: description ?? lab.short,
      label: "Interactive lab",
      href: visualizerUrl(id),
      action,
    } : null;
  }
  if (kind === "project") {
    const project = content.projects.find((item) => item.id === id);
    return project?.status === "available" && project.href ? {
      title: project.title,
      description: description ?? project.description,
      label: project.mode === "sample" ? "Run locally · Sample data" : "Available build",
      href: project.href,
      action,
    } : null;
  }
  const collection = kind === "publication" ? content.publications : kind === "capability" ? content.capabilities : null;
  const item = collection?.find((entry) => entry.id === id);
  return item ? {
    title: item.title,
    description: description ?? item.relationship,
    label: kind === "publication" ? "Publication" : "Skills",
    href: item.href,
    action,
  } : null;
}
