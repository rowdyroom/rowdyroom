#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, resolve } from 'node:path';

const registryPath = resolve('config/canonical-sites.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const errors = [];

const expectedHosts = [
  'rowdyroom.site',
  'admin.memories.rowdyroom.site',
  'book.rowdyroom.site',
  'companion.rowdyroom.site',
  'game.rowdyroom.site',
  'memories.rowdyroom.site',
  'pickup.memories.rowdyroom.site',
  'privacypolicy.rowdyroom.site',
  'queue.rowdyroom.site',
  'render.rowdyroom.site',
  'songfinder.rowdyroom.site',
  'videomaker.rowdyroom.site',
  'vote.rowdyroom.site'
];

function fail(message) {
  errors.push(message);
}

if (registry.schema_version < 2) {
  fail('Registry schema version must include standalone TV-display ownership rules.');
}

if (registry.account_home !== '/home/ef39cr6m1vih') {
  fail('Account home must remain /home/ef39cr6m1vih unless the registry and Bible are deliberately changed.');
}

if (registry.public_html !== '/home/ef39cr6m1vih/public_html') {
  fail('Public HTML root must remain /home/ef39cr6m1vih/public_html unless the registry and Bible are deliberately changed.');
}

if (!Array.isArray(registry.domains) || registry.domains.length !== expectedHosts.length) {
  fail(`Registry must contain exactly ${expectedHosts.length} currently registered cPanel domains.`);
}

const seen = new Set();
for (const domain of registry.domains ?? []) {
  if (!domain || typeof domain !== 'object') {
    fail('Every domain entry must be an object.');
    continue;
  }

  if (seen.has(domain.hostname)) {
    fail(`Duplicate hostname: ${domain.hostname}`);
  }
  seen.add(domain.hostname);

  let url;
  try {
    url = new URL(domain.canonical_public_url);
  } catch {
    fail(`Invalid canonical URL for ${domain.hostname}: ${domain.canonical_public_url}`);
    continue;
  }

  if (url.protocol !== 'https:') {
    fail(`Canonical URL must use HTTPS: ${domain.canonical_public_url}`);
  }

  if (url.hostname !== domain.hostname) {
    fail(`Canonical URL hostname mismatch for ${domain.hostname}: ${domain.canonical_public_url}`);
  }

  if (url.pathname !== '/') {
    fail(`Registered subdomain canonical URL must not be replaced by a path URL: ${domain.canonical_public_url}`);
  }

  if (domain.canonical !== true) {
    fail(`Domain must be marked canonical: ${domain.hostname}`);
  }

  if (typeof domain.document_root !== 'string' || !domain.document_root.startsWith(`${registry.account_home}/`)) {
    fail(`Document root must be an absolute path under the account home for ${domain.hostname}.`);
  }
}

for (const hostname of expectedHosts) {
  if (!seen.has(hostname)) fail(`Missing required cPanel hostname: ${hostname}`);
}

const companion = registry.domains?.find(entry => entry.hostname === 'companion.rowdyroom.site');
if (companion?.canonical_public_url !== 'https://companion.rowdyroom.site/') {
  fail('Companion public identity must remain https://companion.rowdyroom.site/.');
}

const game = registry.domains?.find(entry => entry.hostname === 'game.rowdyroom.site');
if (game?.role !== 'rowdy_room_rumble_game_only') {
  fail('game.rowdyroom.site must remain Rumble-game-only.');
}
if (Array.isArray(game?.route_modes) && game.route_modes.some(entry => entry?.route === '#tv')) {
  fail('The standalone TV display must not be registered as a #tv game route.');
}
if (!Array.isArray(game?.prohibited_roles) || !game.prohibited_roles.includes('live_show_tv_display')) {
  fail('The game registry must explicitly prohibit ownership of the live-show TV display.');
}

const tv = registry.planned_domains?.find(entry => entry.hostname === 'tv.rowdyroom.site');
if (!tv) {
  fail('Missing reserved standalone TV domain tv.rowdyroom.site.');
} else {
  if (tv.desired_public_url !== 'https://tv.rowdyroom.site/') {
    fail('Standalone TV desired public URL must be https://tv.rowdyroom.site/.');
  }
  if (tv.desired_document_root !== '/home/ef39cr6m1vih/public_html/tv.rowdyroom.site') {
    fail('Standalone TV desired document root must be /home/ef39cr6m1vih/public_html/tv.rowdyroom.site.');
  }
  if (tv.status !== 'pending_cpanel_creation_and_live_deployment') {
    fail('Standalone TV must remain pending until cPanel creation and live verification are complete.');
  }
  if (tv.role !== 'standalone_live_show_tv_display') {
    fail('tv.rowdyroom.site must be registered as the standalone live-show TV display.');
  }

  const requiredFields = [
    'signup_qr_code',
    'rotating_information_banner',
    'now_performing',
    'up_next',
    'next_five_performers',
    'estimated_wait_time'
  ];
  for (const field of requiredFields) {
    if (!tv.allowed_display_fields?.includes(field)) {
      fail(`Standalone TV allowed-display contract is missing ${field}.`);
    }
  }

  const forbiddenFields = [
    'game_rules',
    'rumble_scores',
    'fire_team',
    'ice_team',
    'strikes',
    'steal_status',
    'wheel_results',
    'buzzer_events',
    'game_host_controls',
    'answer_board'
  ];
  for (const field of forbiddenFields) {
    if (!tv.forbidden_display_fields?.includes(field)) {
      fail(`Standalone TV forbidden-display contract is missing ${field}.`);
    }
  }
}

const pathOnlyNames = new Set((registry.registered_path_only_surfaces ?? []).map(entry => entry.name));
for (const required of ['mission_control', 'rumble_wheel_display', 'rumble_buzzer_display']) {
  if (!pathOnlyNames.has(required)) fail(`Missing registered path-only surface: ${required}`);
}
if (pathOnlyNames.has('tv_display') || pathOnlyNames.has('audience_screen')) {
  fail('The standalone TV display must not be registered as a path-only product.');
}

const retiredRumbleTvPaths = [
  'tools/rumble/fix-tv-mode.mjs',
  'tools/rumble/fix-tv-mode.test.mjs',
  'tools/rumble/fix-tv-mode-hardening.mjs',
  'tools/rumble/fix-tv-mode-hardening.test.mjs',
  'docs/bible/2026-07-13-rumble-tv-mode-repair.md',
  'supabase/seed/20260713_rumble_tv_mode_repair.sql',
  'supabase/rollback/20260713_rumble_tv_mode_repair_rollback.sql'
];
for (const path of retiredRumbleTvPaths) {
  if (existsSync(resolve(path))) {
    fail(`Retired game-owned TV file must remain absent: ${path}`);
  }
}

const forbiddenAliases = [
  'https://rowdyroom.site/companion',
  'https://rowdyroom.site/game',
  'https://rowdyroom.site/queue',
  'https://rowdyroom.site/vote',
  'https://rowdyroom.site/book',
  'https://rowdyroom.site/memories',
  'https://rowdyroom.site/render',
  'https://rowdyroom.site/songfinder',
  'https://rowdyroom.site/videomaker',
  'https://rowdyroom.site/privacypolicy',
  'https://game.rowdyroom.site/#tv'
];

const forbiddenRumbleTvMarkers = [
  'rowdy-tv-mode-repair',
  'rowdy-tv-mode-hardening',
  'OPEN TV MODE',
  '#tvPage',
  "location.hash==='#tv'",
  "location.hash === '#tv'"
];

const scannableExtensions = new Set([
  '.html', '.htm', '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.php', '.md', '.json', '.yaml', '.yml'
]);

const scanExclusions = [
  'config/canonical-sites.json',
  'docs/bible/2026-07-14-canonical-domain-and-document-root-law.md',
  'docs/bible/2026-07-14-standalone-tv-display-law.md',
  'docs/operations/2026-07-14-cpanel-site-inventory.md',
  'docs/operations/2026-07-14-cleanup-batch-1-rumble-tv-retirement.md',
  'tools/domain-registry/validate-canonical-sites.mjs',
  '.github/workflows/domain-registry.yml'
];

function scanChangedFiles(baseRef) {
  let output;
  try {
    output = execFileSync('git', ['diff', '--name-only', '--diff-filter=ACMR', `${baseRef}...HEAD`], {
      encoding: 'utf8'
    });
  } catch (error) {
    fail(`Could not calculate changed files against ${baseRef}: ${error.message}`);
    return;
  }

  const files = output.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
  for (const file of files) {
    if (scanExclusions.includes(file) || !scannableExtensions.has(extname(file).toLowerCase())) continue;

    try {
      if (!statSync(file).isFile()) continue;
    } catch {
      continue;
    }

    const text = readFileSync(file, 'utf8');
    for (const alias of forbiddenAliases) {
      if (text.includes(alias)) {
        fail(`${file} introduces prohibited or noncanonical public URL ${alias}. Use the registry-defined product address instead.`);
      }
    }

    if (file.startsWith('tools/rumble/')) {
      for (const marker of forbiddenRumbleTvMarkers) {
        if (text.includes(marker)) {
          fail(`${file} reintroduces prohibited game-owned TV marker ${marker}. Rumble and the standalone TV display must remain separate.`);
        }
      }
    }
  }
}

const scanIndex = process.argv.indexOf('--scan-diff');
if (scanIndex !== -1) {
  const baseRef = process.argv[scanIndex + 1];
  if (!baseRef) fail('--scan-diff requires a Git base reference.');
  else scanChangedFiles(baseRef);
}

if (errors.length) {
  console.error('\nCanonical domain registry validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Canonical domain registry valid: ${expectedHosts.length} active domains, ${pathOnlyNames.size} path-only surfaces, standalone TV reserved independently, and game-owned TV source retired.`);
