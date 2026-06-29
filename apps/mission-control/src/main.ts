import { ConnectorManager } from "../../../packages/connector-sdk/src/index.js";
import { ExecutiveAgent } from "../../../packages/agent-framework/src/index.js";
import { AiRouter, buildDefaultProviderRegistry, defaultRouterPolicy } from "../../../packages/ai-router/src/index.js";

const manager = new ConnectorManager();
const executive = new ExecutiveAgent();
const router = new AiRouter(defaultRouterPolicy);
const providers = buildDefaultProviderRegistry();

const planningRoute = router.route({ task: "planning" });
const codingRoute = router.route({ task: "coding" });
const streamRoute = router.route({ task: "streamHost" });
const researchRoute = router.route({ task: "research" });

console.log("Rowdy Room Mission Control started.");
console.log("Connector count:", manager.listConnectors().length);
console.log("Agent:", executive.name);
console.log("Provider count:", providers.list().length);
console.log("Configured providers:", providers.configured().map((provider) => provider.name).join(", ") || "none");
console.log("Planning route:", planningRoute.provider, planningRoute.model);
console.log("Coding route:", codingRoute.provider, codingRoute.model);
console.log("Stream route:", streamRoute.provider, streamRoute.model);
console.log("Research route:", researchRoute.provider, researchRoute.model);
