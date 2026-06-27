// ── DADOS ─────────────────────────────────────────────────────────────────────
const gastos = {
  combustivel2025: 131395.50,
  manutencao2025:  137799.32,
  combustivel2026: 66735.49,
  manutencao2026:  52655.70,
  manutencaoPecas2025:    100894.32,
  manutencaoServicos2025:  36905.00,
  manutencaoPecas2026:     35241.70,
  manutencaoServicos2026:  17414.00,
};

const viagensFinalidade = {
  labels: ['Ensino / Aula prática', 'Pesquisa / Pós-grad.', 'Gestão / Administrativo', 'Extensão', 'Logística'],
  valores: [55, 35, 20, 15, 9],
};

const frota2025 = [
  { veiculo: 'Mascarello/Agrale Micro Ônibus', placa: 'MWN8I22', tipo: 'Própria', total: 35000 },
  { veiculo: 'Toyota Hilux',                   placa: 'OLH6J21', tipo: 'Própria', total: 22000 },
  { veiculo: 'Mitsubishi L200',                placa: 'QKJ9723', tipo: 'Própria', total: 18000 },
  { veiculo: 'Mercedes Sprinter',              placa: 'TGF6J09', tipo: 'Própria', total: 15000 },
  { veiculo: 'Mitsubishi Pajero',              placa: 'JHN5H43', tipo: 'Própria', total: 10000 },
  { veiculo: 'Chevrolet Montana',              placa: 'QKH7I32', tipo: 'Própria', total: 8000  },
  { veiculo: 'VW 8.150E Caminhão',             placa: 'MWA8E06', tipo: 'Própria', total: 9297  },
  { veiculo: 'K-113 CL4',                      placa: 'CYB6I76', tipo: 'Cedida',  total: 3430  },
  { veiculo: 'L1620',                          placa: 'HSY8E65', tipo: 'Cedida',  total: 3029  },
  { veiculo: 'Trator',                         placa: 'ZAQ0008', tipo: 'Própria', total: 5840  },
];

const COLORS = { primary: '#01696f', gold: '#c68f00', soft1: '#4fa3a9', soft2: '#d4a017' };

function getTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
function tc() { return getTheme() === 'dark' ? '#908e87' : '#7a7974'; }
function gc() { return getTheme() === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'; }
function brl(n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

window.addEventListener('DOMContentLoaded', () => {
  initTheme(); fillKPIs(); buildCharts(); fillTable(); fillInfoManut(); initNav();
});

let charts = {};

function initTheme() {
  const root = document.documentElement;
  const btn  = document.querySelector('[data-theme-toggle]');
  let theme  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  updateIcon(btn, theme);
  btn && btn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    updateIcon(btn, theme);
    Object.values(charts).forEach(c => {
      if (!c) return;
      if (c.options.scales) Object.values(c.options.scales).forEach(s => { if (s.ticks) s.ticks.color = tc(); if (s.grid) s.grid.color = gc(); });
      if (c.options.plugins?.legend?.labels) c.options.plugins.legend.labels.color = tc();
      c.update();
    });
  });
}

