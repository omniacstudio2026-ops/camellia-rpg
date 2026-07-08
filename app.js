const DEFAULT_ATTRIBUTES = ["Jujutsu", "Físico", "Agilidade", "Intelecto", "Carisma"];

let chars = [];
let currentId = null;

function qs(id) { return document.getElementById(id); }

function makeDefaultChar(name = 'Teste') {
  const attributes = {};
  DEFAULT_ATTRIBUTES.forEach(a => attributes[a] = 1);
  return { id: Date.now().toString(36), name, attributes, pvMax:20, pvNow:20, peaMax:20, peaNow:20, peMax:8, peNow:8 };
}

function loadStorage() {
  chars = [makeDefaultChar('Gojo Satoru')];
  saveStorage();
}

function saveStorage() {
  localStorage.setItem('camellia_test', JSON.stringify(chars));
}

function renderAttributes(c) {
  const container = qs('attributes');
  if (!container) return;

  container.innerHTML = '';

  Object.keys(c.attributes).forEach(key => {
    const div = document.createElement('div');
    div.style = "margin: 8px 0; display: flex; align-items: center;";
    div.innerHTML = `
      <label style="width: 130px;">${key}:</label>
      <input type="number" value="${c.attributes[key]}" min="1" max="5" style="width: 70px; padding: 6px;" data-key="${key}">
    `;
    
    const input = div.querySelector('input');
    input.onchange = () => {
      c.attributes[key] = parseInt(input.value) || 1;
      updateMaxStats(c);   // <-- Chama o cálculo automático
      saveStorage();
    };
    container.appendChild(div);
  });
}

// Nova função para atualizar status automaticamente
function updateMaxStats(c) {
  const f = c.attributes.Físico || 1;
  const j = c.attributes.Jujutsu || 1;
  const a = c.attributes.Agilidade || 1;
  const i = c.attributes.Intelecto || 1;

  c.pvMax = 12 + (f * 8);
  c.peaMax = 16 + (j * 6);
  c.peMax = 5 + (i * 2) + (a * 1);

  // Atualiza os campos na tela
  qs('pvMax').value = c.pvMax;
  qs('peaMax').value = c.peaMax;
  qs('peMax').value = c.peMax;
}

// Na função openChar, adicione após renderAttributes(c):
updateMaxStats(c);

function openChar(id) {
  const c = chars[0];
  currentId = id;
  renderAttributes(c);
}

document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  openChar(chars[0].id);
  console.log("App carregado - Atributos devem aparecer");
});
