import { referenceDownloads } from "../content/reference-downloads";

export function ReferenceDownloads({ collection }) {
  return <div className="reference-downloads">
    <p className="reference-small">Use OpenAI’s documentation for the exact requests your software can send. The Harness downloads use made-up examples to explain how you might model ad selection or collect reports.</p>
    <ul>{referenceDownloads[collection].map((item) => <li key={item.href}>
      <span className="reference-provenance">{item.origin}</span>
      <a href={item.href} download={item.href.startsWith("/") ? true : undefined}>{item.title}<span aria-hidden="true">{"\u00a0"}{item.href.startsWith("/") ? "↓" : "↗"}</span></a>
      <p>{item.description}</p>
    </li>)}</ul>
  </div>;
}
