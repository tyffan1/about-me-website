document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('heroPhoto')?.addEventListener('error', function() {
  this.style.display = 'none';
  document.getElementById('photoFallback').style.display = 'flex';
});
const isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('navbar');
const bar = document.getElementById('progress-bar');
let lastScroll = 0;
function onScroll() {
  const y = window.scrollY;
  const atTop = y < 10;
  const goingDown = y > lastScroll && !atTop;
  nav.classList.toggle('scrolled', !atTop);
  nav.classList.toggle('hidden', goingDown && y > 80);
  if (bar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? (y / max * 100) + '%' : '0%';
  }
  lastScroll = y;
}
if (!isReduced) {
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    if (bar) bar.style.width = '0%';
  });
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  });
});
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
burger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
  });
});
(function() {
  const log = document.getElementById('heroLog');
  if (!log) return;
  const commands = [
    { cmd:'whoami', out:'Семен — системні інструменти × Fullstack' },
    { cmd:'cat фокус.txt', out:'Rust · системні утиліти · сучасний веб' },
    { cmd:'stack --list', out:'Rust · TypeScript · React · Python · SQLite' },
    { cmd:'ls projects/', out:['lumen/  disk-map/  kore/  (архів: flowers-website/)'] },
    { cmd:'status', out:'✓ Відкритий до співпраці — пиши в contact.sh' },
  ];
  let idx = 0, ch = 0, phase = 'idle', promptLine = null;
  function line(html) {
    const d = document.createElement('div');
    d.className = 'line';
    d.innerHTML = html;
    log.appendChild(d);
    return d;
  }
  function addPrompt(withCursor) {
    const html = withCursor
      ? '<span class="prompt">$ </span><span class="cmd"></span><span class="terminal-cursor"></span>'
      : '<span class="prompt">$ </span><span class="cmd"></span>';
    promptLine = line(html);
  }
  function addOutput(text) {
    const items = Array.isArray(text) ? text : [text];
    items.forEach(t => line('<span class="output">' + t + '</span>'));
  }
  if (isReduced) {
    addPrompt();
    commands.forEach(c => {
      promptLine.querySelector('.cmd').textContent = c.cmd;
      addOutput(c.out);
      addPrompt();
    });
    promptLine.innerHTML += '<span class="terminal-cursor"></span>';
    log.scrollTop = log.scrollHeight;
    return;
  }
  addPrompt(true);
  log.scrollTop = log.scrollHeight;
  function tick() {
    log.scrollTop = log.scrollHeight;
    if (phase === 'idle') {
      if (idx >= commands.length) return;
      promptLine.querySelector('.terminal-cursor')?.remove();
      phase = 'typing';
      tick();
      return;
    }
    if (phase === 'typing') {
      if (idx >= commands.length) return;
      const c = commands[idx].cmd;
      if (ch < c.length) {
        promptLine.querySelector('.cmd').textContent += c[ch++];
        setTimeout(tick, 55 + Math.random() * 55);
      } else {
        phase = 'output';
        setTimeout(tick, 380);
      }
      return;
    }
    if (phase === 'output') {
      if (idx >= commands.length) return;
      addOutput(commands[idx].out);
      idx++; ch = 0; phase = 'idle';
      addPrompt(true);
      setTimeout(tick, 900);
    }
  }
  setTimeout(tick, 900);
})();

