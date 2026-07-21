/* ===== Year ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== Reduced motion ===== */
const isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Nav hide/show on scroll ===== */
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
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 10);
    if (bar) bar.style.width = '0%';
  });
}

/* ===== Scroll ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  });
});

/* ===== Burger ===== */
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
const navCta = document.querySelector('.nav-cta');
burger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navCta?.classList.toggle('open');
  burger.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navCta?.classList.remove('open');
    burger.classList.remove('open');
  });
});

/* ===== Hero terminal ===== */
(function() {
  const term = document.getElementById('heroTerminal');
  const photo = term.querySelector('.photo-section');

  const commands = [
    { cmd:'whoami', out:'Семен — Fullstack-розробник' },
    { cmd:'cat focus.txt', out:'Створення сучасних веб-додатків' },
    { cmd:'status --current', out:'✓ Відкритий до нових проєктів' },
    { cmd:'stack', out:'Rust · Python  · TypeScript · React · Node.js' },
    { cmd:'ls projects', out:['kore/', 'lumen/', 'disk-map/', 'porfolio/', 'flowers-website/'] },
    { cmd:'uptime', out:'Coding for 5+ years' },
  ];

  let idx = 0;
  let ch = 0;
  let phase = 'idle';     // idle → typing → output → idle → …
  let promptLine = null;  // current .line with $

  function prepend(el) { term.insertBefore(el, photo); }

  function line(html) {
    const d = document.createElement('div');
    d.className = 'line';
    d.innerHTML = html;
    prepend(d);
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

  // instant for reduced motion
  if (isReduced) {
    addPrompt();
    commands.forEach(c => {
      promptLine.querySelector('.cmd').textContent = c.cmd;
      addOutput(c.out);
      addPrompt();
    });
    promptLine.innerHTML += '<span class="terminal-cursor"></span>';
    term.scrollTop = term.scrollHeight;
    return;
  }

  // ── animation loop ──
  addPrompt(true);  // first $█
  term.scrollTop = term.scrollHeight;

  function tick() {
    term.scrollTop = term.scrollHeight;

    if (phase === 'idle') {
      // cursor blinks on current prompt; start typing next command
      if (idx >= commands.length) return;       // all done
      promptLine.querySelector('.terminal-cursor')?.remove();
      phase = 'typing';
      tick();
      return;
    }

    if (phase === 'typing') {
      if (idx >= commands.length) return;
      const c = commands[idx].cmd;
      if (ch < c.length) {
        promptLine.querySelector('.cmd').textContent += c[ch];
        ch++;
        setTimeout(tick, 60 + Math.random() * 50);
      } else {
        phase = 'output';
        setTimeout(tick, 400);
      }
      return;
    }

    if (phase === 'output') {
      if (idx >= commands.length) return;
      addOutput(commands[idx].out);
      idx++;
      ch = 0;
      phase = 'idle';
      addPrompt(true);                         // next $█
      setTimeout(tick, 1000);
    }
  }

  setTimeout(tick, 1000);
})();

/* ===== Contact terminal ===== */
(function() {
  const output = document.getElementById('contactOutput');
  const input = document.getElementById('contactInput');
  const term = document.getElementById('contactTerminal');

  const cmds = ['/help','/about','/stack','/projects','/mail','/github','/telegram','/clear','whoami'];
  let history = [];
  let histIdx = -1;

  function esc(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  const help = [
    {cmd:'/help',desc:'список команд'},
    {cmd:'/about',desc:'скрол до "Про мене"'},
    {cmd:'/stack',desc:'скрол до "Стек"'},
    {cmd:'/projects',desc:'скрол до "Проєкти"'},
    {cmd:'/mail',desc:'відкрити пошту'},
    {cmd:'/github',desc:'відкрити GitHub'},
    {cmd:'/telegram',desc:'відкрити Telegram'},
    {cmd:'/clear',desc:'очистити вивід'},
    {cmd:'whoami',desc:"ім'я та роль"},
  ];

  function print(text, cls) {
    const d = document.createElement('div');
    d.className = 'line' + (cls ? ' ' + cls : '');
    d.innerHTML = text;
    output.appendChild(d);
    output.scrollTop = output.scrollHeight;
  }

  // initial help
  print('<span class="prompt">$ </span><span class="cmd">/help</span>');
  print('  <span class="output">Доступні команди:</span>');
  help.forEach(h => print('  <span class="output">' + h.cmd + ' — ' + h.desc + '</span>'));

  function handle(e) {
    if (e.key !== 'Enter') return;
    const val = input.value.trim();
    if (!val) return;
    if (e.currentTarget === input) historyPush(val);
    input.value = '';

    print('<span class="prompt">$ </span><span class="cmd">' + esc(val) + '</span>');

    const v = val.replace(/^\//, '').toLowerCase();

    const map = {
      help() {
        print('  <span class="output">Доступні команди:</span>');
        help.forEach(h => print('  <span class="output">' + h.cmd + ' — ' + h.desc + '</span>'));
      },
      about() { document.getElementById('about')?.scrollIntoView({behavior:'smooth'}); },
      stack() { document.getElementById('stack')?.scrollIntoView({behavior:'smooth'}); },
      projects() { document.getElementById('projects')?.scrollIntoView({behavior:'smooth'}); },
      mail() { window.open('mailto:your@email.com','_blank','noopener'); },
      github() { window.open('https://github.com','_blank','noopener'); },
      telegram() { window.open('https://t.me','_blank','noopener'); },
      clear() { output.innerHTML = ''; },
      whoami() { print('  <span class="output">Семен — Fullstack-розробник</span>'); },
    };

    (map[v] || (() => print('  <span class="output">❌ Невідома команда. Напиши /help</span>')))().call?.();
  }

  function historyPush(val) {
    history.push(val);
    if (history.length > 50) history.shift();
    histIdx = history.length;
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
      else { histIdx = history.length; input.value = ''; }
    }
  });

  input.addEventListener('keydown', handle);

  // focus input on click anywhere in terminal
  term?.addEventListener('click', () => input.focus());
})();
