// @vitest-environment node
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateAuthoredGuideOutput } from "../../scripts/validate-authored-guide-output.mjs";

const origin = "https://harness.ai-knowledge-hub.org";
const guide = "/learn/measurement-ml/attribution-and-lift";

describe("guide links across served addresses", () => {
  let output;

  beforeEach(async () => {
    output = await mkdtemp(join(tmpdir(), "guide-destinations-"));
    await mkdir(join(output, guide), { recursive: true });
    await writeFile(join(output, "/learn/measurement-ml/index.html"), '<main id="section">Track</main>');
  });

  afterEach(async () => {
    await rm(output, { recursive: true, force: true });
  });

  async function writeGuide(href) {
    const html = `<article data-authored-guide><section class="lesson-section" id="section"><h2>Guide</h2><p><a href="${href}">Destination</a></p></section></article>`;
    await writeFile(join(output, guide, "index.html"), html);
    await writeFile(join(output, guide + ".html"), html);
  }

  it.each(["./index.html", "./index.html?mode=read#section"])(
    "rejects existing but different destinations for %s",
    async (href) => {
      await writeGuide(href);
      await expect(validateAuthoredGuideOutput(output, origin, "never"))
        .rejects.toThrow("link destination changes across served URLs");
    },
  );

  it.each([
    "/learn/measurement-ml/",
    "https://harness.ai-knowledge-hub.org/learn/measurement-ml/?mode=read#section",
  ])("rejects a trailing-slash link under the never policy: %s", async (href) => {
    await writeGuide(href);
    await expect(validateAuthoredGuideOutput(output, origin, "never"))
      .rejects.toThrow("local destination violates trailingSlash=never");
  });

  it.each(["always", "ignore"])("accepts trailing-slash links under %s", async (policy) => {
    await writeGuide("/learn/measurement-ml/#section");
    await expect(validateAuthoredGuideOutput(output, origin, policy)).resolves.toBeUndefined();
  });

  it("requires trailing slashes on extensionless paths under always", async () => {
    await writeGuide("/learn/measurement-ml");
    await expect(validateAuthoredGuideOutput(output, origin, "always"))
      .rejects.toThrow("local destination violates trailingSlash=always");
  });

  it.each([
    "#section",
    "?mode=read#section",
    "/learn/measurement-ml/index.html#section",
    "/learn/measurement-ml#section",
    "/learn/measurement-ml/attribution-and-lift.html#section",
    "https://example.com/source?mode=read#section",
  ])("accepts the same document, query and fragment for %s", async (href) => {
    await writeGuide(href);
    await expect(validateAuthoredGuideOutput(output, origin, "never")).resolves.toBeUndefined();
  });
});
