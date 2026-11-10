import { Link } from "react-router-dom";
import { articleUrl, site } from "../content/site";

const mockLabCommands = [
  "lab_dir=$(mktemp -d) &&",
  "./bin/skills-hub install \\",
  "  --source remote --module plugins \\",
  `  --registry-url ${site.skills}/registry/plugins-index.json \\`,
  "  --entry marketing/chatgpt-advertising-experiment-plugin@0.2.0 \\",
  "  --runtime codex --execution-runtime python3 \\",
  '  --target "$lab_dir/plugins" --cache-dir "$lab_dir/cache" &&',
  'cd "$lab_dir/plugins/marketing/chatgpt-advertising-experiment-plugin" &&',
  "python3 scripts/run_mock_lab.py",
].join("\n");

const controlLayers = [
  {
    index: "01",
    title: "Agent Identity",
    summary:
      "Give every agent its own identity, scope, owner, and lifecycle instead of letting it borrow a human OAuth session.",
  },
  {
    index: "02",
    title: "Gateway",
    summary:
      "Route every tool call through one controlled boundary that can enforce account access, protocol rules, and approval gates.",
  },
  {
    index: "03",
    title: "Policy",
    summary:
      "Define which accounts, tools, budgets, write actions, and data classes the agent can touch before execution begins.",
  },
  {
    index: "04",
    title: "Inspection",
    summary:
      "Scan prompts, tool arguments, URLs, and responses for injection, leakage, unsafe destinations, and policy violations.",
  },
  {
    index: "05",
    title: "Audit",
    summary:
      "Log agent actions separately from human actions, including scope, tool, input hash, output hash, status, and approver.",
  },
];

const accessFlow = [
  "Agent requests campaign metrics",
  "Gateway checks agent identity",
  "Policy resolves allowed accounts",
  "Tool call runs with scoped credentials",
  "Audit log stores the action trail",
];

const approvalRules = [
  {
    action: "Read campaign metrics",
    risk: "Low",
    control: "Allow if account scope matches the agent policy.",
  },
  {
    action: "Export customer-level data",
    risk: "High",
    control: "Block by default or require security approval and redaction.",
  },
  {
    action: "Change campaign budget",
    risk: "High",
    control: "Require human approval, budget cap, and post-action audit event.",
  },
  {
    action: "Publish creative",
    risk: "Medium",
    control:
      "Require brand and compliance review before the tool call executes.",
  },
];

const mondayQuestions = [
  "Does the agent have its own identity, or does it inherit a person's credentials?",
  "Can access be revoked without touching the human account?",
  "Which gateway sees every outbound tool call?",
  "Which actions require approval before execution?",
  "Can the audit log separate agent activity from human activity?",
];

