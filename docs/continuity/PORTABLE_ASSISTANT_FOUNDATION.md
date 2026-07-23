# Portable Assistant Foundation

**Status:** Active architecture decision; implementation remains staged  
**Last updated:** 2026-07-23  
**Owner:** Roger Jamsek

## Decision

Roger is planning to move primary AI work away from ChatGPT and onto his own portable AI PC. Future assistant work must therefore be portable by default.

ChatGPT and Codex remain current working adapters during the transition. They are not the sole home of Jessica, Gwen, or the future main assistant.

## Covered identities

| Identity | Role | Current state |
|---|---|---|
| Main assistant | Roger's general day-to-day assistant, intended to preserve as much practical ChatGPT/Codex-like experience as possible | Design required; not yet named or activated |
| Jessica | Animated visual pet plus a separate behavioral instruction layer | Pet/profile exists; unapproved behavior remains inactive |
| Gwen | Rowdy Room marketing strategist and content-production planner | Draft build; tests created draft artifacts only |

The animated pet, assistant behavior, and runtime are separate layers. Selecting a pet never grants behavior, tools, memory, or permissions.

## Portability law

1. **Own the core.** Each assistant's identity, approved instructions, rules, workflows, evaluation set, approved context, asset references, and change history must live in versioned records Roger controls.
2. **Use adapters, not lock-in.** ChatGPT, Codex, and the future local runtime may each have a small adapter, but no assistant's core behavior may exist only inside one provider's custom-instruction field, account memory, or chat.
3. **Keep roles distinct.** The main assistant coordinates general work; Jessica is a distinct visual/behavioral identity; Gwen stays focused on marketing and content-planning work. Do not merge them into one giant prompt.
4. **Keep permissions explicit.** A local runtime receives only the files, folders, connectors, and actions needed for the task. It may not publish, send, delete, spend money, change live systems, or access new private sources without the applicable authorization.
5. **Cloud is optional escalation.** Local operation is the target for private, repeatable, and routine work. An approved cloud/API model may be used when current web information, a stronger capability, or an authorized external connector is needed. API credits are not the assistant's required foundation.
6. **Preserve the experience honestly.** The local system should aim for the useful experience of ChatGPT/Codex—conversation, files, projects, reusable skills, search when authorized, coding/workspace tools, and approval-gated actions. It must not claim to duplicate provider-owned model behavior, account memory, purchased entitlements, or hosted connectors exactly.
7. **Evaluate before migration.** ChatGPT/Codex may be retired from a workflow only after the local version passes the same realistic evaluation tasks and permission/safety checks.
8. **Do not activate drafts by implication.** This policy does not activate Jessica's draft personality or workflows, Gwen's draft behavior, a local model, or any connector.

## Portable assistant package

Each assistant must eventually have a user-owned package containing:

- profile and role definition
- approved behavior and non-goals
- source priority and verification rules
- permission and stopping rules
- workflows and reusable templates
- examples and evaluation cases
- public-safe change history and protected structured record
- platform adapters for ChatGPT, Codex, and the local runtime

Secrets, raw API keys, private URLs, private customer data, and private local paths do not belong in public records or portable prompt files.

## Platform-only limits

The following are **Recovery required** for a future migration and must not be assumed portable:

- exact exportability of ChatGPT conversation history, account memory, pet UI, connectors, and entitlements
- the local runtime, local model selection, performance, and hardware benchmark after the portable AI PC is built
- exact local folder/drive permission map and connector replacement plan
- which cloud/API fallback, if any, remains approved after the local system passes evaluation

## Transition rule

The portable AI PC is a planned target, not yet a verified runtime. The purchased QUBE 540 and RTX 5060 Ti 16GB must be received, installed, and benchmarked before any claim of local capability or full migration.

Until then, save portable assistant decisions in durable records and test them through current ChatGPT/Codex adapters.
