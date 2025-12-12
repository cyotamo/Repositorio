// -----------------------------
// DADOS FICTÍCIOS (Últimas pesquisas)
// -----------------------------

const dadosUltimasPesquisas = [
  {
    nome: 'Ana Joaquim',
    titulo: 'Impacto das microfinanças no empoderamento feminino em Nampula',
    curso: 'Finanças e Comércio Internacional',
    orientador: 'Prof. Dr. João Matos'
  },
  {
    nome: 'Carlos Muianga',
    titulo: 'Gestão de recursos humanos e desempenho organizacional em escolas públicas',
    curso: 'Gestão de Recursos Humanos',
    orientador: 'Profa. Dra. Lurdes Mbanze'
  },
  {
    nome: 'Helena Tomás',
    titulo: 'Economia digital e inclusão financeira em Moçambique',
    curso: 'Economia',
    orientador: 'Prof. Dr. Luís Macamo'
  },
  {
    nome: 'Joaquim Mussa',
    titulo: 'Empreendedorismo juvenil e criação de emprego em Nampula',
    curso: 'Gestão de Negócios',
    orientador: 'Profa. Dra. Marta Correia'
  },
  {
    nome: 'Sara João',
    titulo: 'Transparência nas parcerias público-privadas em Moçambique',
    curso: 'Administração Pública',
    orientador: 'Prof. Dr. Alberto Cossa'
  }
];


// -----------------------------
// LISTAS SUSPENSAS FICTÍCIAS
// -----------------------------

const cursosDisponiveis = [
  'Finanças e Comércio Internacional',
  'Gestão de Recursos Humanos',
  'Gestão de Negócios',
  'Economia',
  'Administração Pública'
];

const orientadoresDisponiveis = [
  'Prof. Dr. João Matos',
  'Profa. Dra. Lurdes Mbanze',
  'Prof. Dr. Luís Macamo',
  'Profa. Dra. Marta Correia',
  'Prof. Dr. Alberto Cossa'
];

const anosDisponiveis = ['2025', '2024', '2023', '2022', '2021'];


// -----------------------------
// FUNÇÕES DE INTERFACE
// -----------------------------

function getSearchContainer() {
  return document.getElementById('search-container');
}

function prepararContainer(titulo = "Pesquise aqui") {
  const container = getSearchContainer();

  container.innerHTML = `
    <h2>${titulo}</h2>
    <div id="form-area"></div>
    <div id="resultados" class="results-list"></div>
  `;

  return document.getElementById("form-area");
}


// -----------------------------
// EXIBIR ÚLTIMAS PESQUISAS (INÍCIO DA PÁGINA)
// -----------------------------

function mostrarUltimasPesquisas() {
  const container = getSearchContainer();

  container.innerHTML = `
    <h2>Últimas pesquisas submetidas</h2>
    <div id="ultimas-pesquisas" class="results-list"></div>
  `;

  const lista = document.getElementById('ultimas-pesquisas');

  dadosUltimasPesquisas.forEach((item) => {
    const artigo = document.createElement('article');
    artigo.className = 'result-item';

    artigo.innerHTML = `
      <p class="result-main-line">
        <span class="result-name">${item.nome}.</span>
        <span class="result-title">${item.titulo}</span>
        <span class="result-course"> — ${item.curso}</span>
      </p>
      <p class="result-meta">Orientador: ${item.orientador}</p>
    `;

    lista.appendChild(artigo);
  });
}


// -----------------------------
// FORMULÁRIOS SIMPLES
// -----------------------------

// 🔍 Pesquisa livre
function renderPesquisaLivre() {
  const formArea = prepararContainer("Pesquise aqui");

  formArea.innerHTML = `
    <div class="simple-row">
      <input type="text" id="livre-input" class="simple-input" placeholder="Digite o termo..." />
      <button class="btn-buscar" id="buscar-livre">Buscar</button>
    </div>
  `;

  document.getElementById("buscar-livre").onclick = () => {
    console.log("Pesquisando termo:", document.getElementById("livre-input").value);
  };
}


