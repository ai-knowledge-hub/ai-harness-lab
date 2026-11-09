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
      examples: [
        { kind: "guide", id: "chatgpt-ads-reporting", action: "Read the reporting case" },
      ],
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
        {
          kind: "guide",
          id: "chatgpt-ads-reporting",
          anchor: "complete-retrieval",
          action: "See how report batches are collected",
          description: "See the design for saving progress and identifying which batches are missing.",
        },
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
