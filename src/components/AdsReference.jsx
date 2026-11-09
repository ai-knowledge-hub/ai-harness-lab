import capabilities from "../../public/references/chatgpt-ads/v1/capabilities.json";
import { referenceDownloads } from "../content/reference-downloads";

export function AdsCapabilities() {
  return <div className="ads-capabilities">
    <p className="reference-provenance">OpenAI advertiser APIs · Guide by Harness · Reviewed {capabilities.reviewed_at}</p>
    <p className="reference-small">The arrows show where data goes. This map is based on OpenAI’s documentation. Live account checks are planned.</p>
    {capabilities.capabilities.map((item, index) => <section className="capability-entry" key={item.id} aria-labelledby={`capability-${item.id}`}>
      <p className="eyebrow">0{index + 1} · Advertiser task</p>
      <h3 id={`capability-${item.id}`}>{item.title}</h3>
      <p className="capability-direction">{item.direction}</p>
      <p>{item.system_connection}</p>
      <dl className="reference-definitions">
        <dt>API to use</dt><dd><ul>{item.operations.map((op) => <li key={op}><code>{op}</code></li>)}</ul></dd>
        <dt>Data available</dt><dd>{item.data}</dd>
        <dt>What to watch for</dt><dd>{item.boundary}</dd>
        <dt>Access</dt><dd>{item.access}</dd>
      </dl>
      <p><a className="source-citation" href={item.source_url}>{item.source_title}</a>{item.detail_url && <> · <a className="source-citation" href={item.detail_url}>More API details</a></>}</p>
    </section>)}
  </div>;
}

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
