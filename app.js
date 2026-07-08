const DEFAULT_ATTRIBUTES = ["Jujutsu", "Físico", "Agilidade", "Intelecto", "Carisma"];

let chars = [];
let currentId = null;
let rollHistory = [];

function qs(id) { return document.getElementById(id); }

// ==================== Criação de Ficha ====================
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
    repertoire: '',
    equipment: '',
    pvMax: 20, pvNow: 20,
    peaMax: 20, peaNow: 20,
    peMax: 8, peNow: 8
  };
}

// ==================== Storage ====================
function loadStorage() {
  const raw = localStorage.getItem('camellia_chars_v3');
  chars = raw ? JSON.parse(raw) : [makeDefaultChar('Gojo Satoru')];
  saveStorage();
}

function saveStorage() {
  localStorage.setItem('camellia_chars_v3', JSON.stringify(chars));
  renderList();
}

// ==================== Cálculo Automático ====================
function calculateMaxStats(attributes) {
  const fisico = attributes.Físico || 1;
  const jujutsu = attributes.Jujutsu || 1;
  const agilidade = attributes.Agilidade || 1;
  const intelecto = attributes.Intelecto || 1;

  return {
    pvMax: 12 + (fisico * 8),      // Humano base
    peaMax: 16 + (jujutsu * 6),
    peMax: 5 + (intelecto * 2) + (agilidade * 1)
  };
}

// ==================== Renderizar Atributos ====================
function renderAttributes(c) {
  const container = qs('attributes');
  container.innerHTML = '';

  Object.keys(c.attributes).forEach(key => {
    const div = document.createElement('div');
    div.className = 'attr-row';
    div.innerHTML = `
      <label>${key}</label>
      <input type="number" value="${c.attributes[key]}" min="1" max="5" data-key="${key}">
    `;
    const input = div.querySelector('input');
    input.onchange = () => {
      c.attributes[key] = parseInt(input.value) || 1;
      updateMaxStats(c);
      saveStorage();
    };
    container.appendChild(div);
  });
}

function updateMaxStats(c) {
  const stats = calculateMaxStats(c.attributes);
  c.pvMax = stats.pvMax;
  c.peaMax = stats.peaMax;
  c.peMax = stats.peMax;

  qs('pvMax').value = c.pvMax;
  qs('peaMax').value = c.peaMax;
  qs('peMax').value = c.peMax;
}

// ==================== Open Char ====================
function openChar(id) {
  const c = chars.find(x => x.id === id);
  if (!c) return;
  currentId = id;

  // Preencher campos
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

  qs('pvMax').value = c.pvMax;
  qs('pvNow').value = c.pvNow || c.pvMax;
  qs('peaMax').value = c.peaMax;
  qs('peaNow').value = c.peaNow || c.peaMax;
  qs('peMax').value = c.peMax;
  qs('peNow').value = c.peNow || c.peMax;

  qs('earCheckbox').checked = !!c.hasEAR;

  renderAttributes(c);
  renderList(qs('search').value);
}

// ==================== Salvamento ====================
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
  c.hasEAR = qs('earCheckbox').checked;

  c.pvNow = parseInt(qs('pvNow').value) || 0;
  c.peaNow = parseInt(qs('peaNow').value) || 0;
  c.peNow = parseInt(qs('peNow').value) || 0;

  saveStorage();
}

// ==================== Inicialização ====================
document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  renderList();

  if (chars.length) openChar(chars[0].id);

  // Listeners
  qs('saveBtn').onclick = writeBack;
  qs('rollBtn').onclick = () => rollDice(parseInt(qs('rollMod').value) || 0);
  qs('loadPortraitBtn').onclick = () => {
    if (currentId) {
      const c = chars.find(x => x.id === currentId);
      c.portrait = qs('portraitUrl').value.trim();
      qs('portraitImg').src = c.portrait || '';
      saveStorage();
    }
  };

  // Auto-save
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('change', writeBack);
  });
});

// Função de rolagem (mesma de antes)
function rollDice(mod = 0) {
  // ... (mantenha a função de rolagem anterior)
}
