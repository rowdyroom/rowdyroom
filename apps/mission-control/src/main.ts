import { ConnectorManager } from "../../../packages/connector-sdk/src/index.js";
import { ExecutiveAgent } from "../../../packages/agent-framework/src/index.js";

const manager = new ConnectorManager();
const executive = new ExecutiveAgent();

console.log("Rowdy Room Mission Control started.");
console.log("Connector count:", manager.listConnectors().length);
console.log("Agent:", executive.name);
