begin;

insert into public.rr_manual_sections
  (section_key, title, section_order, content, status, source, updated_at)
values
  ('engine_overview', 'Project Engine Overview', 10,
   'The Rowdy Room Project Engine is the documentation, architecture, health, release, version, and rollback layer for the Rowdy Room ecosystem. It scans project files, updates the registry, maps dependencies, records decisions, detects issues, creates fix plans, and exports operational documentation. No production patch is considered complete until the Bible and rollback record are updated.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('product_definition', 'Product Definition', 20,
   'Rowdy Room is a live karaoke, audience-participation, competition, community, and local entertainment system. The participation loop is Sing, Compete, Vote, Connect. The public promise is Live Karaoke. Real Votes. Real Community.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('source_of_truth_rules', 'Source of Truth and Rollback Rules', 30,
   'The Bible, active-system index, endpoint map, contracts, deployment record, and rollback record must be updated with every valid patch. Production changes require a backup or version-controlled branch/commit. Do not make untracked edits inside public_html. Secrets and private credentials must never be placed in documentation or GitHub.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('live_karaoke_model', 'Live Karaoke, Queue, Voting, and Main 4', 40,
   'Viewers join from phones and can track queue position and wait time. The host controls the live rotation. Anonymous 1-5 star voting follows the active performance and room voting state, with the documented target of a one-minute post-performance window. Main 4 is the current standings model; Main 2 wording is stale. Main 4 positions are earned by contribution and singer scores and must be defended.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('companion_app', 'Companion App', 50,
   'The Companion App supports signup, queue position, estimated wait, song requests, anonymous voting, live information, competition access, Rumble participation, Boost Points, permitted line movement, gifting boosts, memory requests, delivery, and saved scores or media.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('boost_points', 'Boost Points and TikFinity', 60,
   'Boost Points connect TikTok participation to wallets, transfers, memories, highlights, line actions, and game actions. TikFinity and webhook events require duplicate/replay protection. Public clients must use publishable credentials only. API provider health, quota monitoring, caching, and fallbacks are required because YouTube SongFinder limits previously interrupted live use.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('rumble_rules', 'Rowdy Room Rumble', 70,
   'Rumble is an audience-shaped Fire Team versus Ice Team game-show mode. It is not scheduled and has no fixed 30-minute timer. The host activates it only when the room creates the right moment. The canonical implementation must preserve questions and ranked answers, rounds, multipliers, strikes, steals, contributions, knockouts, resurrects, lifelines, timers, sounds, and Rowdy Rush while keeping the host panel compact.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('mission_control', 'Mission Control and Host Console', 80,
   'Mission Control v14 integrates queue, songbook, requests, Rumble wheel, and Rumble buzzer. The live Rumble host panel should expose only question and answer key, next player, next question, lifeline, resurrect, punch wheel, and emergency reset. Normal game flow should be handled by keybinds and game logic.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('website_brand', 'Website and Brand Direction', 90,
   'The website uses deep royal purple neon with cyan, gold, white, and selective status accents. Pink is not a dominant brand color. Text must remain crisp. Top actions are Watch Live and Discord or Rowdy Bunch. Mobile sticky actions are Sign Up to Sing, Get Boost Points, and Live Vote. Booking remains a separate section. Three one-minute videos explain Rowdy Room, Rumble, and the Companion App without repetitive text sections.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('supabase_authority', 'Supabase Authority and Security', 100,
   'The active authoritative Supabase project is Final with ref szubjgpvlqliyparrnam in us-east-1. The old project dupwuopnpmdsprxxqsle is inactive and must not be mixed into production configuration. Exposed tables require RLS, public clients must not receive secret or service-role keys, and backend-only engine tables must remain protected.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('production_map', 'Production Server Map', 110,
   'Production is rooted at /home/ef39cr6m1vih/public_html. Known surfaces include the public index, mission-control, companion, rumble-wheel, rumble-buzzer, and API endpoints for system checks, admin operations, cleanup, songbook, wheel, and buzzer. The protected Bible and tools live outside public_html under /home/ef39cr6m1vih/rowdyroom_bible and /home/ef39cr6m1vih/rowdyroom_tools.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now()),
  ('current_risks', 'Current Risks and Priorities', 120,
   'Primary risks are production/GitHub drift, Main 2 versus Main 4 stale wording, multiple Rumble implementations, temporary public scanners, API quota failures, old Supabase references, historical credentials in old artifacts, and unclear active versus legacy booking or monetization variants. Priority is to reconcile all source-of-truth copies, inventory routes, remove temporary tools, choose one Rumble implementation, synchronize production source to version control, and verify security and provider health.',
   'Active', 'Rowdy Room Progress consolidation 2026-07-13', now())
on conflict (section_key) do update
set title = excluded.title,
    section_order = excluded.section_order,
    content = excluded.content,
    status = excluded.status,
    source = excluded.source,
    updated_at = now();

insert into public.rr_knowledge
  (category, title, content, source, status, tags, priority, updated_at)
select
  'Product Rule',
  'Rumble is activated and audience-shaped',
  'Rumble is optional, has no fixed schedule, and is activated only when the host and room energy create the right moment.',
  'Rowdy Room Progress consolidation 2026-07-13',
  'Active',
  array['rumble','live-operations','authoritative'],
  100,
  now()
where not exists (
  select 1 from public.rr_knowledge
  where title = 'Rumble is activated and audience-shaped'
    and status = 'Active'
);

insert into public.rr_knowledge
  (category, title, content, source, status, tags, priority, updated_at)
select
  'Product Rule',
  'Main 4 is authoritative',
  'Main 4 is the current contribution and singer-score standings model. Main 2 references are stale and require correction.',
  'Rowdy Room Progress consolidation 2026-07-13',
  'Active',
  array['main-4','leaderboard','authoritative'],
  100,
  now()
where not exists (
  select 1 from public.rr_knowledge
  where title = 'Main 4 is authoritative'
    and status = 'Active'
);

insert into public.rr_knowledge
  (category, title, content, source, status, tags, priority, updated_at)
select
  'Operations Rule',
  'No patch without Bible and rollback update',
  'Every production patch requires a backup or version-controlled recovery point plus updated Bible, deployment, verification, and rollback records.',
  'Rowdy Room Progress consolidation 2026-07-13',
  'Active',
  array['rollback','deployment','documentation','authoritative'],
  100,
  now()
where not exists (
  select 1 from public.rr_knowledge
  where title = 'No patch without Bible and rollback update'
    and status = 'Active'
);

update public.rr_feature_index
set feature_name = 'Main 4 Leaderboard',
    summary = 'Main 4 and current standings display logic based on contribution and singer scores; positions are earned and defended.',
    updated_at = now()
where feature_key = 'leaderboard';

insert into public.rr_updates
  (area, kind, title, details, state, source)
values
  ('Documentation', 'Consolidation', 'Rowdy Room Progress Bible synchronized',
   'Expanded the Supabase manual from one short section into an authoritative product, operations, architecture, security, and risk Bible. Recorded Main 4, audience-shaped Rumble, compact host controls, active Supabase project, production map, rollback rules, and current priorities.',
   'Active', 'GitHub docs/ROWDY_ROOM_BIBLE.md and Rowdy Room Progress consolidation 2026-07-13');

insert into public.rr_versions
  (version_key, semver, version_type, status, summary, changelog, created_by, updated_at)
values
  ('docs_0_3_0_rowdy_room_bible', '0.3.0-docs-bible', 'Minor', 'Candidate',
   'Consolidated Rowdy Room product and operating Bible across GitHub and Supabase documentation.',
   'Added product definition, source-of-truth rules, live karaoke model, Main 4, Companion App, Boost Points, Rumble rules, Mission Control, website direction, Supabase authority, production map, risks, and rollback requirements.',
   'ChatGPT with Roger Jamsek', now())
on conflict (version_key) do update
set semver = excluded.semver,
    version_type = excluded.version_type,
    status = excluded.status,
    summary = excluded.summary,
    changelog = excluded.changelog,
    created_by = excluded.created_by,
    updated_at = now();

commit;
