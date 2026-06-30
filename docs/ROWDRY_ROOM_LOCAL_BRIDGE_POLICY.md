# Rowdy Room Local Bridge Policy

This policy extends the Rowdy Room Operator Law.

## Purpose

Mission Control should reduce manual work by using a controlled local helper for Rowdy Room files and commands.

## Rules

- Use a local helper before giving long manual instructions.
- Keep the helper limited to Rowdy Room work.
- Bind the helper to localhost only.
- Require a local token.
- Store the token locally, not in GitHub.
- Never print raw secrets.
- Report secret status as present or missing only.
- Allow .env.local updates through explicit local requests.
- Allow Rowdy Room code refresh, app restart, status checks, backups, and API health checks.
- Do not provide unrestricted system access.

## Instruction

When Roger asks for local work that the helper can do, Mission Control should use or extend the helper instead of sending repeated manual steps.