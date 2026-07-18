import assert from "node:assert/strict";
import test from "node:test";
import {
  formatPanelCountdown,
  normalizePanelStatus,
  panelSlotLabel,
  validateRumbleResults,
} from "../../lib/panel-contract.js";

test("countdown never becomes negative", () => {
  assert.equal(formatPanelCountdown(1800), "30:00");
  assert.equal(formatPanelCountdown(61), "01:01");
  assert.equal(formatPanelCountdown(-5), "00:00");
});

test("normalizes exactly eight ordered panel slots", () => {
  const state = normalizePanelStatus({
    mode: "rumble_protected",
    slots: [{ panel_slot: 8, singer_name: "Last signup" }, { panel_slot: 1, singer_name: "Winner" }],
  });

  assert.equal(state.slots.length, 8);
  assert.equal(state.slots[0].singer_name, "Winner");
  assert.equal(state.slots[7].singer_name, "Last signup");
  assert.equal(panelSlotLabel(4), "Second Contributor");
  assert.equal(panelSlotLabel(5), "Signup Rotation 1");
});

test("requires four distinct whole-number Rumble results", () => {
  const valid = validateRumbleResults([
    { singer_name: "A", team: "red", game_score: 40 },
    { singer_name: "B", team: "blue", game_score: 30 },
    { singer_name: "C", team: "red", game_score: 20 },
    { singer_name: "D", team: "blue", game_score: 10 },
  ]);
  assert.equal(valid.ok, true);

  const duplicate = validateRumbleResults([
    { singer_name: "A", game_score: 40 },
    { singer_name: "A", game_score: 30 },
    { singer_name: "C", game_score: 20 },
    { singer_name: "D", game_score: 10 },
  ]);
  assert.equal(duplicate.ok, false);

  const short = validateRumbleResults([{ singer_name: "A", game_score: 1 }]);
  assert.equal(short.ok, false);
});

