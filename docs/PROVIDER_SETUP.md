# Provider Setup

The local Rowdy Room Engine can use several AI providers at the same time.

## Local environment

Create a local environment file from the provided example and add only the keys you want to use.

Required variables by provider:

- OpenAI ChatGPT: `OPENAI_API_KEY`
- Anthropic Claude: `ANTHROPIC_API_KEY`
- xAI Grok: `XAI_API_KEY`
- Google Gemini: `GEMINI_API_KEY`
- Ollama Local: no cloud key required

Do not commit local environment files or real API keys.

## Default routing plan

- Planning: OpenAI ChatGPT
- Coding: Anthropic Claude
- Review: Anthropic Claude
- Research: Google Gemini
- Stream host: xAI Grok
- Voice: xAI Grok
- Sensitive local tasks: Ollama

The Executive AI should call the router instead of hardcoding provider choices.
