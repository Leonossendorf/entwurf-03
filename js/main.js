// Tabs: Feier im Saal / Kegelbahn
const tabs = [...document.querySelectorAll('[role="tab"]')];
const vorschau = document.querySelector('.vorschau');

function zeigeTab(name) {
  tabs.forEach(t => {
    const an = t.id === 'tab-' + name;
    t.setAttribute('aria-selected', an);
    t.tabIndex = an ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !an;
  });
  vorschau.hidden = true;
}

tabs.forEach((t, i) => {
  t.addEventListener('click', () => zeigeTab(t.id.slice(4)));
  t.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    zeigeTab(n.id.slice(4)); n.focus();
  });
});

document.querySelectorAll('[data-tab]').forEach(a =>
  a.addEventListener('click', () => zeigeTab(a.dataset.tab)));

// Gästezahl live anzeigen
const regler = document.getElementById('f-gaeste');
regler.addEventListener('input', () => { regler.nextElementSibling.value = regler.value; });

// Formulare: nichts versenden, nur zeigen, wie die Anfrage ankäme
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const datum = v => v ? new Date(v + 'T12:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

document.querySelectorAll('form[data-art]').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  const zeilen = [...new FormData(f)]
    .filter(([, v]) => String(v).trim())
    .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(/datum/i.test(k) ? datum(v) : v)}</dd>`)
    .join('');
  vorschau.innerHTML = `<h3>So käme Ihre Anfrage bei Achim Meyer an</h3><dl><dt>Art</dt><dd>${esc(f.dataset.art)}</dd>${zeilen}</dl>
    <p>Im Entwurf wird nichts versendet. In der fertigen Seite landet die Anfrage direkt im Postfach des Gasthauses.</p>`;
  vorschau.hidden = false;
  vorschau.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}));

// Chronik: Generationen leuchten auf, wenn sie ins Bild kommen
const gens = document.querySelectorAll('.gen');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add('da'); io.unobserve(x.target); }
  }), { rootMargin: '0px 0px -35% 0px' });
  gens.forEach(g => io.observe(g));
} else gens.forEach(g => g.classList.add('da'));

// Mindestdatum: heute
const heute = new Date().toISOString().slice(0, 10);
document.querySelectorAll('input[type=date]').forEach(i => i.min = heute);

// Daumenleiste erst zeigen, wenn der Hero aus dem Bild ist
const daumen = document.querySelector('.daumen');
const hero = document.querySelector('.hero');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => daumen.classList.toggle('zeigen', !e.isIntersecting), { threshold: 0.15 }).observe(hero);
} else daumen.classList.add('zeigen');
