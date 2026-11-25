(() => {
  const WA = '5511946247000';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav: fundo mais sólido ao rolar
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  const closeMenu = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); };
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Reveal ao rolar
  const items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 60}ms`; io.observe(el); });
  }

  // Manifesto: palavras acendem conforme a rolagem
  const words = document.querySelector('[data-words]');
  if (words) {
    const parts = words.textContent.trim().split(/\s+/);
    words.innerHTML = parts.map(w => `<span>${w}</span>`).join(' ');
    const spans = words.querySelectorAll('span');
    if (reduce) {
      spans.forEach(s => s.classList.add('on'));
    } else {
      const update = () => {
        const r = words.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        const n = Math.round(p * spans.length);
        spans.forEach((s, i) => s.classList.toggle('on', i < n));
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    }
  }

  // Cards de solução pré-selecionam o tipo no formulário
  const tipo = document.getElementById('f-tipo');
  document.querySelectorAll('[data-tipo]').forEach(a => a.addEventListener('click', () => { tipo.value = a.dataset.tipo; }));

  // Formulário → WhatsApp
  const form = document.getElementById('form');
  const summary = form.querySelector('.form__error');
  const rules = {
    nome: v => v.trim().length >= 2 || 'Informe seu nome.',
    whats: v => v.replace(/\D/g, '').length >= 10 || 'Informe um WhatsApp com DDD.',
    email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Confira o e-mail.',
    tipo: v => !!v || 'Escolha o que você procura.'
  };
  const check = el => {
    const rule = rules[el.name];
    if (!rule) return true;
    const res = rule(el.value);
    const field = el.closest('.field');
    const msg = field.querySelector('.field__msg');
    const ok = res === true;
    field.classList.toggle('is-invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    if (msg) { msg.textContent = ok ? '' : res; if (msg.id) el.setAttribute('aria-describedby', msg.id); }
    return ok;
  };
  Object.keys(rules).forEach(name => {
    const el = form.elements[name];
    el.addEventListener('blur', () => { if (el.value || el.closest('.field').classList.contains('is-invalid')) check(el); });
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('is-invalid')) check(el); });
  });

  // Máscara simples de telefone
  const whats = form.elements.whats;
  whats.addEventListener('input', () => {
    const d = whats.value.replace(/\D/g, '').slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    whats.value = out;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = Object.keys(rules).map(n => form.elements[n]).filter(el => !check(el));
    if (bad.length) {
      summary.hidden = false;
      summary.innerHTML = `<strong>Faltam ${bad.length === 1 ? 'um dado' : bad.length + ' dados'}:</strong> ` +
        bad.map(el => `<a href="#${el.id}">${el.closest('.field').querySelector('.field__msg').textContent}</a>`).join(' ');
      summary.focus();
      return;
    }
    summary.hidden = true;
    const f = form.elements;
    const linhas = [
      'Olá! Quero uma análise da Sete Vidas.',
      `Nome: ${f.nome.value.trim()}`,
      `WhatsApp: ${f.whats.value}`,
      f.email.value && `E-mail: ${f.email.value.trim()}`,
      `Procuro: ${f.tipo.value}`,
      f.vidas.value && `Pessoas: ${f.vidas.value}`,
      f.msg.value.trim() && `Sobre o meu caso: ${f.msg.value.trim()}`
    ].filter(Boolean);
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(linhas.join('\n'))}`, '_blank', 'noopener');
  });

  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
