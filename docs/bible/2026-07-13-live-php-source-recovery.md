# Live PHP Queue Source Recovery

**Status:** Recovery tooling code-verified locally; server upload still required.

## Why this exists

The July 10 server scan confirms the current Rowdy Room host stack is present on the hosting account, including:

- `/home/ef39cr6m1vih/src/`
- `/home/ef39cr6m1vih/sql/schema_mysql.sql`
- `/home/ef39cr6m1vih/public_html/api/index.php`
- `/home/ef39cr6m1vih/public_html/api/admin-ops.php`
- `/home/ef39cr6m1vih/public_html/api/admin-cleanup.php`
- `/home/ef39cr6m1vih/public_html/api/system-check.php`
- `/home/ef39cr6m1vih/public_html/mission-control/`
- `/home/ef39cr6m1vih/public_html/companion/`
- `/home/ef39cr6m1vih/public_html/admin-tools/queue.php`
- selected `_old_rowdyroom_deployment_files` queue/schema records

Those exact files are not in GitHub. Reconstructing them from scan snippets would be unsafe. The recovery tool exports the exact files instead.

## Security properties

The exporter:

- uses an explicit allowlist
- refuses path traversal and symlinks outside the account root
- excludes configuration, environment, credential, and unsupported binary files
- redacts password, secret, token, API-key, admin-key, client-secret, private-key, and JWT values found inside allowed source files
- exports no database rows
- optionally captures only `SHOW CREATE TABLE` output and table counts through a read-only MySQL account
- records original and exported SHA-256 hashes
- streams the ZIP and deletes the temporary archive
- accepts the token through a POST form instead of placing it in the URL
- expires the account-root configuration after two hours by default
- deletes the account-root configuration after a successful export by default

## Upload layout

Create this directory in cPanel File Manager:

```text
/home/ef39cr6m1vih/public_html/admin-tools/source-recovery/
```

Upload:

```text
RowdySourceExporter.php
rowdy-source-export.php
```

Copy `rowdy-source-export-config.example.php` to:

```text
/home/ef39cr6m1vih/.rowdy-source-export.php
```

The configuration is deliberately outside `public_html`.

## Temporary configuration

Set a long random one-time token:

```php
return [
    'token' => 'A-LONG-UNIQUE-ONE-TIME-TOKEN',
    'max_age_seconds' => 7200,
    'one_time' => true,
    'db_dsn' => '',
    'db_user' => '',
    'db_pass' => '',
];
```

MySQL details are optional. Source files and existing schema SQL are exported without them. When MySQL details are supplied, use a read-only database account.

## Run

Open:

```text
https://rowdyroom.site/admin-tools/source-recovery/rowdy-source-export.php
```

1. Enter the one-time token.
2. Run **Inspect only** first.
3. Review the file count, missing targets, and skipped files.
4. Run **Download redacted ZIP**.
5. Remove the `source-recovery` directory after download.
6. Confirm the account-root `.rowdy-source-export.php` file was removed. Delete it manually if it remains.

## Verify before import

```bash
php tools/server/verify-source-export.php rowdy-live-php-source-YYYYMMDD-HHMMSS.zip recovered/live-php
```

The verifier refuses:

- malformed manifests
- path traversal
- forbidden configuration files
- files with mismatched SHA-256 hashes
- exports that claim to contain database row data

After verification, import the recovered source on a dedicated branch. Do not deploy the recovered copy back to production until its routes, schema, sign-up, approval, rotation, performance, voting, requeue, and rollback tests pass.

## Recovery acceptance criteria

The ZIP must contain the exact current versions of:

- Mission Control UI
- Companion UI and client API calls
- public API router
- `admin-ops.php`
- queue/performance/vote/request services under `src`
- MySQL schema definitions
- version marker and system-check contracts

No live credentials or database rows may enter GitHub.
