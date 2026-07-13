<?php
declare(strict_types=1);

if ($argc !== 3) {
    fwrite(STDERR, "Usage: php tools/server/verify-source-export.php <export.zip> <output-directory>\n");
    exit(2);
}
if (!class_exists(ZipArchive::class)) {
    fwrite(STDERR, "ZipArchive is required.\n");
    exit(1);
}

[$script, $zipPath, $outputDirectory] = $argv;
$zip = new ZipArchive();
if ($zip->open($zipPath) !== true) {
    fwrite(STDERR, "Could not open export ZIP.\n");
    exit(1);
}

try {
    $manifestRaw = $zip->getFromName('manifest.json');
    if (!is_string($manifestRaw)) {
        throw new RuntimeException('manifest.json is missing.');
    }
    $manifest = json_decode($manifestRaw, true, 512, JSON_THROW_ON_ERROR);
    if (($manifest['format_version'] ?? null) !== 1 || !is_array($manifest['files'] ?? null)) {
        throw new RuntimeException('Unsupported or malformed manifest.');
    }
    if (($manifest['security']['row_data_exported'] ?? null) !== false) {
        throw new RuntimeException('Export claims to contain row data; refusing import.');
    }

    $forbidden = ['config.php', 'config.local.php', 'secrets.php', 'credentials.php', 'database.php', '.env', '.htpasswd'];
    $verified = [];
    foreach ($manifest['files'] as $file) {
        $archivePath = (string) ($file['archive_path'] ?? '');
        $relativePath = (string) ($file['relative_path'] ?? '');
        $expectedHash = strtolower((string) ($file['exported_sha256'] ?? ''));

        if (!str_starts_with($archivePath, 'source/') || $relativePath === '') {
            throw new RuntimeException('Manifest contains an invalid source path.');
        }
        if (str_contains($archivePath, '..') || str_contains($relativePath, '..') || str_starts_with($relativePath, '/')) {
            throw new RuntimeException('Manifest contains path traversal.');
        }
        if (in_array(strtolower(basename($relativePath)), $forbidden, true) || str_starts_with(strtolower(basename($relativePath)), '.env')) {
            throw new RuntimeException('Manifest contains a forbidden configuration file: ' . $relativePath);
        }
        if (!preg_match('/^[a-f0-9]{64}$/', $expectedHash)) {
            throw new RuntimeException('Manifest contains an invalid SHA-256 hash.');
        }

        $content = $zip->getFromName($archivePath);
        if (!is_string($content)) {
            throw new RuntimeException('Archive entry is missing: ' . $archivePath);
        }
        if (!hash_equals($expectedHash, hash('sha256', $content))) {
            throw new RuntimeException('SHA-256 mismatch: ' . $relativePath);
        }
        $verified[] = ['relative_path' => $relativePath, 'content' => $content];
    }

    $outputRoot = rtrim($outputDirectory, DIRECTORY_SEPARATOR);
    if (!is_dir($outputRoot) && !mkdir($outputRoot, 0775, true) && !is_dir($outputRoot)) {
        throw new RuntimeException('Could not create output directory.');
    }
    $realOutput = realpath($outputRoot);
    if ($realOutput === false) {
        throw new RuntimeException('Could not resolve output directory.');
    }

    foreach ($verified as $file) {
        $destination = $realOutput . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $file['relative_path']);
        $directory = dirname($destination);
        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException('Could not create import directory.');
        }
        file_put_contents($destination, $file['content'], LOCK_EX);
    }

    file_put_contents(
        $realOutput . DIRECTORY_SEPARATOR . 'RECOVERED_SOURCE_MANIFEST.json',
        json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n",
        LOCK_EX
    );

    echo json_encode([
        'ok' => true,
        'verified_files' => count($verified),
        'output_directory' => $realOutput,
        'generated_utc' => $manifest['generated_utc'] ?? null,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
} catch (Throwable $error) {
    fwrite(STDERR, $error->getMessage() . "\n");
    exit(1);
} finally {
    $zip->close();
}
