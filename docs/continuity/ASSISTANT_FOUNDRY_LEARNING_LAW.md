# Assistant Foundry Learning and Creation Law

**Status:** Active standing law for Assistant Foundry work  
**Last updated:** 2026-07-23  
**Owner:** Roger Jamsek

## Purpose

Assistant Foundry must learn from its real work. Material work done through the Foundry, its assistants, or any connected AI surface must leave a usable record so Roger can improve future builds instead of recreating decisions, prompts, failures, and proven workflows from memory.

This law covers the future Main Assistant, Jessica, Gwen, the Assistant Workspace, Guided Builder, ChatGPT, Codex, OpenAI services, and any later local runtime or connector.

## The rule

1. Capture every material build event: a decision, approved fact, personality or rule change, prompt or workflow, tool/permission change, test, useful output, failure, correction, rejected option, or portability finding.
2. Tag each event with the source surface, affected assistant/build, event type, outcome, evidence or source, status, date, and its effect on the portable package.
3. Keep temporary exploration as a draft ledger entry. Promote an item into a durable, versioned record only when it becomes an approved decision, a reusable asset, a confirmed fact, or a material change.
4. Record enough evidence for a future build to distinguish what was tried, what worked, what failed, and why.

## Source-surface boundary

The law requires reliable capture; it does **not** pretend that every platform is automatically visible.

- Work performed inside an integrated Assistant Foundry surface should create a learning-ledger event automatically.
- Work done in ChatGPT, Codex, OpenAI Platform, a local app, or another external surface that is not integrated must be brought in through **Capture to Foundry**, paste/import, approved export, or a connected adapter.
- The system must never claim that it imported a complete external conversation or account history unless it actually did and recorded evidence.
- It must not silently scrape private account content, credentials, or personal history. Capture only what Roger chooses or what an authorized integration can safely record.

## Minimum event shape

| Field | Requirement |
|---|---|
| Date and source surface | Required |
| Assistant or build | Required |
| Event type | Decision, prompt/workflow, test, output, failure, correction, context, permission, or other |
| Summary and outcome | Required |
| Evidence/source link or note | Required when available |
| Status | Draft, approved, rejected, superseded, or recovery required |
| Portable-package effect | None, candidate, approved change, or needs review |
| Privacy class | Public-safe, private, or do not persist |

## Approval, privacy, and retention

- Discussion and brainstorming remain draft by default.
- Only an explicit approval can make a personal fact, identity trait, permission, memory, or permanent assistant-package change durable.
- Never place secrets, credentials, raw private conversations, or unapproved personal material in a public-safe record.
- Retain rejected options and failures when they prevent repeat mistakes, but summarize them proportionally instead of storing unnecessary raw transcripts.

## Implementation requirements

1. The Assistant Workspace and Guided Builder must show a clear **Capture to Foundry** action and a readable Learning Ledger.
2. The Guided Builder must capture its build decisions locally during the prototype phase and later write approved items to a portable, versioned system of record.
3. Every future ChatGPT, Codex, OpenAI, or local-runtime adapter must expose a safe capture/import path before it may claim Foundry learning continuity.
4. Assistant packages must be portable; no learning record may be treated as authoritative only because it exists in one chat, one provider, or one device.
5. Tests must compare the current build, prior approved build, and a no-skill/no-package baseline when that comparison is useful.

## Current implementation truth

- The first Guided Builder prototype includes a Learning Ledger and a **Capture outside work** entry point.
- Prototype ledger entries are stored in the current browser only until an approved persistent ledger is implemented; they are not yet a shared database or a complete platform-history import.
- The public-safe design is recorded in `docs/continuity/PORTABLE_ASSISTANT_FOUNDATION.md`.
- Protected continuity records and dated recovery packages remain the authoritative process for material Assistant Foundry changes.

## Recovery required

A connected, user-approved record sync for ChatGPT/Codex/OpenAI activity and a local-runtime record sync do not yet exist. Until they do, external work must be captured manually or through a later approved adapter.