function updateIcon(btn, theme) {
  if (!btn) return;
  btn.innerHTML = theme === 'dark'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  btn.setAttribute('aria-label', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
}

function fillKPIs() {
  const t25 = gastos.combustivel2025 + gastos.manutencao2025;
  const t26 = gastos.combustivel2026 + gastos.manutencao2026;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('kpi-total-2025', brl(t25));
  set('kpi-total-2026', brl(t26));
  set('kpi-media-2025', brl(t25 / 12));
  set('kpi-media-2026', brl(t26 / 6));
}

function axisOpts() {
  return { ticks: { color: tc(), font: { size: 12 } }, grid: { color: gc() }, border: { color: 'transparent' } };
}

function buildCharts() {
  const ao = axisOpts();

  const el1 = document.getElementById('chart-comb-manut');
  if (el1) charts.combManut = new Chart(el1, {
    type: 'bar',
    data: {
      labels: ['2025 (completo)', '2026 (jan–jun)'],
      datasets: [
        { label: 'Combustível', data: [gastos.combustivel2025, gastos.combustivel2026], backgroundColor: COLORS.primary, borderRadius: 4 },
        { label: 'Manutenção',  data: [gastos.manutencao2025,  gastos.manutencao2026],  backgroundColor: COLORS.gold,    borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: tc(), font: { size: 12 } } } },
      scales: { x: ao, y: { ...ao, ticks: { ...ao.ticks, callback: v => brl(v) } } },
    },
  });

  const el2 = document.getElementById('chart-mix');
  if (el2) charts.mix = new Chart(el2, {
    type: 'doughnut',
    data: {
      labels: ['Combustível 2025', 'Manutenção 2025', 'Combustível 2026', 'Manutenção 2026'],
      datasets: [{ data: [gastos.combustivel2025, gastos.manutencao2025, gastos.combustivel2026, gastos.manutencao2026], backgroundColor: [COLORS.primary, COLORS.gold, COLORS.soft1, COLORS.soft2], hoverOffset: 8 }],
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: tc(), font: { size: 12 }, padding: 12 } } } },
  });

  const el3 = document.getElementById('chart-viagens');
  if (el3) charts.viagens = new Chart(el3, {
    type: 'bar',
    data: {
      labels: viagensFinalidade.labels,
      datasets: [{ label: 'Viagens', data: viagensFinalidade.valores, backgroundColor: COLORS.primary, borderRadius: 4 }],
    },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: ao, y: ao } },
  });

  const el4 = document.getElementById('chart-manut');
  if (el4) charts.manut = new Chart(el4, {
    type: 'bar',
    data: {
      labels: ['2025', '2026 (jan–jun)'],
      datasets: [
        { label: 'Peças',    data: [gastos.manutencaoPecas2025,    gastos.manutencaoPecas2026],    backgroundColor: COLORS.primary, borderRadius: 4 },
        { label: 'Serviços', data: [gastos.manutencaoServicos2025, gastos.manutencaoServicos2026], backgroundColor: COLORS.gold,    borderRadius: 4 },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: tc(), font: { size: 12 } } } }, scales: { x: ao, y: { ...ao, ticks: { ...ao.ticks, callback: v => brl(v) } } } },
  });
}

function fillTable() {
  const tbody = document.getElementById('tabela-frota');
  if (!tbody) return;
  [...frota2025].sort((a,b) => b.total - a.total).forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.veiculo}</td><td><code style="font-size:.8rem;font-family:monospace">${item.placa}</code></td><td>${item.tipo}</td><td class="text-right">${brl(item.total)}</td>`;
    tbody.appendChild(tr);
  });
}

function fillInfoManut() {
  const ul = document.getElementById('info-manut');
  if (!ul) return;
  [
    `Total 2025: ${brl(gastos.manutencaoPecas2025 + gastos.manutencaoServicos2025)}`,
    `Peças 2025: ${brl(gastos.manutencaoPecas2025)} (${(gastos.manutencaoPecas2025/(gastos.manutencaoPecas2025+gastos.manutencaoServicos2025)*100).toFixed(1)}%)`,
    `Serviços 2025: ${brl(gastos.manutencaoServicos2025)}`,
    `Total 2026 (jan–jun): ${brl(gastos.manutencaoPecas2026 + gastos.manutencaoServicos2026)}`,
    `Peças 2026: ${brl(gastos.manutencaoPecas2026)}`,
    `Serviços 2026: ${brl(gastos.manutencaoServicos2026)}`,
  ].forEach(text => { const li = document.createElement('li'); li.textContent = text; ul.appendChild(li); });
}

function initNav() {
  const links = document.querySelectorAll('.sidebar-link');
  const sections = Array.from(document.querySelectorAll('.section'));
  if (!sections.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => obs.observe(s));
}