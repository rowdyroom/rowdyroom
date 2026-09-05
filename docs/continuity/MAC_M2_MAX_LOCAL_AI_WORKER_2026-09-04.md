# Mac M2 Max Local AI Worker — 2026-09-04

## Result

- Public branch: `codex/mac-m2-max-worker-2026-09-04`.
- Review: draft PR #32.

Roger's Apple M2 Max laptop is technically commissioned as a private local model worker for Rowdy AI Command Center.

- Hardware verified live: Apple M2 Max, 12 CPU cores, 38 GPU cores, 96 GB unified memory, Metal 4, and healthy internal storage.
- Runtime: isolated Python 3.13, MLX 0.32.2, and MLX-VLM 0.6.17.
- Model: `mlx-community/Qwen3.5-122B-A10B-4bit`.
- Pinned revision: `e9c67b08899964be5fdd069bb1b4bc8907fe68f5`.
- API: authenticated OpenAI-compatible local endpoint.
- Startup: macOS LaunchAgent `local.rowdy.mac-worker`, restart-tested.
- RACC state: `registered-standby`, configured, reachable, and ready.
- Existing owner-selected Psyche-only lineup was not changed.

Private addresses, usernames, device identifiers, account details, and credentials are excluded from this record.

## Verification

- On-device pinned-model exact response: pass.
- Windows adapter exact response: pass.
- Live RACC endpoint exact response: pass.
- LaunchAgent process replacement, model reload, and ready-state recovery: pass.
- API key absent from process arguments: pass.
- One-main-request concurrency enforcement: pass.
- Worker-specific automated tests: 5/5 pass.
- Cold short commissioning probe: about 6.8 seconds to first token and about 43–48 decoded tokens per second.
- Warm Windows-to-Mac short probe: 1.8 seconds total.
- Post-restart Windows-to-Mac short probe: 6.1 seconds total.

The broader local RACC suite completed 173/179. Six pre-existing Dave installer and stale Control Center layout assertions failed outside this worker change.

## Protected authority

Supabase project `Final`:

- Equipment key: `apple-m2-max-macbook-pro-ai-worker`, version 1, SHA-256 `b18f85a9af52f2b16807b242e9425711ca42cc0684f88d8f47ea0d9ac7725c23`.
- Continuity key: `mac-m2-max-local-ai-worker-2026-09-04`, version 1, SHA-256 `70b8c38e7c34fa844599a686d369a4d4a094217452449e8a70866235c2958d20`.
- Equipment history count: 1.
- Continuity history count: 1.
- Continuity check: `mac-m2-max-worker-commissioning-2026-09-04`, pass.

## Recovery

- Protected local recovery archive: `MacWorker_20260904-2125.zip`.
- SHA-256: `94B8198A4A838437298A81D96E9E7916B2D836C0AC9C8B179CBFF80348D5D186`.
- The archive contains public-safe configuration, service scripts, adapter code, verification output, and commissioning evidence. It contains no password, API key, serial number, username, or private network address.

## Remaining gates

- Physical owner acceptance under one real Rowdy workload: pending.
- Closed-lid availability: Recovery required.
- Sustained thermal behavior under a representative workload: Recovery required.
- Router DHCP reservation for the current private LAN address: Recovery required.
- Team activation: requires Roger to explicitly change the current owner-selected lineup.

Next safe action: Roger should use the registered worker for one real Rowdy task and decide whether its response quality and latency are acceptable before activating it in a Robot lineup.
