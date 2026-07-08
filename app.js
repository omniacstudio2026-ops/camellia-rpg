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
    div.innerHTML = `<label>${key}:</label> <input type="number" value="${c.attributes[key]}" style="width:60px">`;
    container.appendChild(div);
  });
}

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
