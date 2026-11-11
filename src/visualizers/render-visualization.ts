import type { Algorithm } from "./algorithms-data";
import { renderBinary } from "./binary-search";
import { escapeHtml, renderers } from "./renderers";

function renderStep<Step extends { label: string }>(
  steps: Step[],
  index: number,
  render: (step: Step) => string,
) {
  const step = steps[index] ?? steps[0];
  return render(step).replace("<svg ", `<svg aria-label="${escapeHtml(step.label)}" `);
}

export function renderVisualization(algorithm: Algorithm, stepIndex: number) {
  if (algorithm.id === "binary") {
    return renderStep(algorithm.steps, stepIndex, renderBinary);
  }
  return renderStep(algorithm.steps, stepIndex, renderers[algorithm.id]);
}
