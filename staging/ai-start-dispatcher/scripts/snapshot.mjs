import { resolve } from "node:path";
import { DispatcherStore } from "../lib/dispatcher-store.mjs";

const dataDir = resolve(process.argv[2] || "data");
const snapshotPath = resolve(
  process.argv[3] || `recovery/ai-start-${new Date().toISOString().replaceAll(":", "-")}.json`,
);
const store = new DispatcherStore({ dataDir });
const result = store.createRecoverySnapshot(snapshotPath);
console.log(JSON.stringify(result, null, 2));
