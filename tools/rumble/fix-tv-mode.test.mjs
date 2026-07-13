import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleTvModeFix } from './fix-tv-mode.mjs';

const prerequisite = 'async function triggerBuzzerDisplay(){}';
const fixture = `<html>\n<head></head>\n<body>\n<div id="app"></div>\n<script>\n${prerequisite}\n</script>\n</body>\n</html>`;

class FakeClassList {
  constructor(owner) { this.owner = owner; this.values = new Set(); }
  add(...names) { names.forEach((name) => this.values.add(name)); this.owner._className = [...this.values].join(' '); }
  remove(...names) { names.forEach((name) => this.values.delete(name)); this.owner._className = [...this.values].join(' '); }
  contains(name) { return this.values.has(name); }
  setFrom(value) { this.values = new Set(String(value || '').split(/\s+/).filter(Boolean)); this.owner._className = [...this.values].join(' '); }
}

class FakeElement {
  constructor(tagName, document) {
    this.tagName = tagName.toUpperCase();
    this.document = document;
    this.children = [];
    this.parentNode = null;
    this._id = '';
    this._className = '';
    this.classList = new FakeClassList(this);
    this._innerHTML = '';
    this.textContent = '';
    this.style = { cssText: '' };
    this.src = '';
    this.onclick = null;
    this.attributes = {};
  }
  set id(value) { this._id = String(value); if (this._id) this.document.elements.set(this._id, this); }
  get id() { return this._id; }
  set className(value) { this.classList.setFrom(value); }
  get className() { return this._className; }
  set innerHTML(value) {
    this._innerHTML = String(value);
    for (const match of this._innerHTML.matchAll(/id="([^"]+)"/g)) {
      if (!this.document.elements.has(match[1])) {
        const child = new FakeElement('div', this.document);
        child.id = match[1];
        this.children.push(child);
        child.parentNode = this;
      }
    }
  }
  get innerHTML() { return this._innerHTML; }
  appendChild(child) { child.parentNode = this; this.children.push(child); if (child.id) this.document.elements.set(child.id, child); return child; }
  prepend(child) { child.parentNode = this; this.children.unshift(child); if (child.id) this.document.elements.set(child.id, child); return child; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
}

class FakeDocument {
  constructor() {
    this.elements = new Map();
    this.head = new FakeElement('head', this);
    this.body = new FakeElement('body', this);
    this.documentElement = new FakeElement('html', this);
    this.listeners = new Map();
    this.app = new FakeElement('div', this); this.app.id = 'app'; this.body.appendChild(this.app);
    this.host = new FakeElement('section', this); this.host.id = 'hostPage'; this.host.className = 'hidden'; this.app.appendChild(this.host);
    this.hostDashboard = new FakeElement('div', this); this.hostDashboard.id = 'hostDashboard'; this.host.appendChild(this.hostDashboard);
    this.intro = new FakeElement('section', this); this.intro.id = 'introPage'; this.app.appendChild(this.intro);
  }
  createElement(tagName) { return new FakeElement(tagName, this); }
  getElementById(id) { return this.elements.get(id) || null; }
  querySelectorAll(selector) { return selector === '#app>section' ? this.app.children.filter((child) => child.tagName === 'SECTION') : []; }
  addEventListener(name, handler) { this.listeners.set(name, handler); }
}

function extractTvScript(source) {
  const match = source.match(/<script id="rowdy-tv-mode-repair">\n([\s\S]*?)\n<\/script>/);
  assert.ok(match, 'TV repair script should be present');
  return match[1];
}

function runtime(source, options = {}) {
  const script = extractTvScript(source);
  const document = new FakeDocument();
  const listeners = new Map();
  const intervals = [];
  const opened = [];
  const location = {
    origin: 'https://game.rowdyroom.site',
    href: 'https://game.rowdyroom.site/index.html#tv',
    hash: options.hash ?? '#tv',
  };
  const window = {
    ROWDY_TV_JOIN_URL: options.joinUrl,
    ROWDY_TV_QR_IMAGE_URL: options.qrImageUrl,
    ROWDY_TV_BANNERS: options.banners,
    ROWDY_TV_BANNER_MS: options.bannerMs,
    addEventListener(name, handler) { listeners.set(name, handler); },
    open(url, name) { opened.push({ url, name }); return { url, name }; },
  };
  const state = {
    currentTeam: 'red',
    currentIndex: 1,
    turnIndexes: { red: 1, blue: 0 },
    redTeam: ['Red One', 'Red Two', 'Red Three'],
    blueTeam: ['Blue One', 'Blue Two'],
    ...(options.state || {}),
  };
  const calls = [];
  const factory = new Function(
    'document','window','location','state','turnPlayers','render','renderHost','setInterval','setTimeout','URL',
    `${script}; return {render,renderHost};`,
  );
  const controls = factory(
    document,
    window,
    location,
    state,
    (team) => team === 'red' ? state.redTeam.filter(Boolean) : state.blueTeam.filter(Boolean),
    () => { calls.push('render'); },
    () => { calls.push('renderHost'); },
    (callback, ms) => { intervals.push({ callback, ms }); return intervals.length; },
    (callback) => { callback(); return 1; },
    URL,
  );
  return { document, window, location, state, calls, controls, listeners, intervals, opened };
}

test('injects one dedicated TV script before the closing body', () => {
  const result = applyRumbleTvModeFix(fixture);
  assert.equal(result.changed, true);
  assert.equal((result.source.match(/id="rowdy-tv-mode-repair"/g) || []).length, 1);
  assert.match(result.source, /<script id="rowdy-tv-mode-repair">[\s\S]*<\/script>\n<\/body>/);
});

