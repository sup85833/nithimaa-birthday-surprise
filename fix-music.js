const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf8');
html = html.replace(
  /const song=document\.getElementById\('song'\),toggle=document\.getElementById\('music-toggle'\),label=document\.getElementById\('music-label'\);toggle\.addEventListener\('click',async\(\)=>\{[\s\S]*?song\.addEventListener\('ended',\(\)=>\{toggle\.textContent='▶';label\.textContent='Our song · tap to play'\}\);/,
  String.raw\`const song=document.getElementById('song'),toggle=document.getElementById('music-toggle'),label=document.getElementById('music-label');
song.volume=0.9;
song.autoplay=true;
song.setAttribute('autoplay','');
song.setAttribute('playsinline','');
song.addEventListener('error',()=>{label.textContent='Song file could not load — please refresh';toggle.textContent='!';console.error('Birthday music failed to load:',song.error,song.currentSrc);});
toggle.addEventListener('click',async()=>{
 if(!song.paused){song.pause();toggle.textContent='▶';label.textContent='Our song · tap to play';return;}
 label.textContent='Loading our song…';
 try{if(!song.currentSrc||song.networkState===HTMLMediaElement.NETWORK_EMPTY)song.load();await song.play();toggle.textContent='Ⅱ';label.textContent='Our song · playing ♫';}
 catch(e){toggle.textContent='▶';label.textContent='Automatic playback was blocked; tap to start the song';console.error('Birthday music play error:',e);}
});
song.addEventListener('playing',()=>{toggle.textContent='Ⅱ';label.textContent='Our song · playing ♫';});
song.addEventListener('pause',()=>{toggle.textContent='▶';if(!song.ended)label.textContent='Our song · tap to play';});
song.addEventListener('ended',()=>{toggle.textContent='▶';label.textContent='Our song · tap to play';});
const tryAutoplay=()=>{song.play().then(()=>{toggle.textContent='Ⅱ';label.textContent='Our song · playing ♫';}).catch(e=>{console.warn('Autoplay was rejected by the browser:',e);});};
if(document.readyState==='complete')tryAutoplay();else window.addEventListener('load',tryAutoplay,{once:true});\`
);
fs.writeFileSync(file, html);
