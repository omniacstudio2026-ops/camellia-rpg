const DEFAULT_ATTRIBUTES = ["Jujutsu", "Físico", "Agilidade", "Intelecto", "Carisma"];

let chars = [];
let currentId = null;

function qs(id) { return document.getElementById(id); }

// ==================== CRIAÇÃO DE FICHA ====================
function makeDefaultChar(name = 'Novo Feiticeiro') {
  const attributes = {};
  DEFAULT_ATTRIBUTES.forEach(a => attributes[a] = 1);

  return {
    id: Date.now().toString(36),
    name,
    age: '',
    species: 'Humano',
    grade: '4',
    bio: '',
    portrait: '',
    attributes,
    hasEAR: false,
    innateTech: '',
    pvMax: 20,
    pvNow: 20,
    peaMax: 20,
    peaNow: 20,
    peMax: 8,
    peNow: 8
  };
}

// ==================== STORAGE ====================
function loadStorage() {
  const raw = localStorage.getItem('camellia_chars_v5');
  chars = raw ? JSON.parse(raw) : [makeDefaultChar('Gojo Satoru')];
  saveStorage();
}

function saveStorage() {
  localStorage.setItem('camellia_chars_v5', JSON.stringify(chars));
  renderList();
}

// ==================== CÁLCULO AUTOMÁTICO ====================
function calculateMaxStats(attributes) {
  const f = attributes.Físico || 1;
  const j = attributes.Jujutsu || 1;
  const a = attributes.Agilidade || 1;
  const i = attributes.Intelecto || 1;

  return {
    pvMax: 12 + (f * 8),
    peaMax: 16 + (j * 6),
    peMax: 5 + (i * 2) + (a * 1)
  };
}

// ==================== RENDER ATRIBUTOS ====================
function renderAttributes(c) {
  const container = qs('attributes');
  if (!container) return;

  container.innerHTML = '';

  Object.keys(c.attributes).forEach(key => {
    const div = document.createElement('div');
    div.style = "display: flex; align-items: center; gap: 10px; margin: 6px 0;";
    div.innerHTML = `
      <label style="width: 130px;">${key}:</label>
      <input type="number" value="${c.attributes[key]}" min="1" max="5" style="width: 70px;">
    `;

    const input = div.querySelector('input');
    input.onchange = () => {
      c.attributes[key] = parseInt(input.value) || 1;
      const stats = calculateMaxStats(c.attributes);
      c.pvMax = stats.pvMax;
      c.peaMax = stats.peaMax;
      c.peMax = stats.peMax;

      qs('pvMax').value = c.pvMax;
      qs('peaMax').value = c.peaMax;
      qs('peMax').value = c.peMax;
      saveStorage();
    };
    container.appendChild(div);
  });
}

// ==================== OPEN CHAR ====================
function openChar(id) {
  const c = chars.find(x => x.id === id);
  if (!c) return;
  currentId = id;

  qs('name').value = c.name;
  qs('age').value = c.age;
  qs('species').value = c.species;
  qs('grade').value = c.grade;
  qs('bio').value = c.bio;
  qs('portraitImg').src = c.portrait || '';
  qs('portraitUrl').value = c.portrait || '';
  qs('innateTech').value = c.innateTech || '';

  qs('pvMax').value = c.pvMax;
  qs('pvNow').value = c.pvNow;
  qs('peaMax').value = c.peaMax;
  qs('peaNow').value = c.peaNow;
  qs('peMax').value = c.peMax;
  qs('peNow').value = c.peNow;

  qs('earCheckbox').checked = !!c.hasEAR;

  renderAttributes(c);
  renderList(qs('search').value);
}

// ==================== LISTA ====================
function renderList(filter = '') {
  const list = qs('charList');
  list.innerHTML = '';
  chars.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
       .forEach(c => {
         const el = document.createElement('div');
         el.textContent = c.name;
         el.onclick = () => openChar(c.id);
         list.appendChild(el);
       });
}

// ==================== SALVAR ====================
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
  c.hasEAR = qs('earCheckbox').checked;

  c.pvNow = parseInt(qs('pvNow').value) || 0;
  c.peaNow = parseInt(qs('peaNow').value) || 0;
  c.peNow = parseInt(qs('peNow').value) || 0;

  saveStorage();
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
  loadStorage();

  if (chars.length) openChar(chars[0].id);

  qs('newBtn').onclick = () => {
    const c = makeDefaultChar('Novo Feiticeiro ' + (chars.length + 1));
    chars.push(c);
    saveStorage();
    openChar(c.id);
  };

  qs('saveBtn').onclick = writeBack;
  qs('loadPortraitBtn').onclick = () => {
    if (currentId) {
      const c = chars.find(x => x.id === currentId);
      c.portrait = qs('portraitUrl').value.trim();
      qs('portraitImg').src = c.portrait;
      saveStorage();
    }
  };

  // Auto salvar
  document.querySelectorAll('input, textarea').forEach(el => {
    if (el.id !== 'search') el.addEventListener('change', writeBack);
  });
});
