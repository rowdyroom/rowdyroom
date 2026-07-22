(() => {
  'use strict';

  const ENDPOINT = 'api/queue-display.php';
  const POLL_INTERVAL_MS = 10_000;
  const bannerMessages = [
    'Scan the code to sign up and join the karaoke queue.',
    'Follow your place in the rotation from your phone.',
    'Vote during live performances in the Companion App.',
    'Rowdy Room — where every person is a star.'
  ];
  const placeholderNames = new Set(['@mainstage', '@singername', '@nextsinger', '@ondeck', '@rowdyguest', '@guest', '@waiting']);
  const placeholderIds = new Set(['mainstage', 'singer', 'next', 'deck', 'waiting', 'guest', 'rowdyguest', 'late']);

  const elements = {
    banner: document.getElementById('banner'),
    connectionDot: document.getElementById('connectionDot'),
    connectionText: document.getElementById('connectionText'),
    nowName: document.getElementById('nowName'),
    nowSong: document.getElementById('nowSong'),
    nextName: document.getElementById('nextName'),
    nextSong: document.getElementById('nextSong'),
    queueList: document.getElementById('queueList'),
    waitTime: document.getElementById('waitTime'),
    updatedAt: document.getElementById('updatedAt')
  };

  function text(value, fallback = '') {
    return String(value ?? '').trim() || fallback;
  }

  function isPlaceholder(row) {
    return placeholderNames.has(text(row.tiktok_username).toLowerCase()) || placeholderIds.has(text(row.user_id).toLowerCase());
  }

  function displayName(row, fallback = 'Waiting for the next performer') {
    return text(row.display_name) || text(row.tiktok_username) || fallback;
  }

  function songLine(row, fallback) {
    const song = text(row.song_title);
    const artist = text(row.artist);
    return song ? `${song}${artist ? ` — ${artist}` : ''}` : fallback;
  }

  function status(row) {
    return text(row.status).toLowerCase().replace(/[_-]+/g, ' ');
  }

  function samePerformer(left, right) {
    if (!left || !right) return false;
    return displayName(left, '').toLowerCase() === displayName(right, '').toLowerCase();
  }

  function queueRows(data) {
    const rows = Array.isArray(data?.queue) ? data.queue : data?.queue?.queue;
    return (rows || [])
      .filter(row => row && !isPlaceholder(row))
      .sort((a, b) => Number(a.position ?? Number.MAX_SAFE_INTEGER) - Number(b.position ?? Number.MAX_SAFE_INTEGER));
  }

  function currentPerformer(data, rows) {
    const current = data?.current_performance || data?.currentPerformance;
    const explicit = current && (current.performance || current);
    const explicitName = text(explicit?.display_name) || text(explicit?.tiktok_username);
    if (explicitName) return { ...explicit, display_name: explicitName };
    return rows.find(row => /^(performing|now|active|current|on stage)$/.test(status(row))) || rows[0] || null;
  }

  function upNext(rows, now) {
    const nowPosition = Number(now?.position);
    const namedNext = rows.find(row => /^(up next|on deck|next)$/.test(status(row)) && !samePerformer(row, now));
    if (namedNext) return namedNext;
    return rows.find(row => !samePerformer(row, now) && (!Number.isFinite(nowPosition) || Number(row.position) > nowPosition)) || null;
  }

  function queueAfter(rows, now, next) {
    return rows.filter(row => !samePerformer(row, now) && !samePerformer(row, next)).slice(0, 5);
  }

  function waitEstimate(data) {
    const candidates = [
      data?.estimated_wait_minutes,
      data?.estimatedWaitMinutes,
      data?.queue?.estimated_wait_minutes,
      data?.queue?.estimatedWaitMinutes,
      data?.wait_minutes
    ];
    const value = candidates.find(candidate => candidate !== null && candidate !== undefined && candidate !== '');
    if (value === undefined) return 'Waiting for queue estimate';
    const numeric = Number(value);
    return Number.isFinite(numeric) ? `${Math.max(0, Math.round(numeric))} minutes` : text(value, 'Waiting for queue estimate');
  }

  function setConnection(state, label) {
    elements.connectionDot.classList.toggle('is-live', state === 'live');
    elements.connectionDot.classList.toggle('is-error', state === 'error');
    elements.connectionText.textContent = label;
  }

  function renderQueue(rows) {
    if (!rows.length) {
      elements.queueList.innerHTML = '<li class="empty-row">Waiting for singers to join the queue.</li>';
      return;
    }
    elements.queueList.innerHTML = rows.map(row => `
      <li>
        <span class="position">${Number.isFinite(Number(row.position)) ? `#${Number(row.position)}` : '•'}</span>
        <span class="name">${escapeHtml(displayName(row, 'Guest'))}</span>
        <span class="song">${escapeHtml(songLine(row, ''))}</span>
      </li>
    `).join('');
  }

  function escapeHtml(value) {
    return text(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  function render(data) {
    const rows = queueRows(data);
    const now = currentPerformer(data, rows);
    const next = upNext(rows, now);
    elements.nowName.textContent = now ? displayName(now) : 'Waiting for the next performer';
    elements.nowSong.textContent = now ? songLine(now, 'The room is getting ready.') : 'The room is getting ready.';
    elements.nextName.textContent = next ? displayName(next, '—') : '—';
    elements.nextSong.textContent = next ? songLine(next, 'Join the queue from your phone.') : 'Join the queue from your phone.';
    renderQueue(queueAfter(rows, now, next));
    elements.waitTime.textContent = waitEstimate(data);
    elements.updatedAt.textContent = `Queue updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    setConnection('live', 'LIVE QUEUE');
  }

  async function refresh() {
    try {
      const response = await fetch(ENDPOINT, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Queue display request failed: ${response.status}`);
      const data = await response.json();
      if (!data?.ok) throw new Error('Queue display returned no live data');
      render(data);
    } catch (error) {
      setConnection('error', 'QUEUE UNAVAILABLE');
      elements.updatedAt.textContent = 'Waiting for the live queue connection to return.';
    }
  }

  let bannerIndex = 0;
  setInterval(() => {
    bannerIndex = (bannerIndex + 1) % bannerMessages.length;
    elements.banner.textContent = bannerMessages[bannerIndex];
  }, 8_000);

  refresh();
  setInterval(refresh, POLL_INTERVAL_MS);
})();
