import type { ReactNode } from "react";
import type { GuideBlock } from "../content/guide-types";
import { ChatGPTAdsArchitecture } from "./ChatGPTAdsArchitecture";
import { AdsCapabilities, ReferenceDownloads } from "./AdsReference";
import { AdsOrchestrator } from "./AdsOrchestrator";
import { AdsReportingReference } from "./AdsReportingReference";

import { SiteLink } from "./SiteLink";

export function LessonBlock({ block, blockId, architecture }: {
  block: GuideBlock;
  blockId: string;
  architecture?: ReactNode;
}) {
  if (block.type === "ads-capabilities") return <AdsCapabilities />;
  if (block.type === "ads-orchestrator") return <AdsOrchestrator />;
  if (block.type === "ads-reporting-reference") return <AdsReportingReference id={blockId} />;
  if (block.type === "reference-downloads") return <ReferenceDownloads collection={block.collection} />;
  if (block.type === "ads-architecture") return architecture ?? <ChatGPTAdsArchitecture id={blockId} GuideLink={SiteLink} />;
  if (block.type === "paragraph")
    return (
      <p>
        {block.text}
        {block.source && (
          <>{" "}<a className="source-citation" href={block.source.href}>{block.source.title}</a></>
        )}
      </p>
    );
  if (block.type === "list")
    return (
      <ul className="lesson-list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  if (block.type === "callout")
    return (
      <aside className="lesson-note">
        <h3>{block.title}</h3>
        <p>{block.text}</p>
      </aside>
    );
  if (block.type === "code")
    return (
      <figure className="lesson-code">
        <figcaption>
          {block.label}
          <span>{block.language}</span>
        </figcaption>
        <pre tabIndex={0} aria-label={block.label}>
          <code>{block.code}</code>
        </pre>
      </figure>
    );
  if (block.type === "flow")
    return (
      <figure className="lesson-flow">
        <figcaption>{block.label}</figcaption>
        <ol>
          {block.steps.map((step, index) => (
            <li key={step}>
              <span className="track-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </figure>
    );
  if (block.type === "table")
    return (
      <div
        className={`lesson-table-wrap${block.columns.length > 2 ? " lesson-table-wide" : ""}`}
        tabIndex={block.columns.length > 2 ? 0 : undefined}
        role={block.columns.length > 2 ? "region" : undefined}
        aria-label={block.columns.length > 2 ? "Scrollable comparison table" : undefined}
      >
        {block.columns.length > 2 && <p className="table-scroll-hint">Scroll across to compare all columns →</p>}
        <table className="lesson-table">
          <thead>
            <tr>
              {block.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th key={cellIndex} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={cellIndex}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  block satisfies never;
  return null;
}
