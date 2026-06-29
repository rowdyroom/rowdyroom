import { AiRouter } from "./router.js";
import type { ModelRequest, ModelResponse } from "./provider-client.js";
import type { RouteRequest, RouterPolicy } from "./types.js";
import { ProviderRegistry } from "./provider-registry.js";

export class RoutedCompletionService {
  constructor(
    private readonly router: AiRouter,
    private readonly providers: ProviderRegistry
  ) {}

  async complete(routeRequest: RouteRequest, modelRequest: ModelRequest): Promise<ModelResponse> {
    const route = this.router.route(routeRequest);
    const provider = this.providers.require(route.provider);

    return provider.complete({
      ...modelRequest,
      model: modelRequest.model ?? route.model,
      metadata: {
        ...modelRequest.metadata,
        routeReason: route.reason,
      },
    });
  }
}

export function createRoutedCompletionService(policy: RouterPolicy, providers: ProviderRegistry): RoutedCompletionService {
  return new RoutedCompletionService(new AiRouter(policy), providers);
}
