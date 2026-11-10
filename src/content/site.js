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
    question: "Make the underlying logic visible.",
    description:
      "Implement the operations behind a useful integration: traverse pages, deduplicate records, aggregate metrics, rank results and coordinate work. Use reference code and visible state to inspect how a pattern behaves before adapting it.",
    short: "Search, ranking, scheduling, memory, and deterministic control.",
    availability: "Interactive visualizers",
    topics: [
      [
        "Retrieve the complete population",
        "Follow continuations, detect repeated cursors and retain the reason a read stopped.",
      ],
      [
        "Transform without losing meaning",
        "Deduplicate observations, aggregate additive metrics and derive ratios at the right grain. Inspect missing values and incomplete inputs.",
      ],
      [
        "Bound and coordinate work",
        "Apply queues, buffers, rate limits and dependency ordering. Use the visualizers below to inspect the relevant state transitions.",
      ],
    ],
    resources: [
      {
        title: "The algorithm visualizers",
        description:
          "Explore the complete collection with playback, reference code, and practical context.",
        href: labPath,
        kind: "Interactive labs",
      },
      {
        title: "The Deterministic Core",
        description:
          "Read the systems argument behind the visualizer collection.",
        href: articleUrl(
          "deterministic-core-algorithms-data-structures-marketing-agents",
        ),
        kind: "Publication essay",
      },
    ],
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
    question: "Make better decisions, then test their effect.",
    description:
      "Connect measurement, causal inference, prediction, and optimisation to growth decisions. Start with the objective and evidence needed to know whether an intervention helped.",
    short: "Experiments, incrementality, prediction, and optimisation.",
    availability: "Scope & related analysis",
    topics: [
      [
        "Measure & explain",
        "Define outcomes and baselines. Use experiments, incrementality, and attribution with explicit assumptions behind causal conclusions.",
      ],
      [
        "Predict & decide",
        "Explore forecasting, targeting, retention, and lifetime value with calibration, uncertainty, and business constraints.",
      ],
      [
        "Optimise & learn",
        "Apply budget allocation, bandits, and reinforcement learning with explicit feedback and evaluation. Runnable ML labs are planned.",
      ],
    ],
    resources: [
      {
        title: "Building to learn",
        description:
          "Explore the design decisions and trade-offs in an agentic marketing optimisation prototype.",
        href: articleUrl("building-to-learn-agentic-marketing-optimization"),
        kind: "Publication essay",
      },
      {
        title: "What should agentic marketing optimise?",
        description:
          "Examine the objectives and human outcomes behind an optimisation system.",
        href: articleUrl(
          "empowerment-imperative-agentic-marketing-human-flourishing",
        ),
        kind: "Publication essay",
      },
    ],
  },
  {
    slug: "ai-engineering",
    number: "05",
    nav: "AI engineering",
    title: "AI Engineering & Harnesses",
    question: "Build with agents. Build the systems around them.",
    description:
      "Use coding agents to build and verify integrations, then design the harness that lets agents operate them. Connect context, tools, memory, permissions and evaluation to a concrete workflow.",
    short: "Coding agents, tools, memory, orchestration, and evaluation.",
    availability: "Reference pattern & labs",
    topics: [
      [
        "Build with agents",
        "Investigate code, plan changes, implement, verify, and release with coding agents. Runtime-specific walkthroughs are planned.",
      ],
      [
        "Build agent systems",
        "Design tools, context, memory, skills, permissions, and orchestration around a concrete commercial workflow.",
      ],
      [
        "Evaluate & improve",
        "Trace outcomes, test failures, and distinguish memory updates, procedure changes, and learned policies before adding autonomy.",
      ],
    ],
    resources: [
      {
        title: "The agent control plane",
        description:
          "Follow identity, gateway, policy, inspection, and audit from intent to action.",
        href: controlPath,
        kind: "Reference pattern",
      },
      {
        title: "An approval state machine",
        description:
          "Step through the transition from a proposed change to execution.",
        href: visualizerUrl("approval"),
        kind: "Interactive lab",
      },
      {
        title: "Skills, tools & reusable capabilities",
        description:
          "Explore the companion catalogue, with setup requirements and source.",
        href: site.skills,
        kind: "Skills catalogue",
      },
    ],
  },
];
