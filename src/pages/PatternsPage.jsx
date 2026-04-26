const ARTICLE_URL =
  "https://ai-news-hub.performics-labs.com/news/google-cloud-next-2026-marketing-commerce-adtech-impact";

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
    control: "Require brand and compliance review before the tool call executes.",
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
    <main>
      <section className="module-hero control-hero" aria-labelledby="patterns-title">
        <p className="eyebrow">Structural Patterns</p>
        <h1 id="patterns-title">Agent Control Plane</h1>
        <p>
          Identity, gateway, policy, inspection, and audit are the structures that
          let marketing agents touch real systems without becoming unmanaged
          automations. This page turns the Google Cloud Next security argument
          into a practical harness pattern.
        </p>
        <div className="article-bridge" aria-label="Source article">
          <span className="manual-index">Source</span>
          <p>
            Companion pattern for the AI News Hub article
            <strong> Google Cloud Next 2026: What Changes for Marketing, Commerce, and Ad Tech</strong>.
            The article explains the platform shift; this module shows the control
            plane that marketing teams need before agents touch campaign data,
            commerce feeds, or publishing workflows.
          </p>
          <a className="inline-link" href={ARTICLE_URL} target="_blank" rel="noreferrer">
            Read article
          </a>
        </div>
      </section>

      <section className="control-plane" aria-labelledby="control-plane-title">
        <div className="section-head">
          <p className="eyebrow">Reference pattern</p>
          <h2 id="control-plane-title">A governed route from agent intent to system action</h2>
        </div>

        <div className="control-grid">
          <article className="control-diagram" aria-label="Agent control plane diagram">
            <div className="control-node agent-node">
              <span>Agent</span>
              <strong>Campaign optimization agent</strong>
              <p>Plans the work, but does not hold platform credentials.</p>
            </div>
            <div className="control-arrow" aria-hidden="true">↓</div>
            <div className="control-node gateway-node">
              <span>Gateway</span>
              <strong>Identity + policy boundary</strong>
              <p>Checks scope, account access, protocol rules, and approval gates.</p>
            </div>
            <div className="control-arrow" aria-hidden="true">↓</div>
            <div className="control-node tools-node">
              <span>Tools</span>
              <strong>Google Ads · DV360 · BigQuery · CMS</strong>
              <p>Run with scoped credentials owned by the gateway, not the agent.</p>
            </div>
            <div className="control-arrow" aria-hidden="true">↓</div>
            <div className="control-node audit-node">
              <span>Audit</span>
              <strong>Action trail</strong>
              <p>Records actor, account, tool, decision, approver, and result.</p>
            </div>
          </article>

          <article className="control-case">
            <p className="eyebrow">Wrong default</p>
            <h3>Personal OAuth as agent identity</h3>
            <p>
              The agent inherits a human account, sees whatever the person sees,
              and breaks when the person leaves, rotates credentials, or changes
              roles. Audit also becomes ambiguous because human and agent actions
              collapse into one identity.
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
              <span className="manual-index">{String(index + 1).padStart(2, "0")}</span>
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
        <div className="approval-table" role="table" aria-label="Agent action approval rules">
          <div className="approval-row approval-head" role="row">
            <span role="columnheader">Action</span>
            <span role="columnheader">Risk</span>
            <span role="columnheader">Control</span>
          </div>
          {approvalRules.map((rule) => (
            <div key={rule.action} className="approval-row" role="row">
              <span role="cell">{rule.action}</span>
              <span role="cell" className={`risk risk-${rule.risk.toLowerCase()}`}>
                {rule.risk}
              </span>
              <span role="cell">{rule.control}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="build-notes" aria-labelledby="questions-title">
        <div className="section-head">
          <p className="eyebrow">Monday morning checklist</p>
          <h2 id="questions-title">Questions to ask before deploying an agent</h2>
        </div>
        <div className="question-list">
          {mondayQuestions.map((question, index) => (
            <article key={question} className="question-row">
              <span className="manual-index">{String(index + 1).padStart(2, "0")}</span>
              <p>{question}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