export function PatternsPage() {
  return (
    <main id="main-content" className="pattern-page" tabIndex={-1}>
      <nav className="breadcrumbs editorial-wrap" aria-label="Breadcrumb">
        <Link to="/">Harness</Link>
        <span aria-hidden="true">/</span>
        <Link to="/learn/ai-engineering">AI Engineering</Link>
        <span aria-hidden="true">/</span>
        <span>Control plane</span>
      </nav>
      <section
        className="module-hero control-hero"
        aria-labelledby="patterns-title"
      >
        <p className="eyebrow">Structural Patterns</p>
        <h1 id="patterns-title">Agent Control Plane</h1>
        <p>
          Identity, gateway, policy, inspection, and audit are the structures
          that let marketing agents touch real systems without becoming
          unmanaged automations. This reference pattern turns the security
          architecture into a practical harness pattern.
        </p>
        <div className="article-bridge" aria-label="Source article">
          <span className="manual-index">Source</span>
          <p>
            Related reading from AI Knowledge Hub:
            <strong> Secure Marketing Agents</strong>. The article develops an
            execution architecture; this pattern explores the control plane that
            marketing teams need before agents touch campaign data, commerce
            feeds, or publishing workflows.
          </p>
          <a
            className="inline-link"
            href={articleUrl(
              "building-secure-marketing-agents-ad-platform-authentication-architecture",
            )}
            target="_blank"
            rel="noreferrer"
          >
            Read article
          </a>
        </div>
        <a className="inline-link" href="#offline-mock-lab">Try the offline mock lab</a>
      </section>

      <section className="control-plane" aria-labelledby="control-plane-title">
        <div className="section-head">
          <p className="eyebrow">Reference pattern</p>
          <h2 id="control-plane-title">
            A governed route from agent intent to system action
          </h2>
        </div>

        <div className="control-grid">
          <article
            className="control-diagram"
            aria-label="Agent control plane diagram"
          >
            <div className="control-node agent-node">
              <span>Agent</span>
              <strong>Campaign optimization agent</strong>
              <p>Plans the work, but does not hold platform credentials.</p>
            </div>
            <div className="control-arrow" aria-hidden="true">
              ↓
            </div>
            <div className="control-node gateway-node">
              <span>Gateway</span>
              <strong>Identity + policy boundary</strong>
              <p>
                Checks scope, account access, protocol rules, and approval
                gates.
              </p>
            </div>
            <div className="control-arrow" aria-hidden="true">
              ↓
            </div>
            <div className="control-node tools-node">
              <span>Tools</span>
              <strong>Google Ads · DV360 · BigQuery · CMS</strong>
              <p>
                Run with scoped credentials owned by the gateway, not the agent.
              </p>
            </div>
            <div className="control-arrow" aria-hidden="true">
              ↓
            </div>
            <div className="control-node audit-node">
              <span>Audit</span>
              <strong>Action trail</strong>
              <p>
                Records actor, account, tool, decision, approver, and result.
              </p>
            </div>
          </article>

          <article className="control-case">
            <p className="eyebrow">Wrong default</p>
            <h3>Personal OAuth as agent identity</h3>
            <p>
              The agent inherits a human account, sees whatever the person sees,
              and breaks when the person leaves, rotates credentials, or changes
              roles. Audit also becomes ambiguous because human and agent
              actions collapse into one identity.
            </p>
            <div className="case-divider"></div>
            <p className="eyebrow">Safer pattern</p>
            <h3>Agent identity behind a gateway</h3>
            <p>
              The agent authenticates to the gateway. The gateway owns platform
              credentials, applies account-level policy, runs inspection, and
              logs the action trail separately from human activity.
            </p>
          </article>
        </div>
      </section>

      <section className="stack-map" aria-labelledby="control-layers-title">
        <div className="section-head">
          <p className="eyebrow">Control layers</p>
          <h2 id="control-layers-title">What the harness must provide</h2>
        </div>
        <div className="manual-list stack-manual">
          {controlLayers.map((layer) => (
            <article key={layer.title} className="manual-row">
              <span className="manual-index">{layer.index}</span>
              <div className="manual-body">
                <h3>{layer.title}</h3>
                <p>{layer.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="build-notes" aria-labelledby="flow-title">
        <div className="section-head">
          <p className="eyebrow">Execution path</p>
          <h2 id="flow-title">How a campaign data request should move</h2>
        </div>
        <ol className="flow-steps">
          {accessFlow.map((step, index) => (
            <li key={step}>
              <span className="manual-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="stack-map" aria-labelledby="approval-title">
        <div className="section-head">
          <p className="eyebrow">Approval gates</p>
          <h2 id="approval-title">Risk decides whether the agent can act</h2>
        </div>
        <div
          className="approval-table"
          role="table"
          aria-label="Agent action approval rules"
        >
          <div className="approval-row approval-head" role="row">
            <span role="columnheader">Action</span>
            <span role="columnheader">Risk</span>
            <span role="columnheader">Control</span>
          </div>
          {approvalRules.map((rule) => (
            <div key={rule.action} className="approval-row" role="row">
              <span role="cell">{rule.action}</span>
              <span
                role="cell"
                className={`risk risk-${rule.risk.toLowerCase()}`}
              >
                {rule.risk}
              </span>
              <span role="cell">{rule.control}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="offline-mock-lab" className="build-notes" aria-labelledby="mock-lab-title">
        <div className="section-head">
          <p className="eyebrow">Skills · Run locally</p>
          <h2 id="mock-lab-title">Review evidence before approving an action</h2>
        </div>
        <p>
          Before a reviewer approves a campaign action, they need to know which
          data the agent used and how it checked the result. The ChatGPT
          Advertising Experiment Plugin 0.2.0 lets you inspect that evidence
          with fictional account and campaign data.{" "}
          <a
            className="source-citation"
            href={`${site.skills}/release-manifests/plugins/marketing/chatgpt-advertising-experiment-plugin/0.2.0.yaml`}
          >
            View the Skills release manifest for 0.2.0
          </a>
        </p>
        <p>
          Use Python 3.9 or newer and run these commands from the Skills
          repository. If you need to build <code>./bin/skills-hub</code>, install
          Go and run <code>make cli-build</code> there first.{" "}
          <a className="source-citation" href="https://github.com/ai-knowledge-hub/ai-skills-guide">
            Open the Skills repository
          </a>
        </p>
        <p>
          Installation downloads the pinned release into a temporary directory.
          The mock run then uses the bundled data without credentials or
          network access.{" "}
          <a
            className="source-citation"
            href={`${site.skills}/plugins/marketing/chatgpt-advertising-experiment-plugin`}
          >
            Open the plugin in the Skills catalogue
          </a>
        </p>
        <figure className="lesson-code">
          <figcaption>Install and run the local mock lab</figcaption>
          <pre tabIndex={0} aria-label="Install and run the local mock lab"><code>{mockLabCommands}</code></pre>
        </figure>
        <p>
          Open <code>output/mock-evidence-bundle.json</code> in the installed
          plugin directory. The sample records zero network calls and one
          valid test conversion. In a separate matching example, it finds two
          event records, removes one duplicate, and matches one business
          outcome. Check those counts before using the bundle to inform a
          review.
        </p>
        <p>
          The lab exercises the evidence step. A live account read requires
          separate setup and verification, and the release has no live write
          adapter. To practise collecting report pages and handling missing
          results,{" "}
          <Link className="source-citation" to="/learn/system-design/chatgpt-ads-reporting#try-the-collector">
            try the separate Harness sample collector
          </Link>.
        </p>
      </section>

      <section className="build-notes" aria-labelledby="questions-title">
        <div className="section-head">
          <p className="eyebrow">Monday morning checklist</p>
          <h2 id="questions-title">
            Questions to ask before deploying an agent
          </h2>
        </div>
        <div className="question-list">
          {mondayQuestions.map((question, index) => (
            <article key={question} className="question-row">
              <span className="manual-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>{question}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
