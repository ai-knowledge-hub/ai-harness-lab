import { controlPath, visualizerUrl } from "./site";
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
    "attribution-and-lift": {
      kind: "guide",
      id: "chatgpt-ads-reporting",
      anchor: "interpret-metrics",
      action: "Interpret credited conversions in the reporting case",
      description: "Check what a campaign report can tell you before you use it to make a budget decision.",
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
    algorithms: {
      start: {
        title: "Choose a pattern for the work it needs to do",
        steps: [
          ["Name the operation", "Write down what goes in and what must come out. Finding the first match and keeping the best five results are different jobs."],
          ["Write down the limits", "Can you sort the whole list, or do records arrive one at a time? How much can you keep in memory? Can you afford to miss a match?"],
          ["Try a small example", "Open the Heap lab and step through a list of campaigns as they arrive. Check which campaigns the lab keeps when it can only store the top three."],
        ],
        next: { kind: "lab", id: "heap", action: "Try the top-three campaign lab" },
      },
      references: [
        { kind: "publication", id: "deterministic-core", action: "Read why agents use these patterns" },
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
    "measurement-ml": {
      start: {
        title: "Start with a decision you need to make",
        steps: [
          ["Name the decision", "Write down what you would do differently, such as increasing next month’s ad budget."],
          ["Pick one outcome", "Choose what you want to change and when you will measure it, such as completed orders over two weeks."],
          ["Plan the comparison", "Decide what evidence would change your mind. A platform can credit an ad for an order. To estimate how many extra orders the ads caused, compare outcomes with and without the campaign."],
        ],
        next: { kind: "guide", id: "attribution-and-lift", action: "Compare credited conversions and lift" },
      },
      references: [
        { kind: "publication", id: "geo-experiments", action: "Read the research on geographic experiments" },
        { kind: "publication", id: "building-to-learn", action: "Read the optimisation prototype write-up" },
      ],
      future: [
        "Build a demand forecast and compare it with a simple baseline.",
        "Test a budget allocation rule with past data before using it in a live campaign.",
      ],
    },
    "ai-engineering": {
      start: {
        title: "Decide what job the agent will do",
        steps: [
          ["Use an agent to build software", "Give a coding agent one small change, a concrete example of the expected result, and a check it can run. Review the diff and the check before accepting the change."],
          ["Design a system for an agent to operate", "Write down one task, such as reading a report. The control plane is the part of the system that checks who is asking, what they can do, and what gets recorded."],
        ],
        next: { kind: "guide", id: "verify-small-code-change", action: "Verify a small code change with an agent" },
      },
      examples: [
        { kind: "lab", id: "approval", action: "Step through an approval", description: "See where a proposed change waits for a person and what happens when the rules reject it." },
      ],
      references: [
        {
          kind: "pattern",
          id: "control-plane",
          action: "Trace a report request through the control plane",
          description: "Follow how the system checks an agent’s identity and permissions before it acts.",
        },
        { kind: "capability", id: "code-maintenance", action: "Inspect the coding workflow package in Skills" },
        { kind: "capability", id: "harness-governance", action: "Inspect the harness review package in Skills" },
      ],
    },
  },
};

export const algorithmGroups = [
  { title: "Find, explore, or rank records", ids: ["binary", "bfs", "dfs", "heap"] },
  { title: "Spot duplicates and keep recent data", ids: ["bloom", "union", "buffer"] },
  { title: "Schedule and limit work", ids: ["topo", "dijkstra", "leaseQueue", "tokenBucket"] },
  { title: "Check access, content, and history", ids: ["permissionGraph", "approval", "rabin", "hashChain"] },
];

export const discoveryGroups = [
  ["guides", "Reusable guides"],
  ["examples", "Worked examples"],
  ["references", "References"],
];

// Preserve the curated starting paths and cross-track relationships. A newly
// authored guide joins its primary track without another registration edit.
/** @template {object} T @param {T} directory @param {import("./guide-types").Guide[]} guides @returns {T} */
export function discoverGuides(directory, guides) {
  const result = structuredClone(directory);
  for (const guide of guides) {
    const page = result.tracks[guide.trackId];
    if (!page) continue; // The validator reports the invalid track.
    const listed = page.start?.next?.kind === "guide" && page.start.next.id === guide.id ||
      discoveryGroups.some(([group]) => page[group]?.some((link) => link.kind === "guide" && link.id === guide.id)) ||
      Boolean(result.caseTracks?.[guide.id]?.[guide.trackId]);
    if (listed) continue;
    const group = guide.kind === "principle" ? "guides" : guide.kind === "case" ? "examples" : "references";
    (page[group] ??= []).push({ kind: "guide", id: guide.id, action: `Read ${guide.shortTitle ?? guide.title}` });
  }
  return result;
}

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
    const prerequisiteIds = Array.isArray(guide.prerequisiteConceptIds) ? guide.prerequisiteConceptIds : [];
    return {
      title: guide.title,
      description: description ?? guide.description,
      label: guide.format + (guide.publicationStatus === "draft" ? " · Preview" : ""),
      preview: guide.publicationStatus === "draft",
      href: guide.path + (anchor ? `#${anchor}` : ""),
      action,
      requirements: "Read in your browser. No installation, account or API key is needed.",
      prerequisites: prerequisiteIds.flatMap((id) => {
        const concept = content.concepts.find((item) => item.id === id);
        return concept ? [concept.description] : [];
      }),
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
      requirements: "Step through a prepared example in your browser. JavaScript is needed; no installation, account or API key is required.",
    } : null;
  }
  if (kind === "pattern" && id === "control-plane") {
    return {
      title: "Agent control plane",
      description,
      label: "Reference pattern",
      href: controlPath,
      action,
      requirements: "Read the reference in your browser. The optional mock lab has separate local setup instructions.",
    };
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
    label: kind === "publication" ? (item.kind === "research" ? "Research" : "Publication") : "Skills",
    href: item.href,
    action,
  } : null;
}
