export const site = {
  origin: "https://harness.ai-knowledge-hub.org",
  name: "Harness",
  family: "AI Knowledge Hub",
  description:
    "Practical engineering for building, operating, and evaluating AI products. Explore five tracks, reusable guides, and worked examples.",
  publication: "https://ai-knowledge-hub.org",
  skills: "https://skills.ai-knowledge-hub.org",
};
export const labPath = "/learn/algorithms/visualizers";
export const controlPath = "/learn/ai-engineering/control-plane";
export const articleUrl = (slug) => `${site.publication}/library/${slug}/`;
export const visualizerUrl = (id) => `${labPath}?algorithm=${id}#visualizer`;
export const trackPath = (track) => `/learn/${track.slug}`;

export const tracks = [
  {
    slug: "system-design",
    number: "01",
    nav: "System design",
    title: "System design",
    description:
      "Map who does what, where data moves, and what each part promises.",
    short: "Map boundaries, data flows, and API contracts.",
    availability: "Guide & references",
  },
  {
    slug: "algorithms",
    number: "02",
    nav: "Algorithms & data",
    title: "Algorithms & Data",
    description:
      "Choose how to find, sort, and check data, then use a small example to see how your approach behaves.",
    short: "Search, ranking, scheduling, memory, and deterministic control.",
    availability: "Interactive visualizers",
  },
  {
    slug: "software-production",
    number: "03",
    nav: "Software & production",
    title: "Software & production",
    description:
      "Design work you can retry, inspect, and recover after a failure.",
    short: "Design for deployment, retries, and recovery.",
    availability: "Lab & local sample",
  },
  {
    slug: "measurement-ml",
    number: "04",
    nav: "Measurement & ML",
    title: "Measurement & ML",
    description:
      "Measure whether a change helped, and use that evidence to decide what to try next.",
    short: "Experiments, incrementality, prediction, and optimisation.",
    availability: "Guide & research",
  },
  {
    slug: "ai-engineering",
    number: "05",
    nav: "AI engineering",
    title: "AI Engineering & Harnesses",
    description:
      "Use agents to build and check software, or design the tools and rules that let a running agent do a job.",
    short: "Coding agents, tools, memory, orchestration, and evaluation.",
    availability: "Reference pattern & labs",
  },
];
