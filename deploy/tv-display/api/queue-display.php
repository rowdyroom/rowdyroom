<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

const ROWDY_QUEUE_URL = 'https://rowdyroom.site/api/companion/bootstrap?user_id=viewer';

function respond(int $status, array $payload): never {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function rowText(mixed $value): string {
    return is_scalar($value) ? trim((string) $value) : '';
}

function displayName(array $row, string $fallback): string {
    return rowText($row['tiktok_username'] ?? null) ?: $fallback;
}

function displaySong(array $row): array {
    return [
        'song_title' => rowText($row['song_title'] ?? null),
        'artist' => rowText($row['artist'] ?? null),
    ];
}

function isPlaceholder(array $row): bool {
    $name = strtolower(rowText($row['tiktok_username'] ?? null));
    $userId = strtolower(rowText($row['user_id'] ?? null));
    return in_array($name, ['@mainstage', '@singername', '@nextsinger', '@ondeck', '@rowdyguest', '@guest', '@waiting'], true)
        || in_array($userId, ['mainstage', 'singer', 'next', 'deck', 'waiting', 'guest', 'rowdyguest', 'late'], true);
}

if (!function_exists('curl_init')) {
    respond(503, ['ok' => false, 'error' => 'Queue display is unavailable.']);
}

$curl = curl_init(ROWDY_QUEUE_URL);
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
    CURLOPT_USERAGENT => 'RowdyRoomTVDisplay/2026-07-22',
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);
$body = curl_exec($curl);
$status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);

if (!is_string($body) || $status !== 200) {
    respond(503, ['ok' => false, 'error' => 'Queue display is unavailable.']);
}

$source = json_decode($body, true);
if (!is_array($source) || empty($source['ok'])) {
    respond(503, ['ok' => false, 'error' => 'Queue display is unavailable.']);
}

$sourceRows = $source['queue']['queue'] ?? [];
$queue = [];
if (is_array($sourceRows)) {
    foreach ($sourceRows as $row) {
        if (!is_array($row) || isPlaceholder($row)) {
            continue;
        }
        $position = filter_var($row['position'] ?? null, FILTER_VALIDATE_INT);
        $queue[] = array_merge([
            'position' => $position === false ? null : $position,
            'display_name' => displayName($row, $position === false ? 'Guest' : 'Guest #' . $position),
            'status' => rowText($row['status'] ?? null),
        ], displaySong($row));
    }
}

$performance = $source['current_performance']['performance'] ?? null;
$current = null;
if (is_array($performance)) {
    $current = array_merge([
        'display_name' => displayName($performance, 'Current Performer'),
    ], displaySong($performance));
}

$estimate = $source['estimated_wait_minutes']
    ?? $source['queue']['estimated_wait_minutes']
    ?? $source['wait_minutes']
    ?? null;

respond(200, [
    'ok' => true,
    'queue' => $queue,
    'current_performance' => $current,
    'estimated_wait_minutes' => is_numeric($estimate) ? (float) $estimate : null,
    'queue_updated_at' => gmdate('c'),
]);
