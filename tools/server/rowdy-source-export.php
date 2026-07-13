<?php
declare(strict_types=1);

require_once __DIR__ . '/RowdySourceExporter.php';

header('Cache-Control: no-store, max-age=0');
header('Pragma: no-cache');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('X-Content-Type-Options: nosniff');

function rr_fail(int $status, string $message): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_SLASHES) . "\n";
    exit;
}

$accountRoot = realpath(dirname(__DIR__, 3));
if ($accountRoot === false) {
    rr_fail(500, 'Could not resolve the hosting account root.');
}

$configPath = $accountRoot . '/.rowdy-source-export.php';
if (!is_file($configPath)) {
    rr_fail(503, 'Missing account-root .rowdy-source-export.php configuration.');
}
$config = require $configPath;
if (!is_array($config)) {
    rr_fail(500, 'Export configuration must return an array.');
}

$maxAge = max(300, (int) ($config['max_age_seconds'] ?? 7200));
$configAge = time() - (int) filemtime($configPath);
if ($configAge > $maxAge) {
    rr_fail(410, 'Export configuration expired. Re-save the account-root config to reactivate it.');
}

$providedToken = (string) ($_SERVER['HTTP_X_ROWDY_EXPORT_TOKEN'] ?? $_POST['token'] ?? $_GET['token'] ?? '');
$expectedHash = strtolower(trim((string) ($config['token_sha256'] ?? '')));
$plainToken = (string) ($config['token'] ?? '');

if ($providedToken === '') {
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>Rowdy Source Recovery</title><style>body{font-family:Arial;background:#090011;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0}.card{width:min(520px,92vw);padding:24px;border:1px solid #7c3aed;border-radius:20px;background:#160425}input,select,button{width:100%;box-sizing:border-box;padding:13px;margin-top:10px;border-radius:10px;font-size:16px}button{background:#7c3aed;color:#fff;border:0;font-weight:800}</style></head><body><form class="card" method="post"><h1>Rowdy Source Recovery</h1><p>The token is posted securely and is not placed in the URL.</p><input type="password" name="token" autocomplete="off" required placeholder="One-time export token"><select name="action"><option value="inspect">Inspect only</option><option value="export">Download redacted ZIP</option></select><button type="submit">Continue</button></form></body></html>';
    exit;
}

$tokenValid = false;
if (preg_match('/^[a-f0-9]{64}$/', $expectedHash)) {
    $tokenValid = hash_equals($expectedHash, hash('sha256', $providedToken));
} elseif ($plainToken !== '') {
    $tokenValid = hash_equals($plainToken, $providedToken);
}
if (!$tokenValid) {
    rr_fail(403, 'Invalid export token.');
}

$pdo = null;
if (!empty($config['db_dsn'])) {
    try {
        $pdo = new PDO(
            (string) $config['db_dsn'],
            (string) ($config['db_user'] ?? ''),
            (string) ($config['db_pass'] ?? ''),
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 5,
            ]
        );
    } catch (Throwable $error) {
        rr_fail(500, 'Read-only database connection failed: ' . $error->getMessage());
    }
}

$targets = isset($config['targets']) && is_array($config['targets']) ? $config['targets'] : null;
$exporter = new RowdySourceExporter($accountRoot, $targets, $pdo);
$action = strtolower((string) ($_POST['action'] ?? $_GET['action'] ?? 'inspect'));

if ($action === 'inspect') {
    $inspection = $exporter->inspect();
    $safeFiles = array_map(static function (array $file): array {
        unset($file['absolute_path'], $file['content']);
        return $file;
    }, $inspection['files']);
    $inspection['files'] = $safeFiles;
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => true, 'inspection' => $inspection], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    exit;
}

if ($action !== 'export') {
    rr_fail(400, 'Supported actions are inspect and export.');
}

$temp = tempnam(sys_get_temp_dir(), 'rowdy-source-');
if ($temp === false) {
    rr_fail(500, 'Could not allocate a temporary export file.');
}
$zipPath = $temp . '.zip';
@unlink($temp);

try {
    $manifest = $exporter->exportToZip($zipPath);
    $filename = 'rowdy-live-php-source-' . gmdate('Ymd-His') . '.zip';
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . (string) filesize($zipPath));
    header('X-Rowdy-File-Count: ' . count($manifest['files']));
    readfile($zipPath);
    if (($config['one_time'] ?? true) === true) {
        @unlink($configPath);
    }
} catch (Throwable $error) {
    rr_fail(500, 'Export failed: ' . $error->getMessage());
} finally {
    if (is_file($zipPath)) {
        @unlink($zipPath);
    }
}
