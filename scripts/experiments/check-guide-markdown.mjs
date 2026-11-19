// Local only. Run after pnpm build. Pass the npm prefix holding the experiment dependencies.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { satteri } from "@astrojs/markdown-satteri";
import { JSDOM } from "jsdom";

const prefix = process.argv[2];
if (!prefix) throw new Error("Pass the npm prefix holding turndown and turndown-plugin-gfm.");
const require = createRequire(resolve(prefix, "package.json"));
const Turndown = require("turndown");
const { gfm } = require("turndown-plugin-gfm");
const converter = new Turndown({ headingStyle: "atx", codeBlockStyle: "fenced" });
converter.use(gfm);
const parser = await satteri({ features: { smartPunctuation: false } }).createRenderer({ syntaxHighlight: false });

const htmlType = "text/html; charset=utf-8";
const markdownType = "text/markdown; charset=utf-8";
const paths = ["/learn/measurement-ml/attribution-and-lift", "/learn/system-design/chatgpt-ads"];
const draftPath = "/learn/system-design/chatgpt-ads-reporting";
const readPage = (path) => readFile(`dist${path}/index.html`, "utf8");
const parse = (html, url) => new JSDOM(html, { url }).window.document;
const normalize = (text) => text.replace(/\s+/g, " ").trim();
const sizes = (body) => ({ bytes: Buffer.byteLength(body), gzipBytes: gzipSync(body).length });

function readingContent(document) {
  const article = document.querySelector("article.lesson-article");
  assert.ok(article);
  for (const extra of article.querySelectorAll("script, style, template, svg, nav, .lesson-mobile-contents")) extra.remove();
  for (const a of article.querySelectorAll("a[href]")) a.href = a.href;
  return article;
}

function signals(article) {
  return {
    headings: [...article.querySelectorAll("h1,h2,h3,h4")].map((element) => normalize(element.textContent)),
    links: [...new Set([...article.querySelectorAll("a[href]")].map((element) => element.href))].sort(),
    tables: [...article.querySelectorAll("table")].map((table) =>
      [...table.rows].map((row) => [...row.cells].map((cell) => normalize(cell.textContent)))),
    code: [...article.querySelectorAll("pre > code")].map((element) => element.textContent.trim()),
  };
}

const html = new Map(await Promise.all([...paths, draftPath].map(async (path) => [path, await readPage(path)])));
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const candidates = new Map();
for (const path of paths) {
  const document = parse(html.get(path));
  const canonical = document.querySelector('link[rel="canonical"]').href;
  assert.equal(document.querySelector('meta[name="robots"]').content, "index, follow");
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
  const track = parse(await readPage(path.slice(0, path.lastIndexOf("/"))));
  assert.ok(track.querySelector(`a[href="${path}"]`), `Track page should link to ${path}`);

  const article = readingContent(parse(html.get(path), canonical));
  const expected = signals(article);
  const articleHtml = sizes(article.outerHTML);
  const stageTitles = [...article.querySelectorAll(".ads-stage-copy h3")].map((element) => normalize(element.textContent));
  const details = [...article.querySelectorAll(".orchestrator-views summary")].map((element) => normalize(element.textContent));

  for (const summary of article.querySelectorAll("summary")) {
    const title = document.createElement("strong");
    title.textContent = normalize(summary.textContent);
    summary.replaceWith(title);
  }
  const markdown = `Canonical HTML: <${canonical}>\n\n${converter.turndown(article)}\n`;
  const rendered = parse((await parser.render(markdown)).code, canonical).body;
  // The preamble adds a link. All page-body signals must survive conversion.
  rendered.querySelector("p").remove();
  assert.deepEqual(signals(rendered), expected);
  for (const label of [...stageTitles, ...details]) assert.ok(normalize(rendered.textContent).includes(label), label);

  candidates.set(path, {
    canonical,
    markdown,
    metrics: {
      fullHtml: sizes(html.get(path)),
      articleHtml,
      markdown: sizes(markdown),
      headings: expected.headings.length,
      uniqueLinks: expected.links.length,
      tables: expected.tables.length,
      codeBlocks: expected.code.length,
      walkthroughStages: stageTitles.length,
      orchestratorDetails: details.length,
    },
  });
}
assert.equal(parse(html.get(draftPath)).querySelector('meta[name="robots"]').content, "noindex, follow");
assert.ok(!sitemap.includes(draftPath));

