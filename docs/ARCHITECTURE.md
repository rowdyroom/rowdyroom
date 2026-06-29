# Rowdy Room Enterprise Engine Architecture

## Goal

Build a modular AI operating system that coordinates agents, connectors, memory, voice, and workflows for Rowdy Room.

## Core principles

1. The Executive AI plans and delegates. It does not hardcode app-specific behavior.
2. Connectors expose capabilities through a shared SDK.
3. All connector actions go through the Action Bus.
4. All system activity is observable through the Event Bus.
5. Sensitive actions require approvals and audit logs.
6. Credentials are never stored in source control.
7. Providers are replaceable: OpenAI, Anthropic, xAI, Gemini, Ollama, and future APIs.

## Major systems

- `packages/connector-sdk`: connector contracts, action bus, event bus, registry, health checks, permissions.
- `packages/ai-router`: model-provider routing and provider abstraction.
- `packages/agent-framework`: Executive AI and specialist agent contracts.
- `packages/memory`: Supabase-backed memory interfaces.
- `apps/dashboard`: Mission Control UI.
- `connectors`: app/service integrations.
- `agents`: specialized agent definitions.

## Connector categories

- Streaming: TikTok Live Studio, OBS, Discord, Voicemod, Stream Deck.
- Content: Canva, CapCut, Dropbox, Google Drive, iCloud Drive.
- Development: Supabase, GitHub, local file system, Docker.
- Business: Gmail, iCloud Mail, Calendar, Stripe, PayPal, Square.
- Smart Home: Google Home, Google Nest, Apple Home, HomePod mini.
- AI Providers: OpenAI, Anthropic, xAI, Gemini, Ollama.
