import { resolve } from "node:path";
import { DispatcherStore } from "../lib/dispatcher-store.mjs";

if (!process.argv[3]) {
  console.error("Usage: node scripts/rollback.mjs DATA_DIR SNAPSHOT_PATH");
  process.exit(2);
}

const dataDir = resolve(process.argv[2]);
const snapshotPath = resolve(process.argv[3]);
const store = new DispatcherStore({ dataDir });
console.log(JSON.stringify(store.restoreRecoverySnapshot(snapshotPath), null, 2));
