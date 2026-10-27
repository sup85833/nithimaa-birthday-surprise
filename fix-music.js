const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const extra = `
<style id="forever-choice-style">
#music-toggle{display:none!important}
#forever-choice{margin:18px auto 0;text-align:center}
#forever-choice h3{font-size:clamp(20px,4vw,28px);color:#fff;margin:0 0 20px}
#forever-choice .choices{display:flex;justify-content:center;gap:18px;min-height:55px;position:relative}
#forever-choice button{border:0;border-radius:999px;padding:13px 25px;font-weight:700;font-size:16px;cursor:pointer}
#forever-yes{background:linear-gradient(100deg,#bb70ff,#ed77ca);color:#fff}
#forever-no{background:#33264f;color:#fff;border:1px solid #9d86ba}
#forever-answer{margin-top:20px;color:#ff9acb;font-size:22px;font-weight:700;line-height:1.5}
#forever-answer span{display:block;color:#ff214f;font-size:68px}
</style>`;
const script = `
<script id="forever-choice-script">
(function(){
 function setup(){
  const all=[...document.querySelectorAll('button,a,[role="button"]')];
  const cta=all.find(el=>(el.textContent||'').trim().toLowerCase().includes('keep this love forever'));
  if(!cta||document.getElementById('forever-choice'))return;
  cta.textContent='Will you keep this forever?';
  cta.addEventListener('click',function(e){
   e.preventDefault();e.stopImmediatePropagation();
   const panel=document.createElement('section');panel.id='forever-choice';
   panel.innerHTML='<h3>Will you keep this forever? 💌</h3><div class="choices"><button id="forever-yes">Yes ❤️</button><button id="forever-no">No</button></div><div id="forever-answer" aria-live="polite"></div>';
   cta.insertAdjacentElement('afterend',panel);
   const no=panel.querySelector('#forever-no'),yes=panel.querySelector('#forever-yes'),area=panel.querySelector('.choices');
   function dodge(){no.style.position='absolute';no.style.left=Math.floor(Math.random()*Math.max(1,area.clientWidth-no.offsetWidth))+'px';no.style.top=Math.floor(Math.random()*12)+'px';}
   no.addEventListener('pointerenter',dodge);no.addEventListener('click',function(ev){ev.preventDefault();dodge();});no.addEventListener('touchstart',dodge,{passive:true});
   yes.addEventListener('click',function(){panel.innerHTML='<div id="forever-answer">I knew you would keep it forever!<span>♥</span></div>';});
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
 setTimeout(setup,1200);
})();
</script>`;
if(!html.includes('id="music-welcome"'))throw new Error('Music welcome screen missing; refusing to change the page.');
if(!html.includes('id="forever-choice-style"'))html=html.replace('</head>',extra+'\n</head>');
if(!html.includes('id="forever-choice-script"'))html=html.replace('</body>',script+'\n</body>');
fs.writeFileSync(file,html);
console.log('Forever choice interaction added.');