// Neither pilot guide contains a fenced code sample. Check the converter with
// a standalone fixture so code handling is measured separately.
const sampleCode = 'const note = "keep the indentation";\n  record(note);';
const codeHtml = `<pre><code class="language-js">${sampleCode}
</code></pre>`;
assert.deepEqual(signals(parse((await parser.render(converter.turndown(codeHtml))).code).body).code, [sampleCode]);

// Exercise both delivery models over HTTP with the same bytes and canonical URLs.
let mode = "html";
const server = createServer((request, response) => {
  const path = new URL(request.url, "http://localhost").pathname;
  const linked = path.endsWith(".md");
  const guide = candidates.get(linked ? path.slice(0, -3) : path);
  const negotiate = mode === "negotiated" && guide && !linked;
  if (negotiate) response.setHeader("Vary", "Accept");

  if (guide && ((mode === "linked" && linked) || (negotiate && request.headers.accept === "text/markdown"))) {
    response.setHeader("Content-Type", markdownType);
    response.setHeader("Link", `<${guide.canonical}>; rel="canonical"`);
    response.end(guide.markdown);
    return;
  }

  if (html.has(path)) {
    response.setHeader("Content-Type", htmlType);
    const body = html.get(path);
    if (mode === "linked" && guide) {
      response.setHeader("Link", `<${path}.md>; rel="alternate"; type="text/markdown"`);
      response.end(body.replace("</head>", `<link rel="alternate" type="text/markdown" href="${path}.md"></head>`));
      return;
    }
    response.end(body);
    return;
  }

  response.writeHead(404).end();
});

await new Promise((done, fail) => server.once("error", fail).listen(0, "127.0.0.1", done));
const origin = `http://127.0.0.1:${server.address().port}`;
const fetchPage = (path, accept = "*/*") => fetch(origin + path, { headers: { Accept: accept } });
try {
  for (const scenario of ["html", "linked", "negotiated"]) {
    mode = scenario;
    for (const [path, guide] of candidates) {
      const htmlResponse = await fetchPage(path);
      assert.equal(htmlResponse.headers.get("Content-Type"), htmlType);
      const body = await htmlResponse.text();
      if (scenario === "linked") {
        const [, alternate] = /^<([^>]+)>; rel="alternate"; type="text\/markdown"$/.exec(htmlResponse.headers.get("Link"));
        assert.equal(parse(body).querySelector('link[rel="alternate"][type="text/markdown"]').getAttribute("href"), alternate);
        const response = await fetchPage(alternate);
        assert.equal(response.headers.get("Content-Type"), markdownType);
        assert.equal(response.headers.get("Link"), `<${guide.canonical}>; rel="canonical"`);
        assert.equal(await response.text(), guide.markdown);
      } else {
        assert.equal(htmlResponse.headers.get("Link"), null);
        assert.equal(parse(body).querySelector('link[rel="alternate"][type="text/markdown"]'), null);
        const response = await fetchPage(path, "text/markdown");
        assert.equal(response.headers.get("Content-Type"), scenario === "html" ? htmlType : markdownType);
        assert.equal(await response.text(), scenario === "html" ? html.get(path) : guide.markdown);
        if (scenario === "negotiated") {
          assert.equal(htmlResponse.headers.get("Vary"), "Accept");
          assert.equal(response.headers.get("Vary"), "Accept");
          assert.equal(response.headers.get("Link"), `<${guide.canonical}>; rel="canonical"`);
        }
      }
    }
    assert.equal((await fetchPage(draftPath + ".md")).status, 404);
    const draft = await fetchPage(draftPath, "text/markdown");
    assert.equal(draft.headers.get("Content-Type"), htmlType);
    assert.equal(draft.headers.get("Link"), null);
    assert.equal(parse(await draft.text()).querySelector('link[rel="alternate"][type="text/markdown"]'), null);
  }
} finally {
  await new Promise((done, fail) => server.close((error) => error ? fail(error) : done()));
}

console.log(JSON.stringify(Object.fromEntries([...candidates].map(([path, guide]) => [path, guide.metrics])), null, 2));
