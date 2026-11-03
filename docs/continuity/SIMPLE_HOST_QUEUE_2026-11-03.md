# Table-first live host queue - November 3, 2026

Status: prepared and locally tested; deployment and live acceptance pending.

Roger retired the Normal/Battle queue distinction and permanent top-two-rated rotation seats. Ordinary singing now follows the table order. Finishing returns a singer to the bottom; a row-menu option can finish and leave the queue instead. Ratings never reserve a turn. Current performers remain fixed during waiting-row reordering; paid skips still protect the person up next.

The new host surface starts with a compact header, TV Mode, voting-timer controls and the searchable table. The old banner, separate Start Next/Rearrange/Absent panels, mode selector and position dropdowns are removed. Actions belong to each table row; waiting singers can be dragged. Existing TV, lyrics, voting, Cash App verification and performance-history paths remain.

Rumble preparation shows the top four credited contributors and top four rated singers for Roger's planned live-show drink-prize format. Roger chose tips plus paid skips. Verified paid skips count from the receipt ledger; the host can record a verified Cash App tip with an unused transaction number. A payment cannot count both as a tip and a skip. Contribution credits for skips follow the requesting singer/signup; host-entered tip credits use the supplied name. These are show credit records, not independently verified personal identities.

Ratings are retained separately from queue order. Repeated named singers are combined across per-song guest IDs using a vote-weighted average. The host can start new show totals without deleting prior votes, payments or performance history. A person appearing in both top-four lists is marked in both; no fifth-place substitute or automatic prize award is invented. Rumble roster freeze, overlap/tie rules and actual prize delivery remain a later game-flow decision.

Prepared verification: 61 Cash App/queue PHP regression checks plus 21 actual performance/rotation/contribution checks using a SQLite adapter; 28 JavaScript receipt and retained regression checks. The new layout was visually inspected in narrow and full Vivaldi views with sample data and no preview browser errors. No real performance or financial payment was created.

Private source, original live services, previous deployment and recovery paths are protected. Public branch: `codex/simple-host-queue-20261103`, unmerged. New authority key: `rowdy-room/simple-host-queue-2026-11-03`. Next: deploy with rollback preserved, read back exact source hashes, verify the real queue transaction by rollback-only preview, and remove only labeled test signups.
