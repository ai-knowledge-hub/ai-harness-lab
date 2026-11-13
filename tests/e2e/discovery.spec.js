import { test, expect } from "@playwright/test";
import { expectShellOrientation } from "../support/shell-orientation";

const readingRequirements = "Read in your browser. No installation, account or API key is needed.";
const labRequirements = "Step through a prepared example in your browser. JavaScript is needed; no installation, account or API key is required.";

async function expectReadingSetup(page) {
  const requirements = page.locator('[data-task-requirements="guide"]');
  await expect(requirements).toBeVisible();
  await expect(requirements).toHaveText("No installation is needed to read this guide.");
}

async function expectLabSetup(page) {
  const requirements = page.locator('[data-task-requirements="lab"]');
  await expect(requirements).toBeVisible();
  await expect(requirements).toContainText("JavaScript is needed to select a visualizer and use playback.");
  await expect(requirements).toContainText("No installation, account or API key is needed.");
  await expect(requirements).toContainText("Without JavaScript, you can read the default Binary Search example below");
  await expect(requirements.getByRole("link", { name: "pattern summaries in Algorithms & Data" }))
    .toHaveAttribute("href", "/learn/algorithms");
}

async function expectNoCompanions(page) {
  await expect(page.locator("#related-reading, .guide-case-study, .lesson-video-note, #try-the-collector")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Write a decision rule before the test" })).toBeVisible();
}

test("a reader can start with a principle or go directly to the featured case", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [slug, action, mode] of [
    ["system-design", "Read API design principles", "guide"],
    ["algorithms", "Try the top-three campaign lab", "lab"],
    ["software-production", "Explore the lease queue lab", "lab"],
    ["measurement-ml", "Compare credited conversions and lift", "guide"],
    ["ai-engineering", "Verify a small code change with an agent", "guide"],
  ]) {
    await page.goto("/");
    await page.getByRole("region", { name: "Engineering tracks" }).locator(`a[href="/learn/${slug}"]`).click();
    const start = page.getByRole("region", { name: "Start here" });
    const next = start.getByRole("link", { name: action, exact: true });
    await expect(next).toHaveAttribute("aria-describedby", "start-requirements");
    await expect(start.locator("#start-requirements")).toBeVisible();
    await expect(start.locator("#start-requirements")).toContainText(mode === "guide" ? readingRequirements : labRequirements);
    await expect(next).toHaveAccessibleDescription(mode === "guide" ? /No installation, account or API key is needed/ : /JavaScript is needed/);
    if (slug === "system-design") {
      await expect(start.locator(".task-prerequisite")).toContainText("HTTP, the rules software follows to send a request over the web and receive a reply.");
      await expect(next).toHaveAccessibleDescription(/HTTP, the rules software follows/);
    }
    await next.click();
    if (mode === "guide") await expectReadingSetup(page);
    else await expectLabSetup(page);
  }
  await page.goto("/");
  await page.getByRole("link", { name: "Explore the tracks", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Engineering tracks", exact: true })).toBeInViewport();
  await page.getByRole("region", { name: "Engineering tracks" })
    .getByRole("link", { name: /System design/ }).click();
  const start = page.getByRole("region", { name: "Start here" });
  await expect(start.getByRole("heading", { name: "Map the system before choosing components" })).toBeVisible();
  await start.getByRole("link", { name: "Read API design principles" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "API design principles" })).toBeVisible();
  await page.getByRole("region", { name: "How to collect ChatGPT Ads reports" })
    .getByRole("link", { name: "Read the reporting case" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "How to collect ChatGPT Ads reports" })).toBeVisible();
  await expect(page.getByText("Guide preview", { exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link", { name: "System design" }).click();
  await expect(start).toBeVisible();

  await page.goto("/");
  await page.getByRole("link", { name: "See the featured case" }).click();
  const featured = page.getByRole("region", { name: "How to collect ChatGPT Ads reports" });
  await expect(featured.getByText("Featured case · Preview", { exact: true })).toBeInViewport();
  await featured.getByRole("link", { name: "Read the reporting case" }).click();
  await expect(page).toHaveURL(/\/learn\/system-design\/chatgpt-ads-reporting$/);
  const tracks = page.getByRole("navigation", { name: "Explore the case by track" });
  await expect(tracks.getByRole("listitem")).toHaveCount(5);
  await tracks.getByRole("link", { name: /AI engineering/ }).click();
  await expect(page.getByRole("heading", { name: "Give an agent a bounded reporting tool" })).toBeInViewport();
  await tracks.getByRole("link", { name: "Run the samples locally" }).click();
  await expect(page.getByRole("heading", { name: "Try the report collector" })).toBeInViewport();
  await expect(page.getByRole("link", { name: "Open run instructions for Local reporting CLI and MCP tool" })).toBeVisible();
});

test.describe("production discovery on a phone without JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test("the lab, local sample, and reporting case have usable links", async ({ page }) => {
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of ["/", "/learn/software-production", "/learn/system-design/api-design", "/learn/system-design/chatgpt-ads-reporting", "/learn/algorithms/visualizers", "/learn/measurement-ml/attribution-and-lift"]) {
        await page.goto(route);
        await expectShellOrientation(page);
        if (route.includes("/system-design/")) await expectReadingSetup(page);
        if (route.endsWith("/visualizers")) await expectLabSetup(page);
        if (route.endsWith("/attribution-and-lift")) await expectNoCompanions(page);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/learn/software-production");
    const start = page.getByRole("region", { name: "Start here" });
    await expect(start.getByRole("heading", { name: "Design for an interrupted run" })).toBeVisible();
    const lab = start.getByRole("link", { name: "Explore the lease queue lab" });
    await expect(start.locator("#start-requirements")).toHaveText(labRequirements);
    await expect(lab).toHaveAttribute("href", "/learn/algorithms/visualizers?algorithm=leaseQueue#visualizer");
    await page.getByRole("navigation", { name: "On this track" })
      .getByRole("link", { name: "Worked examples" }).click();
    const examples = page.getByRole("region", { name: "Worked examples" });
    await expect(examples.getByRole("heading", { name: "Worked examples" })).toBeInViewport();
    await expect(examples.getByText("Run locally · Sample data", { exact: true })).toBeVisible();
    await expect(examples.getByRole("link", { name: "Open run instructions" }))
      .toHaveAttribute("href", /^https:\/\/github\.com\/ai-knowledge-hub\/ai-harness-lab\/blob\/[a-f0-9]{40}\/docs\/chatgpt-ads-reporting-collector\.md$/);
    await expect(page.getByRole("region", { name: "In development" }).getByRole("link")).toHaveCount(0);
    await examples.getByRole("link", { name: "Handle an interrupted report" }).click();
    await expect(page).toHaveURL(/\/learn\/system-design\/chatgpt-ads-reporting#application-result$/);
    const section = page.getByRole("region", { name: "Show what your report is missing" });
    await expect(section.getByRole("heading", { level: 2 })).toBeInViewport();
    await section.getByRole("link", { name: "Explore Software & production" }).click();
    await expect(page).toHaveURL(/\/learn\/software-production$/);
  });
});

