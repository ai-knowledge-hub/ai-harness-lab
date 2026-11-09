import { checkReferenceContracts } from "./reference-contracts.mjs";
console.log(`Validated ${await checkReferenceContracts()} synthetic architecture events.`);
