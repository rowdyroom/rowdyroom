# Live queue ordering and vote score — 2026-10-06

Status: live implementation verified for queue movement; real-ballot acceptance remains open.

The host page at `https://rowdyroom.site/queue/` now permits host-authenticated drag-and-drop and Move Up/Down on waiting PHP queue entries. The current performer cannot be moved. The PHP reorder endpoint checks the host credential, requires an exact current waiting-entry set, and changes positions in a transaction. The public TV rotation reads the same queue.

The host's current-performer row and header, the Companion Vote tab at `https://rowdyroom.site/companion/#vote`, and the TV rotation now read the PHP `live_show` performance score. They show the average out of five and vote count, or “Awaiting votes” until a ballot arrives. The Companion score refreshes while Vote is open and immediately after a submission. The TV display refreshes with its queue. Votes during the permitted final minute update the saved performance total.

Verification: API queue and Companion bootstrap returned HTTP 200; reorder without a host key returned HTTP 401. The host moved the second waiting singer ahead and then restored the original order, and the TV rotation reflected the restored order. Host Move Up/Down controls and Companion score status rendered without current-page script errors. Eight private server rollback copies matched the pre-change files exactly. No current performance existed, so no live ballot, changing score, duplicate-vote rejection, or final-minute result was exercised in this pass. Do not claim those as owner-accepted.

Operational check for the next real performance: start the singer from Host Controls, cast one valid viewer vote on the Companion Vote tab, confirm the same singer's score and count on host, Companion, and TV, reject a duplicate ballot, then confirm final-minute votes update the saved total. Do not use a real singer as a synthetic test without Roger's direction.
