export const PANEL_SLOT_COUNT = 8;
export const MAIN_FOUR_SLOTS = 4;

export function formatPanelCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function panelSlotLabel(slot) {
  if (slot === 1) return "Top Live Score";
  if (slot === 2) return "Second Live Score";
  if (slot === 3) return "Top Contributor";
  if (slot === 4) return "Second Contributor";
  return `Signup Rotation ${slot - MAIN_FOUR_SLOTS}`;
}

export function validateRumbleResults(value) {
  if (!Array.isArray(value) || value.length < MAIN_FOUR_SLOTS || value.length > 32) {
    return { ok: false, message: "Enter at least four and no more than 32 Rumble player results." };
  }

  const seen = new Set();
  const results = [];

  for (const item of value) {
    const singerName = typeof item?.singer_name === "string" ? item.singer_name.trim() : "";
    const singerId = typeof item?.singer_id === "string" ? item.singer_id.trim() : "";
    const team = typeof item?.team === "string" ? item.team.trim().slice(0, 40) : "unassigned";
    const gameScore = Number(item?.game_score);
    const identity = (singerId || singerName).toLowerCase().replace(/[^a-z0-9]/g, "");

    if (!singerName || !identity) {
      return { ok: false, message: "Every Rumble player needs a name." };
    }
    if (!Number.isInteger(gameScore) || gameScore < 0 || gameScore > 1_000_000) {
      return { ok: false, message: `Enter a whole-number score for ${singerName}.` };
    }
    if (seen.has(identity)) {
      return { ok: false, message: `${singerName} appears more than once.` };
    }

    seen.add(identity);
    results.push({
      singer_name: singerName.slice(0, 120),
      ...(singerId ? { singer_id: singerId } : {}),
      team: team || "unassigned",
      game_score: gameScore,
    });
  }

  return { ok: true, results };
}

export function normalizePanelStatus(value) {
  const candidate = value && typeof value === "object" ? value : {};
  const slots = Array.isArray(candidate.slots) ? candidate.slots : [];
  const bySlot = new Map(slots.map((slot) => [Number(slot?.panel_slot), slot]));

  return {
    mode: candidate.mode === "rumble_protected" ? "rumble_protected" : "live",
    show_started_at: candidate.show_started_at ?? null,
    regular_cursor_rank: Number(candidate.regular_cursor_rank) || 0,
    regular_cycle: Math.max(1, Number(candidate.regular_cycle) || 1),
    current_rumble_session_id: candidate.current_rumble_session_id ?? null,
    protection_started_at: candidate.protection_started_at ?? null,
    protection_ends_at: candidate.protection_ends_at ?? null,
    protection_seconds_remaining: Math.max(0, Number(candidate.protection_seconds_remaining) || 0),
    state_version: Math.max(0, Number(candidate.state_version) || 0),
    slots: Array.from({ length: PANEL_SLOT_COUNT }, (_, index) => {
      const panelSlot = index + 1;
      return bySlot.get(panelSlot) ?? {
        panel_slot: panelSlot,
        slot_type: panelSlot <= MAIN_FOUR_SLOTS ? "main_open" : "rotation",
        singer_id: null,
        singer_name: null,
        source: panelSlot <= MAIN_FOUR_SLOTS ? "awaiting_qualifier" : "signup_queue",
        locked_until: null,
        game_score: 0,
        signup_rank: null,
        qualifying_value: null,
        qualifying_detail: {},
        assignment_version: 0,
      };
    }),
  };
}

