<?php
declare(strict_types=1);

final class RowdySourceExporter
{
    private const DEFAULT_MAX_FILE_BYTES = 2_000_000;
    private const DEFAULT_MAX_TOTAL_BYTES = 30_000_000;

    /** @var list<string> */
    private array $targets;
    /** @var list<string> */
    private array $allowedExtensions = ['php', 'js', 'css', 'html', 'htm', 'md', 'txt', 'sql', 'json'];
    /** @var list<string> */
    private array $forbiddenBasenames = [
        '.env', '.env.local', '.htpasswd', 'config.php', 'config.local.php',
        'secrets.php', 'credentials.php', 'database.php', 'wp-config.php',
    ];

    public function __construct(
        private readonly string $accountRoot,
        ?array $targets = null,
        private readonly ?PDO $pdo = null,
        private readonly int $maxFileBytes = self::DEFAULT_MAX_FILE_BYTES,
        private readonly int $maxTotalBytes = self::DEFAULT_MAX_TOTAL_BYTES,
    ) {
        $realRoot = realpath($accountRoot);
        if ($realRoot === false || !is_dir($realRoot)) {
            throw new InvalidArgumentException('Account root does not exist.');
        }
        $this->targets = $targets ?? self::defaultTargets();
    }

    /** @return list<string> */
    public static function defaultTargets(): array
    {
        return [
            'src',
            'sql/schema_mysql.sql',
            'public_html/api/index.php',
            'public_html/api/admin-ops.php',
            'public_html/api/admin-cleanup.php',
            'public_html/api/system-check.php',
            'public_html/api/songbook.php',
            'public_html/api/VERSION_REAL_MISSION_CONTROL_V14.txt',
            'public_html/mission-control',
            'public_html/companion',
            'public_html/admin-tools/queue.php',
            '_old_rowdyroom_deployment_files/QueueActionService.php',
            '_old_rowdyroom_deployment_files/schema_mysql.sql',
            '_old_rowdyroom_deployment_files/EARNED_BP_CAPS_ENGINE.md',
            '_old_rowdyroom_deployment_files/PERFORMANCE_TRACKING_AND_VOTE_PROTECTION.md',
        ];
    }

    /**
     * @return array{files:list<array<string,mixed>>,missing:list<string>,skipped:list<array<string,string>>,total_original_bytes:int,total_exported_bytes:int}
     */
    public function inspect(): array
    {
        $files = [];
        $missing = [];
        $skipped = [];
        $seen = [];
        $totalOriginal = 0;
        $totalExported = 0;

        foreach ($this->targets as $target) {
            $resolved = $this->resolveInsideRoot($target);
            if ($resolved === null || !file_exists($resolved)) {
                $missing[] = $target;
                continue;
            }

            $paths = is_dir($resolved) ? $this->walkDirectory($resolved) : [$resolved];
            foreach ($paths as $path) {
                $relative = $this->relativePath($path);
                if (isset($seen[$relative])) {
                    continue;
                }
                $seen[$relative] = true;

                $reason = $this->skipReason($path);
                if ($reason !== null) {
                    $skipped[] = ['path' => $relative, 'reason' => $reason];
                    continue;
                }

                $size = filesize($path);
                if ($size === false) {
                    $skipped[] = ['path' => $relative, 'reason' => 'size_unavailable'];
                    continue;
                }
                if ($size > $this->maxFileBytes) {
                    $skipped[] = ['path' => $relative, 'reason' => 'file_too_large'];
                    continue;
                }
                if ($totalOriginal + $size > $this->maxTotalBytes) {
                    $skipped[] = ['path' => $relative, 'reason' => 'total_limit_reached'];
                    continue;
                }

                $raw = file_get_contents($path);
                if ($raw === false) {
                    $skipped[] = ['path' => $relative, 'reason' => 'read_failed'];
                    continue;
                }
                $redacted = $this->redact($raw);
                $wasRedacted = $redacted !== $raw;
                $totalOriginal += $size;
                $totalExported += strlen($redacted);

                $files[] = [
                    'absolute_path' => $path,
                    'relative_path' => $relative,
                    'archive_path' => 'source/' . $relative,
                    'original_bytes' => $size,
                    'exported_bytes' => strlen($redacted),
                    'modified_utc' => gmdate('c', (int) filemtime($path)),
                    'original_sha256' => hash('sha256', $raw),
                    'exported_sha256' => hash('sha256', $redacted),
                    'redacted' => $wasRedacted,
                    'content' => $redacted,
                ];
            }
        }

        usort($files, static fn(array $a, array $b): int => strcmp($a['relative_path'], $b['relative_path']));
        sort($missing);
        usort($skipped, static fn(array $a, array $b): int => strcmp($a['path'], $b['path']));

        return [
            'files' => $files,
            'missing' => $missing,
            'skipped' => $skipped,
            'total_original_bytes' => $totalOriginal,
            'total_exported_bytes' => $totalExported,
        ];
    }

