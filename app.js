const DEFAULT_ATTRIBUTES = ["Jujutsu", "Físico", "Agilidade", "Intelecto", "Carisma"];
const DEFAULT_MASTERY = ["Liberação de Energia", "Técnicas Anti-Domínio", "Técnicas de Barreira", "Shikigamis"];

let chars = [];
let currentId = null;

function qs(id) { return document.getElementById(id); }

// Elementos principais
const charList = qs('charList');
const newBtn = qs('newBtn');
const saveBtn = qs('saveBtn');
const duplicateBtn = qs('duplicateBtn');
const deleteBtn = qs('deleteBtn');
const exportBtn = qs('exportBtn');
const exportAllBtn = qs('exportAllBtn');
const importBtn = qs('importBtn');
const importFile = qs('importFile');
const search = qs('search');

// ==================== FUNÇÕES BÁSICAS ====================

function makeDefaultChar(name = 'Novo Feiticeiro') {
  const attributes = {};
  DEFAULT_ATTRIBUTES.forEach(a => attributes[a] = 1);
  
  const mastery = {};
  DEFAULT_MASTERY.forEach(m => mastery[m] = 1);

  return {
    id: Date.now().toString(36),
    name,
    age: '',
    species: 'Humano',
    grade: '4',
    bio: '',
    portrait: '',
    attributes,
    mastery,
    pvMax: 20, pvNow: 20,
    peaMax: 20, peaNow: 20,
    peMax: 8, peNow: 8,
    innateTech: '',
    repertoire: '',
    equipment: '',
    created: new Date().toISOString()
  };
}

function loadStorage() {
  const raw = localStorage.getItem('camellia_chars');
  if (raw) {
    try { chars = JSON.parse(raw); } catch(e) { chars = []; }
  } else {
    chars = [makeDefaultChar('Gojo Satoru')];
    saveStorage();
  }
}

function saveStorage() {
  localStorage.setItem('camellia_chars', JSON.stringify(chars));
  renderList();
}

function renderList(filter = '') {
  charList.innerHTML = '';
  const filtered = chars.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
  filtered.sort((a,b) => a.name.localeCompare(b.name));
  
  filtered.forEach(c => {
    const el = document.createElement('div');
    el.className = 'char-item' + (c.id === currentId ? ' active' : '');
    el.textContent = c.name + ' • ' + (c.grade || '—');
    el.onclick = () => openChar(c.id);
    charList.appendChild(el);
  });
}

function openChar(id) {
  const c = chars.find(x => x.id === id);
  if (!c) return;
  currentId = id;

  // Preenche campos
  qs('portraitImg').src = c.portrait || '';
  qs('portraitUrl').value = c.portrait || '';
  qs('name').value = c.name;
  qs('age').value = c.age;
  qs('species').value = c.species;
  qs('grade').value = c.grade;
  qs('bio').value = c.bio;
  qs('innateTech').value = c.innateTech || '';
  qs('repertoire').value = c.repertoire || '';
  qs('equipment').value = c.equipment || '';

  qs('pvMax').value = c.pvMax || 20;
  qs('pvNow').value = c.pvNow || 20;
  qs('peaMax').value = c.peaMax || 20;
  qs('peaNow').value = c.peaNow || 20;
  qs('peMax').value = c.peMax || 8;
  qs('peNow').value = c.peNow || 8;

  renderAttributes(c);
  renderMastery(c);
  renderList(search.value);
}

function renderAttributes(c) {
  const container = qs('attributes');
  container.innerHTML = '';
  Object.keys(c.attributes).forEach(key => {
    const div = document.createElement('div');
    div.innerHTML = `<label>${key}</label><input type="number" value="${c.attributes[key]}" data-key="${key}">`;
    // Salvar ao mudar
    div.querySelector('input').onchange = (e) => {
      c.attributes[key] = parseInt(e.target.value) || 1;
      saveStorage();
    };
    container.appendChild(div);
  });
}

function renderMastery(c) {
  const container = qs('mastery') || document.createElement('div'); // caso não exista ainda
  // ... (pode expandir depois)
}

// ==================== writeBack ====================
function writeBack() {
  if (!currentId) return;
  const c = chars.find(x => x.id === currentId);
  if (!c) return;

  c.name = qs('name').value;
  c.age = qs('age').value;
  c.species = qs('species').value;
  c.grade = qs('grade').value;
  c.bio = qs('bio').value;
  c.portrait = qs('portraitUrl').value.trim();
  c.innateTech = qs('innateTech').value;
  c.repertoire = qs('repertoire').value;
  c.equipment = qs('equipment').value;

  c.pvMax = parseInt(qs('pvMax').value) || 20;
  c.pvNow = parseInt(qs('pvNow').value) || 20;
  c.peaMax = parseInt(qs('peaMax').value) || 20;
  c.peaNow = parseInt(qs('peaNow').value) || 20;
  c.peMax = parseInt(qs('peMax').value) || 8;
  c.peNow = parseInt(qs('peNow').value) || 8;

  saveStorage();
}

// Botão de carregar portrait
function setupPortraitButton() {
  const btn = qs('loadPortraitBtn');
  if (btn) {
    btn.onclick = () => {
      if (!currentId) return alert("Abra uma ficha primeiro!");
      const url = qs('portraitUrl').value.trim();
      const c = chars.find(x => x.id === currentId);
      if (c) {
        c.portrait = url;
        qs('portraitImg').src = url || '';
        saveStorage();
      }
    };
  }
}

// ==================== Inicialização ====================
newBtn.onclick = () => {
  const c = makeDefaultChar('Novo Feiticeiro ' + (chars.length + 1));
  chars.push(c);
  saveStorage();
  openChar(c.id);
};

search.oninput = () => renderList(search.value);

// Auto salvar ao mudar campos
document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  renderList();
  if (chars.length) openChar(chars[0].id);
  setupPortraitButton();

  // Salvar ao mudar qualquer input/textarea
  document.querySelectorAll('input, textarea').forEach(el => {
    if (el.id !== 'search') {
      el.addEventListener('change', writeBack);
    }
  });
});