# Local Secrets

Do not commit real API keys or service keys to this repository.

Use this pattern instead:

1. Copy `.env.example` to a local file named `.env`.
2. Put real keys only in `.env` on your computer.
3. Keep `.env` ignored by git.
4. Rotate any key that was pasted into chat, screenshots, tickets, or uploaded files.

## Required local variables

```text
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
XAI_API_KEY=
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OLLAMA_BASE_URL=http://127.0.0.1:11434
```

## Rule

The Engine code reads keys from environment variables. The repository stores only variable names and code, never the secret values.
