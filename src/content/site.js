export const site = {
  origin: "https://harness.ai-knowledge-hub.org",
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
      "See how advertising platforms choose which ads to show, what advertisers can control and how to collect the results in your own tools.",
    short: "How platforms choose ads and report results.",
    availability: "Platform overviews & guides",
    topics: [
      [
        "Understand ad delivery",
        "See where ads appear, what makes an ad qualify and which campaign settings you can change.",
      ],
      [
        "Plan what your reports need",
        "Choose the accounts, dates and metrics, then check access and decide how to spot missing or out-of-date results.",
      ],
      [
        "Collect and save reports",
        "Handle reports that arrive in batches, large files and figures that change later. A working report collector is planned.",
      ],
    ],
    resources: [],
  },
  {
    slug: "algorithms",
    number: "02",
    nav: "Algorithms & data",
    title: "Algorithms & Data",
    question: "Make the underlying logic visible.",
    description:
      "Implement the operations behind a useful integration: traverse pages, deduplicate records, aggregate metrics, rank results and coordinate work. Use reference code and visible state to inspect how a pattern behaves before adapting it.",
    application:
      "For ChatGPT Ads, this means retrieving the requested population and producing defensible totals. Reporting-specific code is planned; the existing visualizers provide references for the underlying operations.",
    short: "Search, ranking, scheduling, memory, and deterministic control.",
    availability: "Interactive visualizers",
    topics: [
      [
        "Retrieve the complete population",
        "Follow continuations, detect repeated cursors and retain the reason a read stopped. Provider-specific reporting examples are planned.",
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
    title: "Software Design & Production",
    question: "Take a working feature into reliable operation.",
    description:
      "Turn an integration into software you can run repeatedly and recover when it fails. Work through component boundaries, storage, deployment, networking, concurrency, observability and operating cost.",
    application:
      "For ChatGPT Ads, the production problem is an ingestion service that can resume interrupted work, reconcile late data and expose coverage gaps. That reference build is planned; this track establishes the operating decisions it must make.",
    short: "Component design, concurrency, deployment, and reliable operation.",
    availability: "Scope & working references",
    topics: [
      [
        "Design the ingestion boundary",
        "Separate provider adapters, raw evidence, transformed data and the API your product exposes. Make account isolation and failure contracts explicit.",
      ],
      [
        "Resume and reconcile",
        "Use checkpoints, bounded retries, deduplication and backfills to recover from interrupted jobs and late or revised reports.",
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
          "Design scoped access and execution boundaries for advertising integrations.",
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
    application:
      "For ChatGPT Ads, begin with what the reporting metrics mean, which signals inform delivery and which comparison could establish additional business value. Platform-specific measurement and ML implementations are planned.",
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
    application:
      "For ChatGPT Ads, the first operational target is a reporting capability with explicit scope, completeness and failure semantics. Coding-agent walkthroughs and reporting CLI/MCP adapters are planned; the control-plane reference is available now.",
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
