// @vitest-environment node
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { renderGuideIntroduction } from "../../scripts/render-guide-introduction.mjs";

describe("guide introduction prose", () => {
  it.each([
    "Contact hello@example.com for details.",
    "Visit https://example.com/retries?mode=safe&limit=1 for details.",
    "Visit www.example.com for details.",
  ])("preserves bare addresses as text: %s", async (source) => {
    const document = new JSDOM(await renderGuideIntroduction(source)).window.document;
    expect(document.body.textContent.trim()).toBe(source);
    expect(document.querySelector("a")).toBeNull();
  });

  it("retains paragraph and inline formatting around addresses", async () => {
    const document = new JSDOM(await renderGuideIntroduction(
      "Contact **hello@example.com**.\n\nRead *https://example.com* and `www.example.com`.",
    )).window.document;
    expect(document.querySelectorAll("p")).toHaveLength(2);
    expect(document.querySelector("strong").textContent).toBe("hello@example.com");
    expect(document.querySelector("em").textContent).toBe("https://example.com");
    expect(document.querySelector("code").textContent).toBe("www.example.com");
    expect(document.querySelector("a")).toBeNull();
  });

  it.each([
    '[A link](https://example.com)',
    '[Unsafe link](javascript:alert(1))',
    '<a href="https://example.com">Raw HTML</a>',
    '<img src="x" onerror="alert(1)">',
  ])("keeps rejecting content outside the prose allowlist: %s", async (source) => {
    await expect(renderGuideIntroduction(source)).rejects.toThrow("Guide introductions support paragraphs");
  });
});
