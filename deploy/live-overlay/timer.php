<?php
declare(strict_types=1);
header('Cache-Control: no-store, max-age=0');
header('Content-Type: application/json; charset=utf-8');
function timer_reply(array $body, int $status=200): void {
    http_response_code($status); echo json_encode($body, JSON_UNESCAPED_SLASHES); exit;
}
function rowdy_require_queue_host_key(): void
{
    $provided = trim((string)($_SERVER['HTTP_X_ROWDY_HOST_KEY'] ?? ''));
    if ($provided === '') {
        timer_reply(['ok' => false, 'error' => 'Unauthorized host action'], 401);
    }

    $endpoint = 'https://szubjgpvlqliyparrnam.supabase.co/rest/v1/rpc/rr_admin_ping';
    $publicKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dWJqZ3B2bHFsaXlwYXJybmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MzUyODgsImV4cCI6MjA5NDUxMTI4OH0.j4hmiRxlRDiS-RYUIlwi1oGzuh4EQfFd5mEJqVyqH4s';
    if (!function_exists('curl_init')) {
        timer_reply(['ok' => false, 'error' => 'Host validation unavailable'], 503);
    }
    $curl = curl_init($endpoint);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'apikey: ' . $publicKey,
            'Authorization: Bearer ' . $publicKey,
        ],
        CURLOPT_POSTFIELDS => json_encode(['p_admin_key' => $provided]),
    ]);
    $body = curl_exec($curl);
    $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    $decoded = json_decode((string)$body, true);
    if ($status !== 200 || !is_array($decoded) || ($decoded['ok'] ?? false) !== true) {
        timer_reply(['ok' => false, 'error' => 'Unauthorized host action'], 401);
    }
}


$method=$_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method,['GET','POST'],true)) timer_reply(['ok'=>false,'error'=>'Method not allowed'],405);
if ($method==='POST') {
    $timerRaw=file_get_contents('php://input') ?: '';
    if(strlen($timerRaw)>512) timer_reply(['ok'=>false,'error'=>'Invalid timer request'],400);
    if(trim((string)($_SERVER['HTTP_X_ROWDY_HOST_KEY'] ?? '')) !== '') {
        rowdy_require_queue_host_key();
    } else {
        $signedInput=json_decode($timerRaw,true);
        if(!is_array($signedInput) || ($signedInput['scope'] ?? '')!=='rowdy-vote-timer-v1')
            timer_reply(['ok'=>false,'error'=>'Unauthorized timer action'],401);
        require_once __DIR__.'/../../src/Database.php';
        require_once __DIR__.'/../../src/ShowBPService.php';
        try {
            $timerConfig=require __DIR__.'/../../config/config.php';
            $timerVerifier=new ShowBPService(new Database($timerConfig['db']),'');
            $verified=$timerVerifier->verifyTikFinity($timerRaw,(string)($_SERVER['HTTP_X_ROWDY_TIMESTAMP'] ?? ''),(string)($_SERVER['HTTP_X_ROWDY_SIGNATURE'] ?? ''));
        } catch(Throwable $e) { timer_reply(['ok'=>false,'error'=>'Timer authentication unavailable'],503); }
        if(!$verified) timer_reply(['ok'=>false,'error'=>'Unauthorized timer action'],401);
    }
}
// Outside public_html; holds only the show countdown, never a host credential.
$file=__DIR__.'/../../rowdyroom_tools/voting-timer.json';
$handle=fopen($file,'c+');
if (!$handle || !flock($handle,LOCK_EX)) timer_reply(['ok'=>false,'error'=>'Timer unavailable'],503);
$stored=stream_get_contents($handle);
$state=json_decode($stored ?: '{}',true);
if (!is_array($state)) $state=[];
$state=['visible'=>(bool)($state['visible'] ?? false),'ends_at'=>(float)($state['ends_at'] ?? 0)];
if ($method==='POST') {
    $input=json_decode($timerRaw,true);
    $command=is_array($input) ? ($input['command'] ?? '') : '';
    if (!in_array($command,['start','hide'],true)) {
        flock($handle,LOCK_UN); fclose($handle);
        timer_reply(['ok'=>false,'error'=>'Use start or hide'],400);
    }
    $state=['visible'=>$command==='start','ends_at'=>$command==='start' ? microtime(true)+60 : 0];
    rewind($handle); ftruncate($handle,0);
    if (fwrite($handle,json_encode($state))===false) {
        flock($handle,LOCK_UN); fclose($handle); timer_reply(['ok'=>false,'error'=>'Timer could not be saved'],503);
    }
    fflush($handle);
}
flock($handle,LOCK_UN); fclose($handle);
timer_reply(['ok'=>true,'timer'=>$state,'server_now'=>microtime(true)]);
