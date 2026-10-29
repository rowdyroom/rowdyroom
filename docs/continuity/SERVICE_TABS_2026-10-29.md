# One service tab per consultant — 2026-10-29

Psyche Packet Bridge 0.6.28 is active. The previous Claude/Grok job runner opened a fresh tab for every assignment and left it open. The replacement persists a service/workspace binding, adopts an existing tab, and creates one only when absent. Concurrent first calls share a creation lock.

Existing drafts, active generation, host mismatches and ambiguous editors fail closed. Completed conversation turns can be reused; each answer must follow the exact current task marker. The runner briefly focuses the provider during entry and restores the previous active tab. Gemini retains its existing pane. This controls Psyche automation, not arbitrary manual tabs or unrelated extensions.

Twenty-four redundant tabs were closed. Final inventory has exactly one tab each for Claude, Grok, Gemini, Suno and Google Flow. The existing main ChatGPT / Control Center / Gemini tile set and unfinished work-profile pages were retained. No provider chat histories were deleted. Category metadata was created for Work & bookings, Shopping, AI services and Social & search; native Vivaldi presentation of those groups is not independently verified.

Verification: 36 JavaScript checks passed. Two consecutive Claude requests and two consecutive Grok requests completed with exact expected replies in their retained tabs, using bridge 0.6.28, without increasing provider-tab counts. Recovery includes the previous extension source, before/after tab URL inventories and live receipts in protected local storage.

Protected authority: `psyche/service-tabs-2026-10-29`.
Next browser actions must reuse the existing service tab. Bring any unavoidable account prompt forward one at a time rather than asking Roger to hunt through the browser.
