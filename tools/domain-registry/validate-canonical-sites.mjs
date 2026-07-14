#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
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

if (registry.account_home !== '/home/ef39cr6m1vih') {
  fail('Account home must remain /home/ef39cr6m1vih unless the registry and Bible are deliberately changed.');
}

if (registry.public_html !== '/home/ef39cr6m1vih/public_html') {
  fail('Public HTML root must remain /home/ef39cr6m1vih/public_html unless the registry and Bible are deliberately changed.');
}

if (!Array.isArray(registry.domains) || registry.domains.length !== expectedHosts.length) {
  fail(`Registry must contain exactly ${expectedHosts.length} cPanel domains.`);
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
const tvMode = game?.route_modes?.find(entry => entry.route === '#tv');
if (tvMode?.public_url !== 'https://game.rowdyroom.site/#tv') {
  fail('Rumble TV mode must remain a hash mode under https://game.rowdyroom.site/#tv.');
}

const pathOnlyNames = new Set((registry.registered_path_only_surfaces ?? []).map(entry => entry.name));
for (const required of ['mission_control', 'rumble_wheel_display', 'rumble_buzzer_display']) {
  if (!pathOnlyNames.has(required)) fail(`Missing registered path-only surface: ${required}`);
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
  'https://rowdyroom.site/privacypolicy'
];

const scannableExtensions = new Set([
  '.html', '.htm', '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.php', '.md', '.json', '.yaml', '.yml'
]);

const scanExclusions = [
  'config/canonical-sites.json',
  'docs/bible/2026-07-14-canonical-domain-and-document-root-law.md',
  'docs/operations/2026-07-14-cpanel-site-inventory.md',
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
        fail(`${file} introduces noncanonical public URL ${alias}. Use the registered subdomain instead.`);
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

console.log(`Canonical domain registry valid: ${expectedHosts.length} domains and ${pathOnlyNames.size} path-only surfaces.`);