    /** @return array<string,mixed> */
    public function exportToZip(string $zipPath): array
    {
        if (!class_exists(ZipArchive::class)) {
            throw new RuntimeException('PHP ZipArchive extension is required.');
        }

        $inspection = $this->inspect();
        $zip = new ZipArchive();
        $opened = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        if ($opened !== true) {
            throw new RuntimeException('Could not create export ZIP.');
        }

        try {
            $manifestFiles = [];
            foreach ($inspection['files'] as $file) {
                $zip->addFromString($file['archive_path'], $file['content']);
                $manifestFile = $file;
                unset($manifestFile['absolute_path'], $manifestFile['content']);
                $manifestFiles[] = $manifestFile;
            }

            $database = $this->databaseSnapshot();
            if ($database['schema_sql'] !== '') {
                $zip->addFromString('database/schema.sql', $database['schema_sql']);
            }
            $zip->addFromString(
                'database/summary.json',
                json_encode($database['summary'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n"
            );

            $manifest = [
                'format_version' => 1,
                'generated_utc' => gmdate('c'),
                'account_root_hash' => hash('sha256', realpath($this->accountRoot) ?: $this->accountRoot),
                'files' => $manifestFiles,
                'missing_targets' => $inspection['missing'],
                'skipped_files' => $inspection['skipped'],
                'total_original_bytes' => $inspection['total_original_bytes'],
                'total_exported_bytes' => $inspection['total_exported_bytes'],
                'database' => $database['summary'],
                'security' => [
                    'configuration_files_excluded' => true,
                    'source_redaction_applied' => true,
                    'row_data_exported' => false,
                ],
            ];
            $zip->addFromString(
                'manifest.json',
                json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n"
            );
            $zip->addFromString(
                'README.txt',
                "Rowdy Room live PHP queue source export\n"
                . "Configuration files and row data are excluded. Embedded secrets are redacted.\n"
                . "Verify every exported_sha256 in manifest.json before importing to GitHub.\n"
            );
        } finally {
            $zip->close();
        }

        return $manifest;
    }

    public function redact(string $content): string
    {
        $redacted = preg_replace(
            '/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/',
            '[REDACTED_JWT]',
            $content
        ) ?? $content;

        $secretNames = '(?:password|passwd|pass|secret|token|api[_-]?key|admin[_-]?key|client[_-]?secret|private[_-]?key)';
        $patterns = [
            '/([\'\"]?' . $secretNames . '[\'\"]?\s*=>\s*)([\'\"])(.*?)(\2)/i',
            '/(\b' . $secretNames . '\b\s*[:=]\s*)([\'\"])(.*?)(\2)/i',
            '/(\b(?:DB_PASSWORD|MYSQL_PASSWORD|DATABASE_PASSWORD|OPENAI_API_KEY|ANTHROPIC_API_KEY|XAI_API_KEY|ADMIN_KEY|WEBHOOK_SECRET)\s*=\s*)([^\r\n]+)/i',
            '/(mysql:\s*host=[^;\r\n]+;[^\r\n]*?password=)([^;\s\r\n]+)/i',
        ];
        foreach ($patterns as $pattern) {
            $redacted = preg_replace_callback(
                $pattern,
                static function (array $match): string {
                    if (count($match) >= 5 && ($match[2] === "'" || $match[2] === '"')) {
                        return $match[1] . $match[2] . '[REDACTED]' . $match[4];
                    }
                    return $match[1] . '[REDACTED]';
                },
                $redacted
            ) ?? $redacted;
        }
        return $redacted;
    }

    /** @return array{schema_sql:string,summary:array<string,mixed>} */
    private function databaseSnapshot(): array
    {
        if ($this->pdo === null) {
            return [
                'schema_sql' => '',
                'summary' => ['connected' => false, 'reason' => 'No read-only PDO configuration supplied.'],
            ];
        }

        $tables = [
            'queue_entries', 'performances', 'votes', 'performer_requests',
            'memory_requests', 'bp_ledger', 'memory_deliveries', 'game_events',
            'team_lifeline_uses', 'webhook_events', 'admin_users', 'admin_sessions', 'admin_actions',
        ];
        $schemaParts = [];
        $available = [];
        $counts = [];

        foreach ($tables as $table) {
            try {
                $stmt = $this->pdo->query('SHOW CREATE TABLE `' . $table . '`');
                $row = $stmt?->fetch(PDO::FETCH_NUM);
                if ($row && isset($row[1])) {
                    $available[] = $table;
                    $schemaParts[] = '-- ' . $table . "\n" . rtrim((string) $row[1], ';') . ";\n";
                    $countStmt = $this->pdo->query('SELECT COUNT(*) FROM `' . $table . '`');
                    $counts[$table] = (int) ($countStmt?->fetchColumn() ?: 0);
                }
            } catch (Throwable) {
                // A missing or unauthorized table is recorded by omission.
            }
        }

        return [
            'schema_sql' => implode("\n", $schemaParts),
            'summary' => [
                'connected' => true,
                'tables_available' => $available,
                'row_counts' => $counts,
                'row_data_exported' => false,
            ],
        ];
    }

    /** @return list<string> */
    private function walkDirectory(string $directory): array
    {
        $paths = [];
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS)
        );
        foreach ($iterator as $file) {
            if ($file->isFile() && !$file->isLink()) {
                $real = $file->getRealPath();
                if ($real !== false && $this->isInsideRoot($real)) {
                    $paths[] = $real;
                }
            }
        }
        sort($paths);
        return $paths;
    }

