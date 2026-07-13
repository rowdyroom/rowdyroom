begin;

update public.rr_manual_sections
set title = 'Project Engine Overview',
    section_order = 10,
    content = 'The Rowdy Room Project Engine scans the local Rowdy Room workspace, updates the registry, analyzes code, builds dependency maps, detects issues, creates TODOs, and exports the manual/dashboard.',
    status = 'Active',
    source = 'Engine setup',
    updated_at = now()
where section_key = 'engine_overview';

delete from public.rr_manual_sections
where section_key in (
  'product_definition',
  'source_of_truth_rules',
  'live_karaoke_model',
  'companion_app',
  'boost_points',
  'rumble_rules',
  'mission_control',
  'website_brand',
  'supabase_authority',
  'production_map',
  'current_risks'
)
and source = 'Rowdy Room Progress consolidation 2026-07-13';

delete from public.rr_knowledge
where source = 'Rowdy Room Progress consolidation 2026-07-13'
  and title in (
    'Rumble is activated and audience-shaped',
    'Main 4 is authoritative',
    'No patch without Bible and rollback update'
  );

update public.rr_feature_index
set feature_name = 'Leaderboard',
    summary = 'Main 2 and current standings display logic.',
    updated_at = now()
where feature_key = 'leaderboard';

delete from public.rr_updates
where title = 'Rowdy Room Progress Bible synchronized'
  and source = 'GitHub docs/ROWDY_ROOM_BIBLE.md and Rowdy Room Progress consolidation 2026-07-13';

delete from public.rr_versions
where version_key = 'docs_0_3_0_rowdy_room_bible'
  and semver = '0.3.0-docs-bible';

commit;
