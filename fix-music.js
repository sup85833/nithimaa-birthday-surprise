// Vercel build trigger: publish the Play Our Music welcome screen before the surprise.
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf8');
html = html.replace(
  /const song=document\.getElementById\('song'\),toggle=document\.getElementById\('music-toggle'\),label=document\.getElementById\('music-label'\);toggle\.addEventListener\('click',async\(\)=>\{[\s\S]*?song\.addEventListener\('ended',\(\)=>\{toggle\.textContent='▶';label\.textContent='Our song · tap to play'\}\);/,
  String.raw\`const song=document.getElementById('song'),toggle=document.getElementById('music-toggle'),label=document.getElementById('music-label');
song.volume=0.9;
song.setAttribute('playsinline','');
song.addEventListener('error',()=>{label.textContent='Song file could not load — please refresh';toggle.textContent='!';console.error('Birthday music failed to load:',song.error,song.currentSrc);});
toggle.addEventListener('click',async()=>{
 if(!song.paused){song.pause();toggle.textContent='▶';label.textContent='Our song · tap to play';return;}
 label.textContent='Loading our song…';
 try{if(!song.currentSrc||song.networkState===HTMLMediaElement.NETWORK_EMPTY)song.load();await song.play();toggle.textContent='Ⅱ';label.textContent='Our song · playing ♫';}
 catch(e){toggle.textContent='▶';label.textContent='Tap to allow music playback';console.error('Birthday music play error:',e);}
});
song.addEventListener('playing',()=>{toggle.textContent='Ⅱ';label.textContent='Our song · playing ♫';});
song.addEventListener('pause',()=>{toggle.textContent='▶';if(!song.ended)label.textContent='Our song · tap to play';});
song.addEventListener('ended',()=>{toggle.textContent='▶';label.textContent='Our song · tap to play';});\`
);

// A welcome screen asks her to start the song first; the surprise is revealed after playback starts.
const css = '<style id="music-welcome-style">#music-welcome{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:radial-gradient(ellipse at 50% 35%,#30205b 0%,#120d2c 48%,#050510 100%);color:#fff;text-align:center;font-family:Georgia,serif}#music-welcome:before{content:"✦ · ✧ · ✦";position:absolute;top:12%;left:0;right:0;color:#f4d9ff;letter-spacing:.8em}#music-welcome-card{width:min(460px,100%);padding:34px 24px;border:1px solid rgba(255,220,255,.35);border-radius:28px;background:rgba(255,255,255,.06);box-shadow:0 0 70px rgba(191,125,255,.18)}#music-welcome .mw-kicker{font:11px Arial,sans-serif;letter-spacing:.25em;text-transform:uppercase;color:#e3c7ff}#music-welcome h1{font-size:clamp(32px,8vw,48px);font-weight:400;line-height:1.1;margin:18px 0 12px}#music-welcome p{font:15px/1.7 Arial,sans-serif;color:#e7def5;margin:0 auto 24px;max-width:300px}#music-welcome-button{border:0;border-radius:999px;padding:16px 24px;min-height:54px;background:linear-gradient(100deg,#f6cce8,#e5c8ff);color:#25143d;font:700 14px Arial,sans-serif;cursor:pointer}#music-welcome-button:disabled{opacity:.7}#music-welcome-error{min-height:20px;margin-top:14px;color:#ffd9e8;font:12px/1.5 Arial,sans-serif}#music-welcome .mw-heart{font-size:25px;color:#ffc9e8;margin-top:20px}</style>';
const markup = '<div id="music-welcome" role="dialog" aria-modal="true" aria-labelledby="music-welcome-title"><div id="music-welcome-card"><div class="mw-kicker">A little surprise, made with love</div><h1 id="music-welcome-title">For my Nithimaa ✨</h1><p>Before anything else, let our song play. This little universe is all for you.</p><button id="music-welcome-button" type="button">▶ &nbsp; PLAY OUR MUSIC</button><div id="music-welcome-error" aria-live="polite"></div><div class="mw-heart">♡</div></div></div>';
const script = '<script id="music-welcome-script">(function(){const cover=document.getElementById("music-welcome"),button=document.getElementById("music-welcome-button"),message=document.getElementById("music-welcome-error"),song=document.getElementById("song");if(!cover||!button||!song)return;document.documentElement.style.overflow="hidden";document.body.style.overflow="hidden";button.addEventListener("click",async function(){button.disabled=true;button.textContent="♪ STARTING OUR SONG…";message.textContent="";try{song.volume=0.9;if(!song.currentSrc||song.networkState===HTMLMediaElement.NETWORK_EMPTY)song.load();await song.play();cover.style.transition="opacity .8s ease";cover.style.opacity="0";window.setTimeout(function(){cover.remove();document.documentElement.style.overflow="";document.body.style.overflow="";},820);}catch(error){button.disabled=false;button.textContent="▶ TRY PLAYING OUR MUSIC AGAIN";message.textContent="The song could not start. Tap once more or check your device volume.";console.error("Welcome music failed to play:",error);}});})();</script>';
if (!html.includes('id="music-welcome"')) html = html.replace(/<body([^>]*)>/i, '<body$1>' + markup);
if (!html.includes('id="music-welcome-style"')) html = html.replace('</head>', css + '</head>');
if (!html.includes('id="music-welcome-script"')) html = html.replace(/<\/body>/i, script + '</body>');
fs.writeFileSync(file, html);
