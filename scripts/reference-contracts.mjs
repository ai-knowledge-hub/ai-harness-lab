import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const directory = new URL("../public/references/chatgpt-ads/v1/", import.meta.url);
export async function loadReferenceContracts() {
  const [schema, examples] = await Promise.all(
    ["architecture-contracts.schema.json", "architecture-examples.json"].map(async (name) => JSON.parse(await readFile(new URL(name, directory), "utf8"))),
  );
  const ajv = new Ajv2020({ allErrors: true, strictTypes: false });
  addFormats(ajv);
  return { validate: ajv.compile(schema), examples };
}
export async function checkReferenceContracts() {
  const { validate, examples } = await loadReferenceContracts();
  if (!examples.length) throw new Error("Reference examples are missing");
  examples.forEach((example, index) => {
    if (!validate(example)) throw new Error(`Invalid architecture example ${index}: ${JSON.stringify(validate.errors)}`);
  });
  return examples.length;
}
