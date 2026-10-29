# Normal ChatGPT cloud connector recovery — 2026-10-29

This record supersedes the unresolved normal-Vivaldi cloud-handoff warning in the earlier booking-simulation record. Current protected authority: `psyche/booking-mission-2026-10-29`. Workflow defaults are v5.

## Cause reproduced
The offline simulator inherited the persistent MCP input pipe on Windows. It failed to respond while that input stayed open, then completed when the input closed. Earlier EOF-based local tests closed the connection automatically and concealed this live-session failure. The traced normal ChatGPT simulator call reached the server, then raised TimeoutExpired after approximately thirty seconds.

A separate observation was that Codex-side app-tool calls timed out before reaching the same local server, while normal ChatGPT in Vivaldi successfully delivered a status call. Those consumer routes must not be conflated. The repaired route verified here is normal ChatGPT in Vivaldi.

## Fixes
- Detach the simulator's unused stdin with DEVNULL, close unrelated inherited handles and set explicit UTF-8 decoding.
- Add a regression that keeps MCP input open through the full simulation, then confirms a subsequent ping on that same connection.
- Return explicit JSON-RPC errors for unexpected exceptions instead of silently dropping the request. Invalid non-object requests no longer terminate subsequent request handling.
- Record request timing, method, process and exception type as local metadata without logging prompts, outputs, credentials or customer content.
- Reload now waits for the new process's local readiness and main channel. It explicitly leaves cloud verification pending until a real consumer call succeeds.
- Preserve the existing outreach hold and the isolated fake mail/calendar boundary.

## Real cloud acceptance
Normal ChatGPT in the existing Vivaldi conversation made three sequential simulator calls, each with a unique run directory/report, and a fourth successful call after a connector-only cold restart. No local fallback was used for these four acceptance calls.

Every run returned:
- simulationOnly=true
- 55 scenarios passed, zero failed
- eight simulated sends and one fake calendar booking
- zero real mail/calendar calls
- productionDataUnchanged=true

The real outbox was checked before/after and remained five local drafts, zero sends, zero human replies. Production contact/outbox file hashes also matched across the entire recovery task. Existing recurring bookings were not written or modified.

Backend simulator durations observed in server metadata were approximately 0.687, 0.657, 0.688 and 0.844 seconds. These exclude model, UI and queue time. The three-run ChatGPT turn displayed 36 seconds; the cold-start/report turn displayed 49 seconds.

## Verification and limits
Fifty-seven automated test methods passed, including the persistent-connection regression, failure replies, malformed-request recovery and the existing 55-scenario simulation suite. These counts overlap.

Four successful cloud simulations demonstrate the fixed workflow under tested conditions; they are not a guarantee of permanent uptime, real Gmail deliverability or real Calendar writes. Actual outreach, external drafts and bookings remain held and untested. The separate Codex-side tool-gateway route was not accepted as repaired.

The connector binary and its existing credentials were retained. Diagnosis used the official [Secure MCP Tunnel documentation](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels), existing local readiness/metrics, request metadata and actual normal-chat calls.

## Recovery
The protected dated recovery package contains pre-change files/profile, activated source/configuration, regression tests, metadata trace, all four isolated run databases/receipts, visible normal-chat proof and final cloud-generated report. Manifest SHA256: `436741498f63cba90f8edb0f50a328394d5d0858f8a642fbe95ff6e75194a23c`, covering 34 listed files. Private authority contains its path and implementation hashes.

Next safe action: continue using the normal Vivaldi ChatGPT route for authorized research/local drafts, honoring the outreach hold. On a future failure, use request-level evidence and bounded retries rather than treating process readiness as end-to-end proof.
