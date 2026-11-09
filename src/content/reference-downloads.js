const base = "/references/chatgpt-ads/v1/";
const official = {
  title: "OpenAI Ads OpenAPI specification", href: "https://developers.openai.com/ads/openapi.json",
  origin: "OpenAI · official · external", description: "OpenAI’s file listing the requests its advertiser API accepts and the data it returns. OpenAPI is the format used to describe those rules.",
};
const readme = { title: "Agent reference notes", href: `${base}README.md`, origin: "Harness · reference · v1.0.0", description: "See where the files came from, how they fit together and how to use them with a coding agent." };
const capabilities = { title: "Advertiser API map · JSON", href: `${base}capabilities.json`, origin: "Harness · guide · v1.0.0", description: "The map on this page in JSON, a text format software can read. It includes links to OpenAI’s documentation." };
export const referenceDownloads = {
  capabilities: [official, capabilities, readme],
  architecture: [
    { title: "Example ad system rules · JSON Schema", href: `${base}architecture-contracts.schema.json`, origin: "Harness · example model · v1.0.0", description: "Rules for the data in our example ad system. JSON Schema is a format for describing those rules. The tools, data fields and scoring examples are Harness design choices." },
    { title: "Example ad selection records · JSON", href: `${base}architecture-examples.json`, origin: "Harness · made-up data · v1.0.0", description: "Made-up records show what could happen when ads are matched, auctioned, blocked or sent too late. Each record follows our example rules." },
    readme,
  ],
  reporting: [official,
    { title: "Example reporting request and result · JSON", href: `${base}reporting-examples.json`, origin: "Harness · worked example · v1.0.0", description: "See which fields go into a request to OpenAI and how your own software could record results and missing data. The sample values are made up." }, readme,
  ],
};