test("the new starting paths lead to working references on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn/measurement-ml");
  const start = page.getByRole("region", { name: "Start here" });
  const jump = page.getByRole("navigation", { name: "On this track" });
  await expect(jump.getByRole("link", { name: "Reusable guides" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "In development" }).getByRole("link")).toHaveCount(0);
  await start.getByRole("link", { name: "Compare credited conversions and lift" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "How to compare attributed conversions and lift" })).toBeVisible();
  // This real guide has zero Publication, Skills and video relationships.
  // Its own decision guidance stays complete; family navigation stays separate.
  await expectNoCompanions(page);
  await expectShellOrientation(page);
  await expect(page.getByRole("table").getByRole("cell", { name: "2.0%", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Interpret credited conversions in the reporting case" }).click();
  await expect(page).toHaveURL(/chatgpt-ads-reporting#interpret-metrics$/);
  await expect(page.getByRole("heading", { name: "Interpret credited conversions", exact: true })).toBeInViewport();

  await page.goto("/learn/ai-engineering");
  await expect(start.getByText("Use an agent to build software.", { exact: true })).toBeVisible();
  await expect(start.getByText("Design a system for an agent to operate.", { exact: true })).toBeVisible();
  await start.getByRole("link", { name: "Verify a small code change with an agent" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Verify a small code change with an agent" })).toBeVisible();
  await expectReadingSetup(page);
  await expect(page.locator("#run-the-skills-example")).toContainText("Node.js 22");
  await expect(page.locator("#run-the-skills-example")).toContainText("The helper prints a plan.");
  await expect(page.locator("#run-the-skills-example")).toContainText("merge_authorized to false");
  await expect(page.getByRole("link", { name: /The Code Agent’s Playbook/ }))
    .toHaveAttribute("href", "https://ai-knowledge-hub.org/library/agent-maintenance-security-harness/#separate-validation-of-a-change-from-evaluation-of-the-maintainer");
  const companions = page.getByRole("region", { name: "Related reading and resources" });
  await expect(companions.getByText("Optional companions", { exact: true })).toBeVisible();
  await expect(companions).toContainText("an independent check supports a review");
  await expect(page.getByRole("link", { name: "Download Code Maintenance Plugin 0.2.0 from Skills" }))
    .toHaveAttribute("href", "https://skills.ai-knowledge-hub.org/artifacts/engineering/code-maintenance-plugin/0.2.0.tar.gz");
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "AI engineering" }).click();
  const references = page.getByRole("region", { name: "References", exact: true });
  for (const [action, path] of [
    ["Inspect the coding workflow package in Skills", "engineering/code-maintenance-plugin"],
    ["Inspect the harness review package in Skills", "agentops/harness-governance-plugin"],
  ]) {
    await expect(references.getByRole("link", { name: action, exact: true }))
      .toHaveAttribute("href", `https://skills.ai-knowledge-hub.org/plugins/${path}`);
  }
  await page.getByRole("region", { name: "References" })
    .getByRole("link", { name: "Trace a report request through the control plane" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Agent Control Plane" })).toBeVisible();
  await page.getByRole("link", { name: "Try the offline mock lab" }).click();
  const mockLab = page.getByRole("region", { name: "Review evidence before approving an action" });
  await expect(mockLab.getByRole("heading")).toBeInViewport();
  await expect(mockLab.getByRole("link", { name: "View the Skills release manifest for 0.2.0" }))
    .toHaveAttribute("href", "https://skills.ai-knowledge-hub.org/release-manifests/plugins/marketing/chatgpt-advertising-experiment-plugin/0.2.0.yaml");
  await expect(mockLab.getByRole("link", { name: "try the separate Harness sample collector" }))
    .toHaveAttribute("href", "/learn/system-design/chatgpt-ads-reporting#try-the-collector");
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "AI Engineering" }).click();
  await jump.getByRole("link", { name: "Worked examples" }).click();
  await page.getByRole("link", { name: "Step through an approval" }).click();
  await expect(page).toHaveURL(/algorithm=approval#visualizer$/);
  await expect(page.getByRole("heading", { name: "Approval State Machine", exact: true })).toBeInViewport();
});
