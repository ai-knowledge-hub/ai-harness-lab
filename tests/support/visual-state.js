// A theme/viewport-independent representation of the diagram itself. Metadata
// outside the visualization and ARIA labels must not stand in for visual state.
export function visualState(root) {
  function visit(node) {
    if (node.nodeType === 3) return node.textContent.replace(/\s+/g, " ").trim() || null;
    if (node.nodeType !== 1) return null;
    const attributes = [...node.attributes]
      .filter(({ name }) => name !== "role" && !name.startsWith("aria-"))
      .map(({ name, value }) => [name, name === "class" ? value.split(/\s+/).filter(Boolean).sort().join(" ") : value])
      .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
    return [node.localName, attributes, [...node.childNodes].map(visit).filter(value => value !== null)];
  }
  return JSON.stringify([...root.childNodes].map(visit).filter(value => value !== null));
}
