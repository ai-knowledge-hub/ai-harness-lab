# Harness ChatGPT Ads references · v1.0.0

Harness · AI Knowledge Hub reviewed these files on 8 November 2026. The sample data is made up. Live account checks and tools for collecting reports are planned.

## Find the file you need

- OpenAI’s [official OpenAPI file](https://developers.openai.com/ads/openapi.json) describes which requests its advertiser API accepts and what it sends back. Check OpenAI’s documentation for the features your account can use.
- `capabilities.json` is the Harness map of tools for setting up ads, sending records of conversions and getting reports.
- `reporting-examples.json` shows the fields in a request to OpenAI, how to ask for the next batch and how your software might record results and missing data. Harness made up the example values.
- `architecture-contracts.schema.json` describes the rules for data in our example ad system. It uses the Draft 2020-12 version of JSON Schema, a format for describing which fields and values are allowed. Harness adapted a model supplied by a reader and checked the roles of its parts against [OpenAI’s engineering account](https://openai.com/index/building-chatgpt-ad-stack/).
- `architecture-examples.json` contains made-up ad selection records. The site build checks that each record follows the rules in the example schema.

## Use the examples with software or a coding agent

Use OpenAI’s documentation for requests to the real API. Keep the Harness ad selection records in simulations and tests. Names such as `prepare_queries` and `embed`, the fields for possible ads, the example scores and timing rules are choices we made for this model. The sample bid and price are made up. The three numbers in each example embedding show how software can represent meaning using numbers.

Our final check records whether the ad fits the conversation. A separate record says whether it was shown or arrived too late. In this example, `arrival_delta_ms > 0` means the ad arrived late. The files cover these selected steps so you can see how they fit together.

To check the example records in this repository, run `node scripts/check-reference-contracts.mjs`. If you use a separate validator, choose one that supports JSON Schema Draft 2020-12 and the UUID and URI formats for identifiers and links. Use made-up data when adding examples. Check account permissions and metric definitions before connecting a live account.
