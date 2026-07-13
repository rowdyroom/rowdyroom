<?php
declare(strict_types=1);

// Copy this file to /home/ef39cr6m1vih/.rowdy-source-export.php.
// Use a long one-time token. This file is outside public_html and is deleted after a successful export.
// For stronger storage, replace token with token_sha256 and store a SHA-256 hash instead.
return [
    'token' => 'REPLACE_WITH_A_LONG_RANDOM_ONE_TIME_TOKEN',
    // 'token_sha256' => 'OPTIONAL_64_CHARACTER_SHA256',
    'max_age_seconds' => 7200,
    'one_time' => true,

    // Optional. Add a read-only MySQL account to include current SHOW CREATE TABLE output.
    // Leave db_dsn empty to export source and existing schema files without opening MySQL.
    'db_dsn' => '',
    'db_user' => '',
    'db_pass' => '',

    // Optional override. Omit this key to use the audited allowlist built into RowdySourceExporter.
    // 'targets' => [],
];