test('TV page contains only QR, player queue, current-next, and banner display content', () => {
  const result = applyRumbleTvModeFix(fixture);
  const h = runtime(result.source);
  const page = h.document.getElementById('tvPage');
  assert.ok(page);
  assert.match(page.innerHTML, /tvQrImage/);
  assert.match(page.innerHTML, /tvCurrentPlayer/);
  assert.match(page.innerHTML, /tvNextPlayer/);
  assert.match(page.innerHTML, /tvFireQueue/);
  assert.match(page.innerHTML, /tvIceQueue/);
  assert.match(page.innerHTML, /tvRotatingBanner/);
  assert.doesNotMatch(page.innerHTML, /button|host controls|rules panel|answer key/i);
});

test('initial #tv route hides other sections and renders current and next players', () => {
  const result = applyRumbleTvModeFix(fixture);
  const h = runtime(result.source);
  const page = h.document.getElementById('tvPage');
  assert.equal(page.classList.contains('hidden'), false);
  assert.equal(h.document.getElementById('introPage').classList.contains('hidden'), true);
  assert.equal(h.document.getElementById('tvCurrentPlayer').textContent, 'Red Two');
  assert.equal(h.document.getElementById('tvCurrentTeam').textContent, 'FIRE TEAM');
  assert.equal(h.document.getElementById('tvNextPlayer').textContent, 'Red Three');
  assert.equal(h.document.getElementById('tvNextTeam').textContent, 'FIRE TEAM');
});

test('renders Fire and Ice team queues with the active player highlighted', () => {
  const result = applyRumbleTvModeFix(fixture);
  const h = runtime(result.source);
  const fire = h.document.getElementById('tvFireQueue').innerHTML;
  const ice = h.document.getElementById('tvIceQueue').innerHTML;
  assert.match(fire, /Red One/);
  assert.match(fire, /rr-tv-row active[\s\S]*Red Two/);
  assert.match(fire, /Red Three/);
  assert.match(ice, /Blue One/);
  assert.match(ice, /Blue Two/);
  assert.doesNotMatch(ice, /rr-tv-row active/);
});

test('defaults the QR destination to Companion and supports explicit overrides', () => {
  const result = applyRumbleTvModeFix(fixture);
  const defaultRuntime = runtime(result.source);
  assert.equal(defaultRuntime.document.getElementById('tvJoinUrl').textContent, 'https://game.rowdyroom.site/companion/');
  assert.match(defaultRuntime.document.getElementById('tvQrImage').src, /api\.qrserver\.com/);
  assert.match(defaultRuntime.document.getElementById('tvQrImage').src, /companion/);

  const overrideRuntime = runtime(result.source, {
    joinUrl: 'https://rowdyroom.site/signup',
    qrImageUrl: '/assets/rowdy-signup-qr.png',
  });
  assert.equal(overrideRuntime.document.getElementById('tvJoinUrl').textContent, 'https://rowdyroom.site/signup');
  assert.equal(overrideRuntime.document.getElementById('tvQrImage').src, '/assets/rowdy-signup-qr.png');
});

test('rotates configured banners on the configured cadence', () => {
  const result = applyRumbleTvModeFix(fixture);
  const h = runtime(result.source, { banners: ['Banner A', 'Banner B'], bannerMs: 3000 });
  assert.equal(h.document.getElementById('tvRotatingBanner').textContent, 'Banner A');
  assert.equal(h.intervals[0].ms, 3000);
  h.intervals[0].callback();
  assert.equal(h.document.getElementById('tvRotatingBanner').textContent, 'Banner B');
});

test('existing render path keeps the TV display synchronized with state changes', () => {
  const result = applyRumbleTvModeFix(fixture);
  const h = runtime(result.source);
  h.state.currentIndex = 2;
  h.state.turnIndexes.red = 2;
  h.controls.render();
  assert.ok(h.calls.includes('render'));
  assert.equal(h.document.getElementById('tvCurrentPlayer').textContent, 'Red Three');
  assert.equal(h.document.getElementById('tvNextPlayer').textContent, 'Red One');
});

test('adds a host shortcut that opens a separate #tv window', () => {
  const result = applyRumbleTvModeFix(fixture);
  const h = runtime(result.source);
  const button = h.document.getElementById('openTvModeButton');
  assert.ok(button);
  assert.equal(button.textContent, 'OPEN TV MODE');
  button.onclick();
  assert.equal(h.opened.length, 1);
  assert.match(h.opened[0].url, /#tv$/);
  assert.equal(h.opened[0].name, 'rowdyRoomTvMode');
});

test('leaving #tv removes the TV-active document state', () => {
  const result = applyRumbleTvModeFix(fixture);
  const h = runtime(result.source);
  assert.equal(h.document.documentElement.classList.contains('rowdy-tv-active'), true);
  h.location.hash = '#host';
  h.listeners.get('hashchange')();
  assert.equal(h.document.documentElement.classList.contains('rowdy-tv-active'), false);
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleTvModeFix(fixture);
  const twice = applyRumbleTvModeFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair item 8', () => {
  const source = fixture.replace(prerequisite, 'function unrelated(){}');
  assert.throws(() => applyRumbleTvModeFix(source), /Prerequisite missing/);
});

test('refuses an ambiguous closing insertion point', () => {
  const source = `${fixture}\n${fixture}`;
  assert.throws(() => applyRumbleTvModeFix(source), /expected exactly 1 match/);
});
