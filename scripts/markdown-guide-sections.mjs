const text = (value) => ({ type: "text", value });

function guideTable(node, context) {
  const groups = node.children.filter((child) => child.type === "element");
  const firstRow = groups[0]?.children.find((child) => child.tagName === "tr");
  const wide = firstRow?.children.filter((child) => child.type === "element").length > 2;
  const table = {
    ...node,
    properties: { ...node.properties, className: ["lesson-table"] },
    children: groups.map((group) => ({
      ...group,
      children: group.children.filter((row) => row.tagName === "tr").map((row) => ({
        ...row,
        children: row.children.filter((cell) => cell.type === "element").map((cell, index) => {
          const scope = group.tagName === "thead" ? "col" : index === 0 ? "row" : undefined;
          return scope ? { ...cell, tagName: "th", properties: { ...cell.properties, scope } } : cell;
        }),
      })),
    })),
  };

  context.replaceNode(node, {
    type: "element",
    tagName: "div",
    properties: wide
      ? { className: ["lesson-table-wrap", "lesson-table-wide"], tabIndex: 0, role: "region", ariaLabel: "Scrollable comparison table" }
      : { className: ["lesson-table-wrap"] },
    children: wide ? [
      {
        type: "element",
        tagName: "p",
        properties: { className: ["table-scroll-hint"] },
        children: [text("Scroll across to compare all columns →")],
      },
      table,
    ] : [table],
  });
}

function guideCode(node, context) {
  const code = node.children.find((child) => child.tagName === "code");
  if (!code) return;
  const metadata = code?.data;
  const hasTitle = metadata?.meta?.startsWith("title=");
  const label = hasTitle
    ? JSON.parse(metadata.meta.slice("title=".length))
    : metadata?.lang ? `${metadata.lang} code example` : "Code example";
  if (typeof label !== "string" || !label.trim()) throw new Error("Code fence title must be nonempty text");
  context.replaceNode(node, {
    type: "element",
    tagName: "figure",
    properties: { className: ["lesson-code"] },
    children: [
      ...(hasTitle ? [{
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: [text(label), { type: "element", tagName: "span", properties: {}, children: [text(metadata.lang)] }],
      }] : []),
      { ...node, properties: { ...node.properties, tabIndex: 0, role: "region", ariaLabel: label } },
    ],
  });
}

// Keep the same document structure and fragment IDs as the typed guide renderer.
export function guideSections({ data, fileURL }) {
  const ids = data.astro?.frontmatter?.sectionIds;
  if (!Array.isArray(ids)) return;

  return {
    name: "harness-guide-sections",
    element: [
      { filter: ["table"], visit: guideTable },
      { filter: ["pre"], visit: guideCode },
      { filter: ["ul"], visit: (node, context) => context.setProperty(node, "className", ["lesson-list"]) },
      {
        filter: ["a"],
        visit(node, context) {
          if (context.parent(node)?.tagName === "p" && node.properties.href?.startsWith("https://")) {
            context.setProperty(node, "className", ["source-citation"]);
          }
        },
      },
    ],
    before(root, context) {
      const children = [];
      let section;
      let index = 0;
      for (const node of root.children) {
        if (node.type === "element" && node.tagName === "h1") {
          throw new Error(`${fileURL}: the guide title supplies the level-one heading`);
        }
        if (node.type === "mdxjsEsm") {
          children.push(node);
        } else if (node.type === "element" && node.tagName === "h2") {
          const id = ids[index++];
          if (!id) throw new Error(`${fileURL}: level-two heading has no section ID`);
          const headingId = `${id}-title`;
          section = {
            type: "element",
            tagName: "section",
            properties: { id, className: ["lesson-section"], ariaLabelledBy: [headingId] },
            children: [{ ...node, properties: { ...node.properties, id: headingId } }],
          };
          children.push(section);
        } else if (section) {
          section.children.push(node);
        } else if (node.type !== "text" || node.value.trim()) {
          throw new Error(`${fileURL}: guide content must begin with a level-two heading`);
        }
      }
      if (index !== ids.length) throw new Error(`${fileURL}: expected a heading for every section ID`);
      context.setField(root, "children", children);
    },
  };
}
