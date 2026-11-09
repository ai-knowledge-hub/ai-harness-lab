import { reportingExamples } from "../content/ads-reporting-examples";

function RefreshComparison({ rows }) {
  return (
    <table className="report-example-comparison">
      <caption>Same reporting dates, two collection times</caption>
      <thead>
        <tr>
          <th scope="col">Metric</th>
          <th scope="col">3 Nov, 09:00</th>
          <th scope="col">5 Nov, 09:00</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([metric, earlier, later]) => (
          <tr key={metric}>
            <th scope="row">{metric}</th>
            <td>{earlier}</td>
            <td>{later}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AdsReportingReference({ id }) {
  return (
    <div className="report-reference">
      <p className="reference-provenance">Prepared examples · Fictional data</p>
      <h3>The request in each example</h3>
      <p>
        Get daily impressions, clicks, spend and credited conversions for campaigns
        in a fictional UK ad account on 1 and 2 November 2026.
      </p>
      <dl className="reference-definitions">
        <dt>Time zone and currency</dt>
        <dd>London time, GBP</dd>
        <dt>Conversion credit</dt>
        <dd>30 days after a click or one day after a view. Results use the date of the ad interaction.</dd>
      </dl>
      <p className="reference-small">Open an example to see what came back and what you can do with it.</p>
      <div className="report-example-list">
        {reportingExamples.map((example) => (
          <details key={example.id} name={id}>
            <summary>
              <strong>{example.title}</strong>
              <span>{example.signal}</span>
            </summary>
            <div className="report-example-body">
              <h4>What came back</h4>
              <p>{example.result}</p>
              {example.facts && (
                <dl className="report-example-facts">
                  {example.facts.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {example.comparison && <RefreshComparison rows={example.comparison} />}
              <p>{example.meaning}</p>
              <h4>What to do next</h4>
              <p>{example.action}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
