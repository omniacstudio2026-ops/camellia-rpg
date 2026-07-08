const DEFAULT_ATTRIBUTES = ["Jujutsu", "Físico", "Agilidade", "Intelecto", "Carisma"];

let chars = [];
let currentId = null;
let rollHistory = [];

function qs(id) { return document.getElementById(id); }

// ==================== Funções de Storage ====================
function makeDefaultChar(name = 'Novo Feiticeiro') {
  const attributes = {};
  DEFAULT_ATTRIBUTES.forEach(a => attributes[a] = 1);

  return {
    id: Date.now().toString(36),
    name, age: '', species: 'Humano', grade: '4', bio: '',
    portrait: '',
    attributes,
    pvMax: 20, pvNow: 20,
    peaMax: 20, peaNow: 20,
    peMax: 8, peNow: 8,
    innateTech: '', repertoire: '', equipment: ''
  };
}

function loadStorage() {
  const raw = localStorage.getItem('camellia_chars_v2');
  chars = raw ? JSON.parse(raw) : [makeDefaultChar('Gojo Satoru')];
  saveStorage();
}

function saveStorage() {
  localStorage.setItem('camellia_chars_v2', JSON.stringify(chars));
  renderList();
}

// ==================== Renderização ====================
function renderList(filter = '') {
  // ... (mesma função de antes)
  // (copie da versão anterior se precisar)
}

function openChar(id) { /* ... */ } // use a versão anterior

// ==================== Rolagem ====================
function rollDice(mod = 0) {
  const d1 = Math.floor(Math.random() * 10) + 1;
  const d2 = Math.floor(Math.random() * 10) + 1;
  const total = d1 + d2 + mod;

  const entry = {
    time: new Date().toLocaleTimeString('pt-BR'),
    result: total,
    detail: `2d10 (${d1}+${d2}) + ${mod}`
  };

  rollHistory.unshift(entry);
  if (rollHistory.length > 8) rollHistory.pop();

  qs('rollResult').textContent = total;
  qs('rollDetail').textContent = entry.detail;
  renderHistory();
}

function renderHistory() {
  const hist = qs('rollHistory');
  hist.innerHTML = rollHistory.map(r => 
    `<div><strong>${r.time}</strong> → ${r.result} <small>(${r.detail})</small></div>`
  ).join('');
}

// Inicialização da rolagem
document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  // ... resto da inicialização

  qs('rollBtn').onclick = () => {
    const mod = parseInt(qs('rollMod').value) || 0;
    rollDice(mod);
  };
});
