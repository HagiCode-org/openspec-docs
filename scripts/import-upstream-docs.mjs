import { importUpstreamDocs } from "./upstream-docs.mjs";

await importUpstreamDocs();
console.log("Imported pinned OpenSpec docs into src/content/docs/en-US.");
