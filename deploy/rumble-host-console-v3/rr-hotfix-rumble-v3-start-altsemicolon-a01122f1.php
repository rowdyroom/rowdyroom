<?php
declare(strict_types=1);

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Robots-Tag: noindex, nofollow, noarchive', true);

const INSTALL_TOKEN = 'lPL922qDFwmImQuIuoU3loKflk6MefvtXu0_R7wKCS4';
const LOADER = '<script id="rowdy-rumble-host-console-v3" src="assets/rumble-host-console-v3.js?v=20260715d"></script>';

function out(string $title, string $message, int $status = 200): never {
    http_response_code($status);
    echo '<!doctype html><meta charset="utf-8"><title>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</title>';
    echo '<style>body{font:18px system-ui;background:#10131a;color:#fff;padding:40px;max-width:900px;margin:auto}h1{color:' . ($status === 200 ? '#86efac' : '#fca5a5') . '}pre{white-space:pre-wrap;background:#202634;padding:16px;border-radius:12px}</style>';
    echo '<h1>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</h1><pre>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</pre>';
    exit;
}

function replace_once(string $source, string $before, string $after, string $label): string {
    $count = substr_count($source, $before);
    if ($count !== 1) throw new RuntimeException($label . ': expected once, found ' . $count . '.');
    return str_replace($before, $after, $source);
}

function write_atomic(string $path, string $content): void {
    $tmp = $path . '.tmp-' . bin2hex(random_bytes(4));
    if (file_put_contents($tmp, $content, LOCK_EX) === false || !rename($tmp, $path)) {
        @unlink($tmp);
        throw new RuntimeException('Could not write ' . $path);
    }
}

function remove_loader(string $html): string {
    return preg_replace('~\s*<script\b(?=[^>]*\bid=["\']rowdy-rumble-host-console-v3["\'])[^>]*>\s*</script>\s*~i', "\n", $html) ?? $html;
}

$provided = isset($_GET['token']) ? (string) $_GET['token'] : '';
if (!hash_equals(INSTALL_TOKEN, $provided)) out('Repair blocked', 'Invalid or missing token.', 403);

$root = __DIR__;
$indexPath = $root . '/index.html';
$assetPath = $root . '/assets/rumble-host-console-v3.js';
if (!is_readable($indexPath) || !is_writable($indexPath) || !is_readable($assetPath) || !is_writable($assetPath)) {
    out('Repair failed', 'The live index or V3 asset is missing or not writable. No files were changed.', 500);
}

$index = file_get_contents($indexPath);
$asset = file_get_contents($assetPath);
if ($index === false || $asset === false || strpos($asset, 'rowdyRumbleHostConsoleV3') === false) {
    out('Repair failed', 'The installed V3 console could not be verified. No files were changed.', 500);
}

$home = dirname(dirname($root));
$backup = $home . '/rowdyroom_backups/rumble-v3-start-altsemicolon-' . gmdate('Ymd-His');
if (!is_dir($backup) && !mkdir($backup, 0700, true) && !is_dir($backup)) out('Repair failed', 'Could not create backup directory.', 500);
if (!copy($indexPath, $backup . '/index.html') || !copy($assetPath, $backup . '/rumble-host-console-v3.js')) {
    out('Repair failed', 'Could not create backup files. No files were changed.', 500);
}

try {
    if (strpos($asset, "const VERSION='3.0.2-hotfix';") === false) {
        $asset = replace_once($asset, "const VERSION='3.0.1';", "const VERSION='3.0.2-hotfix';", 'version');
        $asset = replace_once($asset, "    timerMouseLabel:'Mouse 5 / top side button',", "    timerMouseLabel:'Alt + ; · top mouse button',", 'timer label');
        $asset = replace_once(
            $asset,
            "    s.v3=mergeDefaults(s.v3,defaultV3());\n    s.v3.version=VERSION;",
            "    s.v3=mergeDefaults(s.v3,defaultV3());\n    s.v3.version=VERSION;\n    s.v3.timerMouseLabel='Alt + ; · top mouse button';",
            'saved timer label'
        );
        $asset = replace_once($asset, "function validateAndNormalizeTeams(){", "function validateAndNormalizeTeams(preserveOpening=false){", 'team validation signature');
        $asset = replace_once(
            $asset,
            "  v3.openingTeam='';v3.openingPlayer='';v3.openingIndex=0;v3.coinRevealAt=0;\n  return validation;",
            "  if(!preserveOpening){v3.openingTeam='';v3.openingPlayer='';v3.openingIndex=0;v3.coinRevealAt=0;}\n  return validation;",
            'preserve coin result'
        );
        $asset = replace_once(
            $asset,
            "function startMatchV3(){\n  const s=gameState(),v3=ensureV3();\n  validateAndNormalizeTeams();",
            "function startMatchV3(){\n  const s=gameState(),v3=ensureV3();\n  validateAndNormalizeTeams(true);",
            'start game'
        );
        $asset = replace_once(
            $asset,
            "function onKeydown(event){\n  if(location.hash!=='#host'||isTypingTarget(event.target)||event.repeat)return;\n  const key=String(event.key||'');const code=String(event.code||'');",
            "function onKeydown(event){\n  if(location.hash!=='#host'||isTypingTarget(event.target)||event.repeat)return;\n  const key=String(event.key||'');const code=String(event.code||'');\n  if(event.altKey&&!event.ctrlKey&&!event.metaKey&&(key===';'||key===':'||code==='Semicolon')){consume(event);guarded(()=>toggleActiveTimer());return;}",
            'Alt + semicolon timer shortcut'
        );
        $asset = replace_once(
            $asset,
            "  ['mousedown','mouseup','auxclick'].forEach((type)=>document.addEventListener(type,onMouseButton,true));\n",
            "",
            'remove direct mouse binding'
        );
    }

    write_atomic($assetPath, $asset);
    $index = remove_loader($index);
    $body = strripos($index, '</body>');
    if ($body === false) throw new RuntimeException('Final body tag not found.');
    $index = substr($index, 0, $body) . "\n" . LOADER . "\n" . substr($index, $body);
    write_atomic($indexPath, $index);

    $checkAsset = file_get_contents($assetPath);
    $checkIndex = file_get_contents($indexPath);
    foreach (["const VERSION='3.0.2-hotfix';", 'validateAndNormalizeTeams(true);', "key===';'||key===':'||code==='Semicolon'"] as $marker) {
        if ($checkAsset === false || strpos($checkAsset, $marker) === false) throw new RuntimeException('Verification failed: ' . $marker);
    }
    if ($checkIndex === false || substr_count($checkIndex, 'id="rowdy-rumble-host-console-v3"') !== 1 || strpos($checkIndex, 'v=20260715d') === false) {
        throw new RuntimeException('Loader verification failed.');
    }

    @unlink(__FILE__);
    out('Rumble V3 repair installed', "Fixed:\n- Alt + ; toggles timer pause/resume\n- Coin-flip winner and opening player are preserved\n- Start Match now progresses into the game\n\nBackup: " . $backup);
} catch (Throwable $e) {
    @copy($backup . '/index.html', $indexPath);
    @copy($backup . '/rumble-host-console-v3.js', $assetPath);
    out('Repair failed', $e->getMessage() . "\nRollback was attempted automatically.", 500);
}
