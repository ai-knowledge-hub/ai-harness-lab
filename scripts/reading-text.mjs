const blocks = new Set(["MAIN", "SECTION", "NAV", "ARTICLE", "ASIDE", "DIV", "H1", "H2", "H3", "H4", "P", "UL", "OL", "LI", "DL", "DT", "DD", "FIGURE", "FIGCAPTION", "PRE", "TABLE", "TR", "TH", "TD", "DETAILS", "SUMMARY"]);
export function readingText(node) {
  function visit(element) {
    if (element.nodeType === 3) return element.textContent;
    if (element.nodeType !== 1 || ["SCRIPT", "STYLE", "TEMPLATE"].includes(element.tagName)) return "";
    const text = [...element.childNodes].map(visit).join("");
    return blocks.has(element.tagName) ? `\n${text}\n` : text;
  }
  return visit(node).replace(/\s+/g, " ").trim();
}
