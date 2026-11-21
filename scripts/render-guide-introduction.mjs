import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";

// Introductions support prose formatting only. Compile with the same Markdown
// engine as the body while keeping raw HTML and interactive content out.
const tags = new Set(["p", "strong", "em", "code", "br"]);
const renderer = createSatteriMarkdownProcessor({
  syntaxHighlight: false,
  // GFM autolinks turn previously valid bare addresses into forbidden anchors.
  // Introductions only need CommonMark prose; leave bare URLs and emails as text.
  gfm: false,
  features: { smartPunctuation: false },
  hastPlugins: [{
    name: "guide-introduction-prose",
    before(root) {
      function check(node) {
        if (node.type !== "root" && node.type !== "text" && !(node.type === "element" && tags.has(node.tagName))) {
          throw new Error("Guide introductions support paragraphs, emphasis and inline code; put other content in the guide body.");
        }
        for (const child of node.children ?? []) check(child);
      }
      check(root);
    },
  }],
});

export async function renderGuideIntroduction(source) {
  return (await (await renderer).render(source)).code;
}
