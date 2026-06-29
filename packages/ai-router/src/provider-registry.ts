import type { ModelProvider, ModelResponse, ModelRequest } from "./provider-client.js";
import type { ModelProviderId } from "./types.js";

export class ProviderRegistry {
  private readonly providers = new Map<ModelProviderId, ModelProvider>();

  register(provider: ModelProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: ModelProviderId): ModelProvider | undefined {
    return this.providers.get(id);
  }

  require(id: ModelProviderId): ModelProvider {
    const provider = this.get(id);
    if (!provider) {
      throw new Error(`Model provider not registered: ${id}`);
    }
    return provider;
  }

  list(): ModelProvider[] {
    return [...this.providers.values()];
  }

  configured(): ModelProvider[] {
    return this.list().filter((provider) => provider.isConfigured());
  }

  async complete(providerId: ModelProviderId, request: ModelRequest): Promise<ModelResponse> {
    return this.require(providerId).complete(request);
  }
}
