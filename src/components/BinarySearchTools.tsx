import { useEffect, useState } from "react";
import { binaryScenarios, worstCaseEvaluations, type BinaryExperiment } from "../visualizers/binary-search";

export function BinarySearchSettings({ experiment, threshold, reveal, onExperiment, onThreshold, onReveal }: {
  experiment: BinaryExperiment; threshold: number; reveal: boolean;
  onExperiment: (value: BinaryExperiment) => void; onThreshold: (value: number) => void; onReveal: (value: boolean) => void;
}) {
  const [draftThreshold, setDraftThreshold] = useState(String(threshold));
  useEffect(() => { setDraftThreshold(String(threshold)); }, [threshold, experiment]);
  return <div className="binary-settings">
    <div className="binary-field"><label htmlFor="binary-experiment">Experiment</label>
      <select id="binary-experiment" value={experiment} onChange={event => onExperiment(event.target.value as BinaryExperiment)}>
        <option value="boundary">Locate the boundary</option>
        <option value="counterexample">Break the assumption</option>
        <option value="growth">Scale the search</option>
      </select>
    </div>
    {experiment !== "growth" && <>
      <form key={experiment} onSubmit={event => {
        event.preventDefault();
        const value = Number(new FormData(event.currentTarget).get("threshold"));
        if (Number.isFinite(value)) onThreshold(value);
      }}>
        <label htmlFor="binary-threshold">Threshold (£)
          <input id="binary-threshold" name="threshold" type="number" step="any" required
            value={draftThreshold} onChange={event => setDraftThreshold(event.target.value)} />
        </label>
        <button type="submit">Apply threshold</button>
      </form>
      <label htmlFor="binary-reveal" className="binary-reveal">
        <input id="binary-reveal" type="checkbox" checked={reveal} onChange={event => onReveal(event.target.checked)} />
        Reveal all dataset values
      </label>
      <p className="binary-dataset-label">{binaryScenarios[experiment].unit}. {experiment === "counterexample"
        ? `CPA means cost per acquisition. Find the first day at or above £${threshold}. These values rise and fall, so an earlier day may qualify even when a later day does not.`
        : `Find the first day whose total spending reaches at least £${threshold}. These totals never decrease.`} The records stay fixed during the search.
        {reveal && " Revealing values lets you read them; it does not add checks to the search."}</p>
    </>}
  </div>;
}

export function BinarySearchGrowth() {
  const [power, setPower] = useState(10);
  const records = 2 ** power;
  const comparisons = worstCaseEvaluations(records);
  return <article className="binary-growth">
    <h3>What changes when the dataset doubles?</h3>
    <p>Compare the greatest number of checks each search could need. One check, or predicate evaluation, asks whether a record meets the threshold. The numbers are calculated from the dataset size, rather than measured by running a search.</p>
    <label htmlFor="binary-scale">Records: {records.toLocaleString("en-GB")}</label>
    <input id="binary-scale" type="range" min="1" max="20" value={power}
      aria-valuetext={`${records.toLocaleString("en-GB")} records`}
      onChange={event => setPower(Number(event.target.value))} />
    <div className="binary-growth-bars">
      <p><span>Linear search</span><strong>{records.toLocaleString("en-GB")}</strong></p>
      <div className="binary-growth-track"><span style={{ width: "100%" }} /></div>
      <p><span>Binary search</span><strong>{comparisons}</strong></p>
      <div className="binary-growth-track"><span style={{ width: `${comparisons / records * 100}%` }} /></div>
    </div>
    <p>The bars share a linear scale. Doubling from {(records / 2).toLocaleString("en-GB")} to {records.toLocaleString("en-GB")} records doubles the linear bound and adds one binary-search evaluation.</p>
    <table>
      <caption>Worst-case checks, assuming each record can be accessed and checked at a fixed cost</caption>
      <thead><tr><th scope="col">Records</th><th scope="col">Linear</th><th scope="col">Binary</th></tr></thead>
      <tbody>{[100, 1000, 10000, 100000, 1000000].map(n => <tr key={n}><th scope="row">{n.toLocaleString("en-GB")}</th><td>{n.toLocaleString("en-GB")}</td><td>{worstCaseEvaluations(n)}</td></tr>)}</tbody>
    </table>
    <p>Preparing cumulative totals costs O(n). Repeated queries can share that preparation; a single query may be better served by a scan.</p>
  </article>;
}
