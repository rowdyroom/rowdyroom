<?php
declare(strict_types=1);

/*
 * One-use cPanel patcher for the existing https://tv.rowdyroom.site/ display.
 * Upload beside public_html/index.html, visit it once, then delete it.
 * It makes a dated backup under the account-home rowdyroom_backups folder.
 */

const TV_URL = 'https://tv.rowdyroom.site/';
const MARKER = 'data-rowdy-tv-display-link';

function report(string $message, string $kind = 'ok'): void {
    $color = $kind === 'error' ? '#b91c1c' : ($kind === 'warn' ? '#92400e' : '#166534');
    echo '<li style="color:' . $color . '">' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</li>';
}

function writeAtomic(string $path, string $content): void {
    $temporary = $path . '.rowdy-tv-link-' . bin2hex(random_bytes(6)) . '.tmp';
    if (file_put_contents($temporary, $content, LOCK_EX) === false || !rename($temporary, $path)) {
        @unlink($temporary);
        throw new RuntimeException('Could not write ' . basename($path) . '.');
    }
}

function replaceExactlyOnce(string $source, string $needle, string $replacement, string $label): string {
    if (substr_count($source, $needle) !== 1) {
        throw new RuntimeException($label . ' marker was not found exactly once. No files were changed.');
    }
    return str_replace($needle, $replacement, $source);
}

function patchHomepage(string $source): string {
    if (str_contains($source, MARKER)) {
        return $source;
    }
    $grid = 'grid-template-columns:1fr 1fr 1fr;';
    $source = replaceExactlyOnce($source, $grid, 'grid-template-columns:repeat(4,minmax(0,1fr));', 'Homepage sticky-grid');
    $boost = '<a class="btn boost" href="/companion/#boost"><span>Boost<br/>Points</span></a>';
    $tv = $boost . "\n        <a class=\"btn vote\" " . MARKER . " href=\"" . TV_URL . "\" target=\"_blank\" rel=\"noopener\"><span>TV<br/>Display</span></a>";
    return replaceExactlyOnce($source, $boost, $tv, 'Homepage Boost Points button');
}

function patchMissionControl(string $source): string {
    if (str_contains($source, MARKER)) {
        return $source;
    }
    $buzzer = '<a href="/rumble-buzzer/?overlay=1" target="_blank">Buzzer Overlay</a>';
    $tv = $buzzer . "<a " . MARKER . " href=\"" . TV_URL . "\" target=\"_blank\" rel=\"noopener\">TV Display</a>";
    return replaceExactlyOnce($source, $buzzer, $tv, 'Mission Control display list');
}

echo '<!doctype html><meta charset="utf-8"><title>Rowdy Room TV Display Link Repair</title>';
echo '<main style="max-width:760px;margin:40px auto;font-family:system-ui"><h1>Rowdy Room TV Display Link Repair</h1>';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    echo '<p>This adds a <strong>TV Display</strong> link to the public homepage and Mission Control. It does not alter the TV page, Rumble, or queue data.</p>';
    echo '<form method="post"><button type="submit" style="font-size:18px;padding:12px 18px">Back up and install TV Display links</button></form>';
    echo '<p>Delete this installer after a successful run.</p></main>';
    exit;
}

$root = __DIR__;
$targets = [
    $root . '/index.html' => 'patchHomepage',
    $root . '/mission-control/index.html' => 'patchMissionControl',
];
$backup = dirname($root) . '/rowdyroom_backups/tv-display-link-repair-' . gmdate('Ymd-His');

echo '<ul>';
try {
    foreach ($targets as $path => $patcher) {
        if (!is_file($path) || !is_readable($path) || !is_writable($path)) {
            throw new RuntimeException('Required target is unavailable: ' . $path);
        }
    }
    if (!mkdir($backup, 0700, true) && !is_dir($backup)) {
        throw new RuntimeException('Could not create the private backup folder.');
    }
    foreach ($targets as $path => $patcher) {
        $source = file_get_contents($path);
        if ($source === false) {
            throw new RuntimeException('Could not read ' . basename($path) . '.');
        }
        if (file_put_contents($backup . '/' . basename(dirname($path)) . '-' . basename($path), $source, LOCK_EX) === false) {
            throw new RuntimeException('Could not back up ' . basename($path) . '.');
        }
        $updated = $patcher($source);
        writeAtomic($path, $updated);
        $readback = file_get_contents($path);
        if ($readback === false || !str_contains($readback, MARKER) || !str_contains($readback, TV_URL)) {
            throw new RuntimeException('Readback verification failed for ' . basename($path) . '.');
        }
        report(basename($path) . ' patched and verified.');
    }
    report('Backup created outside public_html: ' . $backup);
    report('Open the homepage and Mission Control, verify both TV Display links open ' . TV_URL . ', then delete this installer.');
} catch (Throwable $error) {
    report($error->getMessage(), 'error');
    report('Stop here. Restore any changed target from the backup before retrying.', 'warn');
}

echo '</ul></main>';
