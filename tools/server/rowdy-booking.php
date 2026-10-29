<?php
declare(strict_types=1);
ini_set('session.use_strict_mode','1');
session_set_cookie_params(['httponly'=>true,'secure'=>true,'samesite'=>'Lax','path'=>'/']);
session_start();
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'self'");
date_default_timezone_set('America/Chicago');
if (empty($_SESSION['booking_csrf'])) $_SESSION['booking_csrf']=bin2hex(random_bytes(24));
function esc(string $v):string{return htmlspecialchars($v,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
function field(string $name,int $limit=300):string{return substr(trim((string)($_POST[$name]??'')),0,$limit);}
$error='';$sent=false;$reference='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    if (!hash_equals($_SESSION['booking_csrf'],field('csrf',100))) {
        http_response_code(400);$error='Your form expired. Please refresh this page and try again.';
    } elseif (field('company_website')!=='') {
        http_response_code(400);$error='Your request could not be sent. Please email rowdyroom@gmail.com.';
    } elseif (time()-(int)($_SESSION['booking_last_sent']??0)<60) {
        http_response_code(429);$error='Please wait one minute before sending another request.';
    } else {
        $name=field('name',120);$email=field('email',254);$phone=field('phone',80);
        $date=field('event_date',10);$venue=field('venue',250);$start=field('start',5);$end=field('end',5);
        $services=$_POST['services']??[];
        $allowed=['DJ','Karaoke','Event hosting','Crowd games'];
        $services=is_array($services)?array_values(array_intersect($allowed,array_filter($services,'is_string'))):[];
        $validDate=DateTimeImmutable::createFromFormat('!Y-m-d',$date);
        $validTime=fn($v)=>preg_match('/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/',$v)===1;
        if ($name===''||!filter_var($email,FILTER_VALIDATE_EMAIL)||preg_match('/[\r\n]/',$email)||$phone===''||$venue===''||!$services||!$validDate||$validDate->format('Y-m-d')!==$date||$date<date('Y-m-d')||!$validTime($start)||!$validTime($end)) {
            http_response_code(422);$error='Please complete your name, valid email, phone, future event date, location, start/end times, and at least one service.';
        } else {
            $reference='RR-'.date('Ymd').'-'.strtoupper(bin2hex(random_bytes(3)));
            $body="Rowdy Room booking inquiry $reference\n\nName: $name\nEmail: $email\nPhone: $phone\nEvent date: $date\nVenue/location: $venue\nStart: $start\nEnd: $end\nTimes: America/Chicago; an earlier end time means the following day.\nServices: ".implode(', ',$services)."\nEvent type: ".field('event_type',120)."\nGuests: ".field('guests',30)."\nSetting: ".field('setting',30)."\nEquipment needs: ".field('equipment',1000)."\nNotes: ".field('notes',3000)."\n\nDisplayed base minimum: $75/hour. Final quote and availability require Roger's confirmation. This is an inquiry, not a reserved date.\n";
            $headers=['From: Rowdy Room Bookings <bookings@rowdyroom.site>','Reply-To: '.$email,'Content-Type: text/plain; charset=UTF-8','MIME-Version: 1.0'];
            $ok=function_exists('mail')&&@mail('rowdyroom@gmail.com','Rowdy Room booking inquiry '.$reference,$body,implode("\r\n",$headers),'-fbookings@rowdyroom.site');
            if ($ok) {$_SESSION['booking_last_sent']=time();$_SESSION['booking_csrf']=bin2hex(random_bytes(24));$sent=true;}
            else {http_response_code(503);$error='The request could not be sent. Please email rowdyroom@gmail.com with your event details. Your date has not been reserved.';}
        }
    }
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Book DJ Rowdy | Rowdy Room</title><meta name="description" content="Request DJ, karaoke and event hosting with Roger at Rowdy Room in Rolla, Missouri."><style>
:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#090c16;color:#f5f6fc}*{box-sizing:border-box}body{margin:0}main{max-width:820px;margin:auto;padding:32px 20px 60px}a{color:#b9d8ff}header{margin-bottom:24px}h1{font-size:clamp(2rem,6vw,3rem);margin:12px 0}p{line-height:1.55;color:#d2d8e7}.card{background:#141b2b;border:1px solid #35415c;border-radius:18px;padding:24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}label,legend{font-weight:650}label{display:block}input,select,textarea{display:block;width:100%;margin:7px 0 0;padding:12px;border-radius:8px;border:1px solid #65708a;background:#0b1120;color:#fff;font:inherit}input:focus,textarea:focus,select:focus{outline:3px solid #e6b54b}fieldset{margin:22px 0;border:1px solid #46516b;border-radius:10px;padding:16px}.checks{display:flex;gap:16px;flex-wrap:wrap}.checks label{font-weight:450;display:flex;align-items:center;gap:7px}.checks input{display:inline;width:auto;margin:0}.full{grid-column:1/-1}button{font:700 1rem system-ui;background:#ffce63;color:#161100;border:0;border-radius:9px;padding:15px 22px;cursor:pointer}.notice{padding:16px;border-radius:10px;background:#162c31;border:1px solid #5d9c8b}.error{background:#3b1d2a;border-color:#ff829e}.small{font-size:.9rem}.trap{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}@media(max-width:600px){.grid{grid-template-columns:1fr}.card{padding:18px}}
</style></head><body><main><header><a href="/">← Rowdy Room</a><h1>Book DJ Rowdy</h1><p>DJ, karaoke, event hosting and crowd games · Rolla, Missouri and surrounding areas.</p><p><strong>Base minimum: $75 per hour.</strong> Final pricing depends on your event, equipment, travel and setup needs. Roger confirms the quote and availability before a booking is accepted.</p></header>
<?php if($sent): ?><section class="card"><h2>Your inquiry was submitted</h2><p>Reference: <strong><?=esc($reference)?></strong></p><p>Roger will review your event and reply using the contact details you supplied. This submission does not reserve your date. If you do not receive a reply, contact <a href="mailto:rowdyroom@gmail.com">rowdyroom@gmail.com</a> and include your reference.</p><a href="/booking.php">Request another event</a></section>
<?php else: ?>
<?php if($error): ?><p class="notice error" role="alert"><?=esc($error)?></p><?php endif ?>
<form class="card" method="post" action="/booking.php"><input type="hidden" name="csrf" value="<?=esc($_SESSION['booking_csrf'])?>"><div class="trap" aria-hidden="true"><label>Leave this blank<input name="company_website" tabindex="-1" autocomplete="off"></label></div>
<div class="grid"><label>Your name *<input name="name" maxlength="120" autocomplete="name" value="<?=esc(field('name',120))?>" required></label><label>Email *<input type="email" name="email" maxlength="254" autocomplete="email" value="<?=esc(field('email',254))?>" required></label><label>Phone *<input type="tel" name="phone" maxlength="80" autocomplete="tel" value="<?=esc(field('phone',80))?>" required></label><label>Event date *<input type="date" name="event_date" min="<?=date('Y-m-d')?>" value="<?=esc(field('event_date',10))?>" required></label><label class="full">Venue / event address *<input name="venue" maxlength="250" value="<?=esc(field('venue',250))?>" required></label><label>Start time *<input type="time" name="start" value="<?=esc(field('start',5))?>" required></label><label>End time *<input type="time" name="end" value="<?=esc(field('end',5))?>" required></label></div><p class="small">Times are Central Time. An end time earlier than the start time means the event finishes the next day.</p>
<fieldset><legend>Services needed *</legend><div class="checks"><?php foreach(['DJ','Karaoke','Event hosting','Crowd games'] as $service): ?><label><input type="checkbox" name="services[]" value="<?=esc($service)?>" <?=in_array($service,(array)($_POST['services']??[]),true)?'checked':''?>><?=esc($service)?></label><?php endforeach ?></div></fieldset>
<div class="grid"><label>Event type<input name="event_type" placeholder="Venue night, wedding, birthday, company event…" maxlength="120" value="<?=esc(field('event_type',120))?>"></label><label>Estimated guests<input name="guests" type="number" min="1" max="100000" value="<?=esc(field('guests',30))?>"></label><label>Indoor / outdoor<select name="setting"><option value="">Select or leave open</option><option>Indoor</option><option>Outdoor</option><option>Both / unsure</option></select></label><label>Sound equipment needed?<input name="equipment" placeholder="Describe what is provided or needed" maxlength="1000" value="<?=esc(field('equipment',1000))?>"></label><label class="full">Event details / announcements<textarea name="notes" maxlength="3000" rows="4"><?=esc(field('notes',3000))?></textarea></label></div><p class="small">By sending, you ask Roger to contact you about this event. The request is emailed to Rowdy Room. Please do not include payment-card details or other sensitive information.</p><button type="submit">Send booking request</button><p class="small">Prefer email? <a href="mailto:rowdyroom@gmail.com?subject=Rowdy%20Room%20booking%20inquiry">rowdyroom@gmail.com</a></p></form><?php endif ?></main></body></html>
