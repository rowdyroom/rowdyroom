/* Rowdy Room manual voting clock. Does not change vote acceptance or the queue. */
(() => {
  'use strict';
  const card=document.getElementById('votingClock');
  const value=document.getElementById('votingClockValue');
  const host=document.getElementById('votingTimerControls');
  const status=document.getElementById('votingTimerStatus');
  if (!card && !host) return;
  let timer={visible:false,ends_at:0}, offset=0, lastSuccess=0, busy=false;
  const buttons=host ? [...host.querySelectorAll('button')] : [];
  function render() {
    const stale=Date.now()-lastSuccess>8000;
    const visible=!stale && timer.visible;
    const seconds=Math.max(0,Math.ceil(timer.ends_at-(Date.now()+offset)/1000));
    const text=seconds ? `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}` : "Time's up";
    if (card) {card.hidden=!visible; value.textContent=text;card.classList.toggle('expired',seconds===0);}
    if (status) status.textContent=stale ? 'Timer connection unavailable' : visible ? text+' · on overlay' : 'Hidden';
  }
  async function sync(command) {
    if (busy) return;
    busy=true;
    if(command) buttons.forEach(b=>b.disabled=true);
    try {
      const sent=Date.now();
      const options=command ? {method:'POST',headers:{'Content-Type':'application/json','X-Rowdy-Host-Key':admin()},body:JSON.stringify({command})} : {};
      const response=await fetch('/live-overlay/timer.php',{...options,cache:'no-store'});
      const data=await response.json();
      if(!response.ok || !data.ok) throw new Error(data.error || 'Timer unavailable');
      offset=Number(data.server_now)*1000-(sent+Date.now())/2;
      timer=data.timer; lastSuccess=Date.now(); render();
    } catch(error) {
      if(command && status) status.textContent=error.message;
      if(!command)render();
    } finally {busy=false;buttons.forEach(b=>b.disabled=false);}
  }
  buttons.forEach(button=>button.addEventListener('click',()=>sync(button.dataset.timerCommand)));
  sync(); setInterval(()=>sync(),1000); setInterval(render,100);
})();
