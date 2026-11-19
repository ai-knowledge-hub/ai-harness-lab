// Long lines expose page overflow when an ordinary fence misses the wrapper.
export const codeFenceExamples = [
  { info: "javascript", label: "javascript code example" },
  { info: "", label: "Code example" },
  { info: "javascript example", label: "javascript code example" },
].map((example) => ({ ...example, code: `console.log("${"long line ".repeat(20)}");` }));

export const ordinaryCodeFences = codeFenceExamples
  .map(({ info, code }) => `\`\`\`${info}\n${code}\n\`\`\``)
  .join("\n\n");
