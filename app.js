const DEFAULT_ATTRIBUTES = ["Jujutsu", "Físico", "Agilidade", "Intelecto", "Carisma"];

let chars = [];
let currentId = null;
let rollHistory = [];

function qs(id) { return document.getElementById(id); }

function makeDefaultChar(name = 'Novo Feiticeiro') {
  const attributes = {};
  DEFAULT_ATTRIBUTES.forEach(a => attributes[a] = 1);

  return {
    id: Date.now().toString(36),
    name, age: '', species: 'Humano', grade: '4', bio: '',
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

function loadStorage() {
  const raw = localStorage.getItem('camellia_chars_v4');
  chars = raw ? JSON.parse(raw) : [makeDefaultChar('Gojo Satoru')];
  saveStorage();
}

function saveStorage() {
  localStorage.setItem('camellia_chars_v4', JSON.stringify(chars));
  renderList();
}

// Cálculo por Espécie (conforme o livro)
function calculateMaxStats(species, attributes) {
  const f = attributes.Físico || 1;
  const j = attributes.Jujutsu || 1;
  const a = attributes.Agilidade || 1;
  const i = attributes.Intelecto || 1;

  let pvBase = 12, peaBase = 16, peBase = 5;

  if (species === "Mestiço" || species === "Híbrido") {
    pvBase = 12; peaBase = 20; peBase = 5;
  } else if (species === "Shimuriano") {
    pvBase = 10; peaBase = 20; peBase = 5;
  } else if (species === "Corpo Amaldiçoado") {
    pvBase = 0; peaBase = 16; peBase = 5;
  }

  return {
    pvMax: pvBase + (f * 8),
    peaMax: peaBase + (j * 6),
    peMax: peBase + (i * 2) + (a * 1)
  };
}

function renderAttributes(c) {
  const container = qs('attributes');
  container.innerHTML = '';

  Object.keys(c.attributes).forEach(key => {
    const div = document.createElement('div');
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <label style="display:inline-block;width:120px">${key}:</label>
      <input type="number" value="${c.attributes[key]}" min="1" max="5" data-key="${key}" style="width:60px">
    `;
    const input = div.querySelector('input');
    input.oninput = () => {
      c.attributes[key] = parseInt(input.value) || 1;
      const stats = calculateMaxStats(c.species, c.attributes);
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
  qs('pvNow').value = c.pvNow || c.pvMax;
  qs('peaMax').value = c.peaMax;
  qs('peaNow').value = c.peaNow || c.peaMax;
  qs('peMax').value = c.peMax;
  qs('peNow').value = c.peNow || c.peMax;

  qs('earCheckbox').checked = !!c.hasEAR;

  renderAttributes(c);
  renderList(qs('search').value);
}

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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  if (chars.length) openChar(chars[0].id);

  qs('saveBtn').onclick = writeBack;
  qs('loadPortraitBtn').onclick = () => {
    if (currentId) {
      const c = chars.find(x => x.id === currentId);
      c.portrait = qs('portraitUrl').value.trim();
      qs('portraitImg').src = c.portrait;
      saveStorage();
    }
  };
});
