<?php
declare(strict_types=1);

require_once __DIR__ . '/RowdySourceExporter.php';

function rr_assert(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

function rr_temp_dir(): string
{
    $dir = sys_get_temp_dir() . '/rowdy-export-test-' . bin2hex(random_bytes(6));
    mkdir($dir, 0777, true);
    return $dir;
}

function rr_write(string $root, string $relative, string $content): void
{
    $path = $root . '/' . $relative;
    if (!is_dir(dirname($path))) {
        mkdir(dirname($path), 0777, true);
    }
    file_put_contents($path, $content);
}

function rr_remove_tree(string $path): void
{
    if (!is_dir($path)) {
        @unlink($path);
        return;
    }
    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($it as $file) {
        $file->isDir() ? rmdir($file->getPathname()) : unlink($file->getPathname());
    }
    rmdir($path);
}

$root = rr_temp_dir();
try {
    rr_write($root, 'src/QueueService.php', "<?php\n\$password = 'bad-secret';\n\$jwt='eyJabcdefghijk.eyJabcdefghijk.abcdefghijklm';\n");
    rr_write($root, 'src/config.php', "<?php return ['password'=>'must-not-export'];");
    rr_write($root, 'src/logo.png', 'binary');
    rr_write($root, 'public_html/api/index.php', "<?php\n\$api_key = \"top-secret\";\n");
    rr_write($root, 'public_html/companion/app.js', "const token = 'secret-token';\n");
    rr_write($root, 'outside.txt', 'not targeted');

    $targets = ['src', 'public_html/api/index.php', 'public_html/companion', '../outside'];
    $exporter = new RowdySourceExporter($root, $targets);
    $inspection = $exporter->inspect();
    $paths = array_column($inspection['files'], 'relative_path');

    rr_assert(in_array('src/QueueService.php', $paths, true), 'Queue source was not collected.');
    rr_assert(in_array('public_html/api/index.php', $paths, true), 'API source was not collected.');
    rr_assert(in_array('public_html/companion/app.js', $paths, true), 'Companion source was not collected.');
    rr_assert(!in_array('src/config.php', $paths, true), 'Forbidden config file was exported.');
    rr_assert(!in_array('src/logo.png', $paths, true), 'Unsupported binary was exported.');
    rr_assert(!in_array('outside.txt', $paths, true), 'Path traversal escaped the account root.');

    $queueFile = array_values(array_filter(
        $inspection['files'],
        static fn(array $file): bool => $file['relative_path'] === 'src/QueueService.php'
    ))[0];
    rr_assert(!str_contains($queueFile['content'], 'bad-secret'), 'Password was not redacted.');
    rr_assert(!str_contains($queueFile['content'], 'eyJabcdefghijk'), 'JWT was not redacted.');
    rr_assert($queueFile['redacted'] === true, 'Redaction flag was not set.');

    if (class_exists(ZipArchive::class)) {
        $zipPath = $root . '/export.zip';
        $manifest = $exporter->exportToZip($zipPath);
        rr_assert(is_file($zipPath), 'ZIP was not created.');
        rr_assert(count($manifest['files']) === 3, 'Unexpected exported file count.');
        rr_assert($manifest['security']['row_data_exported'] === false, 'Manifest incorrectly reports row data.');

        $zip = new ZipArchive();
        rr_assert($zip->open($zipPath) === true, 'ZIP could not be reopened.');
        rr_assert($zip->locateName('manifest.json') !== false, 'Manifest missing from ZIP.');
        rr_assert($zip->locateName('source/src/config.php') === false, 'Config file found in ZIP.');
        $exportedQueue = $zip->getFromName('source/src/QueueService.php');
        rr_assert(is_string($exportedQueue) && str_contains($exportedQueue, '[REDACTED]'), 'Redacted source missing from ZIP.');
        rr_assert(!str_contains((string) $exportedQueue, 'bad-secret'), 'Secret leaked into ZIP.');
        $zip->close();
    } else {
        echo "ZipArchive unavailable locally; archive assertions skipped.\n";
    }

    $custom = $exporter->redact("ADMIN_KEY=abc123\n'client_secret' => 'hello'\n");
    rr_assert(!str_contains($custom, 'abc123'), 'Environment secret was not redacted.');
    rr_assert(!str_contains($custom, 'hello'), 'Array secret was not redacted.');

    echo "RowdySourceExporterTest: core assertions passed.\n";
} finally {
    rr_remove_tree($root);
}
