export const site = {
  name: "Harness",
  family: "AI Knowledge Hub",
  description:
    "Practical engineering for AI-powered growth. Explore system design, algorithms, software production, measurement, and agent harnesses.",
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
    title: "Platforms & System Design",
    question: "Understand the systems that distribute products.",
    description:
      "Study the architecture behind advertising, search, and distribution. Connect APIs, event pipelines, auctions, retrieval, and serving to the systems you can build.",
    short: "Platforms, APIs, auctions, and the architecture of distribution.",
    availability: "Foundations & reading",
    topics: [
      [
        "Platform architecture",
        "Follow an impression, click, and conversion through a system. Separate documented platform behaviour from educational models.",
      ],
      [
        "APIs & integrations",
        "Model accounts, resources, permissions, pagination, quotas, and failures before connecting an advertising platform.",
      ],
      [
        "Data & serving",
        "Explore event collection, queues, aggregation, caching, and the trade-offs between freshness, latency, and cost.",
      ],
    ],
    resources: [
      {
        title: "Rate limiting with a token bucket",
        description:
          "Step through a gateway controlling the rate of tool calls.",
        href: visualizerUrl("tokenBucket"),
        kind: "Interactive lab",
      },
      {
        title: "Designing the marketing agent’s tool layer",
        description:
          "Read the publication guide to bounded tools, APIs, MCP, and CLI interfaces.",
        href: articleUrl(
          "muscles-of-the-machine-tools-mcp-cli-first-principles-marketing",
        ),
        kind: "Publication guide",
      },
    ],
  },
  {
    slug: "algorithms",
    number: "02",
    nav: "Algorithms & data",
    title: "Algorithms & Data",
    question: "Make the underlying logic visible.",
    description:
      "Step through the data structures and algorithms used in marketing systems. Follow the state, inspect the code, and understand the conditions that make each pattern useful.",
    short: "Search, ranking, scheduling, memory, and deterministic control.",
    availability: "Interactive visualizers",
    topics: [
      [
        "Find, explore & rank",
        "Search collections, traverse websites and repositories, and maintain a ranked set of campaign results.",
      ],
      [
        "Schedule & coordinate",
        "Order dependent tasks, find routes, group related incidents, and coordinate workers.",
      ],
      [
        "Memory & control",
        "Explore bounded buffers, probabilistic filters, approvals, rate limits, permissions, and audit chains.",
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
    title: "Software Design & Production",
    question: "Take a working feature into reliable operation.",
    description:
      "Design components, contracts, and state transitions, then work through deployment, infrastructure, networking, reliability, observability, and operating cost.",
    short: "Component design, concurrency, deployment, and reliable operation.",
    availability: "Foundations & reading",
    topics: [
      [
        "Design the software",
        "Define interfaces, provider adapters, data models, state, and failure contracts that can evolve with the product.",
      ],
      [
        "Coordinate work",
        "Reason about concurrency, duplicate jobs, leases, retries, interrupted execution, and recovery.",
      ],
      [
        "Operate the software",
        "Plan deployment, networking, secrets, account isolation, monitoring, capacity, and cost. Full deployment walkthroughs are planned.",
      ],
    ],
    resources: [
      {
        title: "Coordinating workers with a lease",
        description:
          "Inspect the states of a lease-locked queue and its workers.",
        href: visualizerUrl("leaseQueue"),
        kind: "Interactive lab",
      },
      {
        title: "Secure marketing agents",
        description:
          "Study scoped access and execution boundaries for advertising integrations.",
        href: articleUrl(
          "building-secure-marketing-agents-ad-platform-authentication-architecture",
        ),
        kind: "Publication guide",
      },
    ],
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
    availability: "Foundations & reading",
    topics: [
      [
        "Measure & explain",
        "Define outcomes and baselines. Study experiments, incrementality, attribution, and the assumptions behind causal conclusions.",
      ],
      [
        "Predict & decide",
        "Explore forecasting, targeting, retention, and lifetime value with calibration, uncertainty, and business constraints.",
      ],
      [
        "Optimise & learn",
        "Study budget allocation, bandits, and reinforcement learning through explicit feedback and evaluation. Runnable ML labs are planned.",
      ],
    ],
    resources: [
      {
        title: "Building to learn",
        description:
          "Read the lessons from prototyping agentic marketing optimisation.",
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
      "Learn the engineering behind agent-assisted development and agent-powered products: context, tools, memory, orchestration, evaluation, and the harness that connects them.",
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