// 🎓 Pesquisa por curso
function renderPesquisaPorCurso() {
  const formArea = prepararContainer("Pesquise aqui");

  formArea.innerHTML = `
    <div class="simple-row">
      <select id="curso-input" class="simple-select">
        <option value="">Seleccione um curso</option>
      </select>
      <button class="btn-buscar" id="buscar-curso">Buscar</button>
    </div>
  `;

  cursosDisponiveis.forEach(curso => {
    document.getElementById("curso-input").innerHTML += `<option value="${curso}">${curso}</option>`;
  });

  document.getElementById("buscar-curso").onclick = () => {
    console.log("Pesquisar curso:", document.getElementById("curso-input").value);
  };
}


// 👨‍🏫 Pesquisa por orientador
function renderPesquisaPorOrientador() {
  const formArea = prepararContainer("Pesquise aqui");

  formArea.innerHTML = `
    <div class="simple-row">
      <select id="orientador-input" class="simple-select">
        <option value="">Seleccione um orientador</option>
      </select>
      <button class="btn-buscar" id="buscar-orientador">Buscar</button>
    </div>
  `;

  orientadoresDisponiveis.forEach(o => {
    document.getElementById("orientador-input").innerHTML += `<option value="${o}">${o}</option>`;
  });

  document.getElementById("buscar-orientador").onclick = () => {
    console.log("Pesquisar orientador:", document.getElementById("orientador-input").value);
  };
}


// 📅 Pesquisa por ano
function renderPesquisaPorAno() {
  const formArea = prepararContainer("Pesquise aqui");

  formArea.innerHTML = `
    <div class="simple-row">
      <select id="ano-input" class="simple-select">
        <option value="">Seleccione um ano</option>
      </select>
      <button class="btn-buscar" id="buscar-ano">Buscar</button>
    </div>
  `;

  anosDisponiveis.forEach(ano => {
    document.getElementById("ano-input").innerHTML += `<option value="${ano}">${ano}</option>`;
  });

  document.getElementById("buscar-ano").onclick = () => {
    console.log("Pesquisar ano:", document.getElementById("ano-input").value);
  };
}


// ⚙️ Filtros combinados
function renderFiltrosCombinados() {
  const formArea = prepararContainer("Pesquise aqui");

  formArea.innerHTML = `
    <div class="simple-row">
      <select id="filtro-ano" class="simple-select">
        <option value="">Ano</option>
      </select>

      <select id="filtro-curso" class="simple-select">
        <option value="">Curso</option>
      </select>

      <select id="filtro-orientador" class="simple-select">
        <option value="">Orientador</option>
      </select>

      <button class="btn-buscar" id="buscar-filtros">Buscar</button>
    </div>
  `;

  anosDisponiveis.forEach(a => {
    document.getElementById("filtro-ano").innerHTML += `<option>${a}</option>`;
  });

  cursosDisponiveis.forEach(c => {
    document.getElementById("filtro-curso").innerHTML += `<option>${c}</option>`;
  });

  orientadoresDisponiveis.forEach(o => {
    document.getElementById("filtro-orientador").innerHTML += `<option>${o}</option>`;
  });

  document.getElementById("buscar-filtros").onclick = () => {
    console.log({
      ano: document.getElementById("filtro-ano").value,
      curso: document.getElementById("filtro-curso").value,
      orientador: document.getElementById("filtro-orientador").value
    });
  };
}


// -----------------------------
// LIGAR BOTÕES
// -----------------------------

function prepararEventos() {
  document.getElementById('btn-pesquisa-livre').onclick = renderPesquisaLivre;
  document.getElementById('btn-curso').onclick = renderPesquisaPorCurso;
  document.getElementById('btn-orientador').onclick = renderPesquisaPorOrientador;
  document.getElementById('btn-ano').onclick = renderPesquisaPorAno;
  document.getElementById('btn-filtros').onclick = renderFiltrosCombinados;
}


// -----------------------------
// INICIAR A PÁGINA
// -----------------------------

document.addEventListener('DOMContentLoaded', () => {
  prepararEventos();
  mostrarUltimasPesquisas();
});