(function() {
  const output = document.getElementById('contactOutput');
  const input = document.getElementById('contactInput');
  const term = document.getElementById('contactTerminal');
  const hints = document.getElementById('contactHints');
  if (!output || !input) return;
  let history = [], histIdx = -1;
  function esc(t){ const d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
  function print(html){ const d=document.createElement('div'); d.className='line'; d.innerHTML=html; output.appendChild(d); output.scrollTop=output.scrollHeight; }
  const LINKS = {
    telegram: 'https://t.me/tyffan1',
    github: 'https://github.com/tyffan1',
    email: 'mailto:tyffan@example.com',
  };
  function help(){
    print('  <span class="output">Доступні команди:</span>');
    [['telegram','відкрити Telegram'],['email','написати на пошту'],['github','відкрити GitHub'],['help','цей список'],['clear','очистити']].forEach(([c,d])=>{
      print('  <span class="output"><span class="accent">'+c+'</span> — '+d+'</span>');
    });
    print('  <span class="output hint" style="opacity:.6">також: /telegram /mail /github</span>');
  }
  print('<span class="prompt">$</span> <span class="cmd">help</span>');
  help();
  function handle(val){
    if(!val) return;
    history.push(val); if(history.length>50) history.shift(); histIdx=history.length;
    print('<span class="prompt">$</span> <span class="cmd">'+esc(val)+'</span>');
    const v = val.replace(/^\//,'').toLowerCase().trim();
    if(v==='help' || v==='?'){ help(); return; }
    if(v==='clear' || v==='cls'){ output.innerHTML=''; return; }
    if(v==='telegram' || v==='tg' || v==='t.me'){
      print('  <span class="output ok">↗ Відкриваю Telegram...</span>');
      window.open(LINKS.telegram,'_blank','noopener');
      print('  <span class="output"><a href="'+LINKS.telegram+'" target="_blank" rel="noopener">'+LINKS.telegram+'</a></span>');
      return;
    }
    if(v==='email' || v==='mail' || v.includes('@')){
      if(v.includes('@') && v.includes('.')){
        const subject = encodeURIComponent('Привіт, Семене!');
        const body = encodeURIComponent('Привіт! Пишу з твого сайту.\n\n');
        window.location.href = 'mailto:'+v+'?subject='+subject+'&body='+body;
        print('  <span class="output ok">✉️ Відкриваю поштовий клієнт для '+esc(v)+'</span>');
      } else {
        print('  <span class="output ok">✉️ Відкриваю пошту...</span>');
        window.open(LINKS.email,'_blank','noopener');
      }
      return;
    }
    if(v==='github' || v==='gh'){
      print('  <span class="output ok">↗ Відкриваю GitHub...</span>');
      window.open(LINKS.github,'_blank','noopener');
      return;
    }
    if(v==='about' || v==='stack' || v==='projects'){
      const el=document.getElementById(v); if(el) el.scrollIntoView({behavior:'smooth'});
      print('  <span class="output ok">→ скролю до '+esc(v)+'</span>');
      return;
    }
    print('  <span class="output err">❌ Невідома команда: '+esc(v)+'. Введи help</span>');
  }
  input.addEventListener('keydown', e=>{
    if(e.key==='Enter'){ const v=input.value.trim(); input.value=''; handle(v); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); if(histIdx>0){ histIdx--; input.value=history[histIdx]; } }
    else if(e.key==='ArrowDown'){ e.preventDefault(); if(histIdx<history.length-1){ histIdx++; input.value=history[histIdx]; } else { histIdx=history.length; input.value=''; } }
  });
  hints?.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click',()=> handle(b.dataset.cmd));
  });
  term?.addEventListener('click', ()=> input.focus());
})();
(function(){
  const chips=document.querySelectorAll('.chip[data-tech]');
  const cards=document.querySelectorAll('.project-card[data-tech]');
  if(!chips.length||!cards.length) return;
  function apply(tech){
    chips.forEach(c=> c.classList.toggle('active', c.dataset.tech===tech));
    cards.forEach(card=>{
      const techs=(card.dataset.tech||'').toLowerCase().split(/\s+/);
      const match=techs.includes(tech);
      card.classList.toggle('highlight', match);
      card.classList.toggle('dim', tech && !match);
      card.querySelectorAll('.project-tags span').forEach(tag=>{
        tag.classList.toggle('hl', tag.textContent.trim().toLowerCase()===tech);
      });
    });
  }
  function clear(){
    chips.forEach(c=>c.classList.remove('active'));
    cards.forEach(c=>{ c.classList.remove('highlight','dim'); c.querySelectorAll('.project-tags span').forEach(t=>t.classList.remove('hl')); });
  }
  chips.forEach(chip=>{
    chip.addEventListener('mouseenter',()=> apply(chip.dataset.tech.toLowerCase()));
    chip.addEventListener('mouseleave', clear);
    chip.addEventListener('focus',()=> apply(chip.dataset.tech.toLowerCase()));
    chip.addEventListener('blur', clear);
    chip.tabIndex=0;
  });
})();
(function(){
  if(isReduced || !matchMedia('(hover:hover)').matches) return;
  const cards=document.querySelectorAll('.project-card');
  cards.forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX - r.left)/r.width - .5;
      const y=(e.clientY - r.top)/r.height - .5;
      card.style.transform='perspective(900px) rotateY('+(x*6)+'deg) rotateX('+(-y*6)+'deg) translateY(-3px)';
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
  });
})();