    private function resolveInsideRoot(string $relative): ?string
    {
        if ($relative === '' || str_contains($relative, "\0") || str_starts_with($relative, '/')) {
            return null;
        }
        $root = realpath($this->accountRoot);
        if ($root === false) {
            return null;
        }
        $candidate = $root . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $relative);
        $real = realpath($candidate);
        if ($real === false || !$this->isInsideRoot($real)) {
            return null;
        }
        return $real;
    }

    private function isInsideRoot(string $path): bool
    {
        $root = rtrim((string) realpath($this->accountRoot), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        $candidate = rtrim($path, DIRECTORY_SEPARATOR) . (is_dir($path) ? DIRECTORY_SEPARATOR : '');
        return str_starts_with($candidate, $root);
    }

    private function relativePath(string $path): string
    {
        $root = rtrim((string) realpath($this->accountRoot), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        return str_replace(DIRECTORY_SEPARATOR, '/', substr($path, strlen($root)));
    }

    private function skipReason(string $path): ?string
    {
        $basename = strtolower(basename($path));
        if (in_array($basename, $this->forbiddenBasenames, true)) {
            return 'forbidden_configuration_file';
        }
        if (str_starts_with($basename, '.env')) {
            return 'forbidden_environment_file';
        }
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedExtensions, true)) {
            return 'unsupported_extension';
        }
        return null;
    }
}
