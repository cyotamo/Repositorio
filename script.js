// Estrutura base para integrações futuras com Google Sheets, Google Drive e Firebase.

// --- PLACEHOLDERS PARA INTEGRAÇÃO DE DADOS ---

// Aqui será configurada a ligação à Google Sheets para obter dados das monografias
function inicializarConexaoGoogleSheets() {
  // Aqui será implementada a autenticação e ligação à Google Sheet
}

// Aqui será carregada a lista de monografias da Google Sheet
function carregarMonografias() {
  // Aqui será implementado o carregamento de dados e a renderização dinâmica
}

// Aqui será implementada a listagem de PDFs armazenados na Google Drive
function listarPDFs() {
  // Aqui será feita a integração com a API da Google Drive para exibir PDFs
}

// Aqui será configurada a autenticação via Firebase
function configurarAutenticacaoFirebase() {
  // Placeholder para configuração de autenticação segura
}

// Função principal para iniciar o repositório quando a lógica estiver pronta
function inicializarRepositorio() {
  inicializarConexaoGoogleSheets();
  configurarAutenticacaoFirebase();
  // carregarMonografias(); // será activado quando a lógica estiver pronta
}

// --- DADOS FICTÍCIOS PARA "ÚLTIMAS PESQUISAS" ---
// No futuro estes dados virão da Google Sheet.

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

// --- OPÇÕES FICTÍCIAS PARA LISTAS SUSPENSAS ---
// Também serão substituídas por dados da planilha.

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

const anosDisponiveis = [
  '2025',
  '2024',
  '2023',
  '2022',
  '2021'
];

// --- FUNÇÕES DE INTERFACE ---

function getSearchContainer() {
  return document.getElementById('search-container');
}

function limparContainerPesquisa() {
  const container = getSearchContainer();
  if (!container) return;
  container.innerHTML = '';
}

// Renderiza a lista de últimas pesquisas (estado inicial da página)
function mostrarUltimasPesquisas() {
  const container = getSearchContainer();
  if (!container) return;

  container.innerHTML = `
    <h2>Últimas pesquisas submetidas</h2>
    <p class="section-subtitle">
      Estes dados são fictícios e servirão de modelo para a integração com a Google Sheet.
    </p>
    <div id="ultimas-pesquisas" class="results-list"></div>
  `;

  const lista = container.querySelector('#ultimas-pesquisas');

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

// --- FORMULÁRIOS DE PESQUISA ---

function renderPesquisaLivre() {
  limparContainerPesquisa();
  const container = getSearchContainer();
  if (!container) return;

  container.innerHTML = `
    <h2>Pesquisa livre</h2>
    <p class="section-subtitle">
      Pesquise por palavras-chave no nome do estudante, título da monografia ou curso.
    </p>

    <form class="search-form" id="form-pesquisa-livre">
      <div class="search-field">
        <label class="search-label" for="termo-livre">Termo de pesquisa</label>
        <input
          type="text"
          id="termo-livre"
          name="termo"
          class="search-input"
          placeholder="Ex.: microfinanças, inovação, Nampula..."
          required
        >
      </div>

      <button type="submit" class="btn-buscar">
        Buscar
      </button>
    </form>

    <div class="results-list" id="resultados-pesquisa-livre"></div>
  `;

  const form = container.querySelector('#form-pesquisa-livre');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // No futuro: chamar função de pesquisa na Google Sheet
    // pesquisarPorTitulo(event.target.termo.value);
  });
}

function renderPesquisaPorCurso() {
  limparContainerPesquisa();
  const container = getSearchContainer();
  if (!container) return;

  container.innerHTML = `
    <h2>Pesquisa por curso</h2>
    <p class="section-subtitle">
      Selecione um curso para ver as monografias associadas.
    </p>

    <form class="search-form" id="form-pesquisa-curso">
      <div class="search-row">
        <div class="search-field">
          <label class="search-label" for="curso-select">Curso</label>
          <select id="curso-select" name="curso" class="search-select" required>
            <option value="">Seleccione um curso</option>
          </select>
        </div>

        <button type="submit" class="btn-buscar">
          Buscar
        </button>
      </div>
    </form>

    <div class="results-list" id="resultados-curso"></div>
  `;

  const selectCurso = container.querySelector('#curso-select');
  cursosDisponiveis.forEach((curso) => {
    const opt = document.createElement('option');
    opt.value = curso;
    opt.textContent = curso;
    selectCurso.appendChild(opt);
  });

  const form = container.querySelector('#form-pesquisa-curso');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const curso = event.target.curso.value;
    // No futuro: pesquisarPorCurso(curso);
  });
}

function renderPesquisaPorOrientador() {
  limparContainerPesquisa();
  const container = getSearchContainer();
  if (!container) return;

  container.innerHTML = `
    <h2>Pesquisa por orientador</h2>
    <p class="section-subtitle">
      Selecione um orientador para ver as monografias orientadas por ele.
    </p>

    <form class="search-form" id="form-pesquisa-orientador">
      <div class="search-row">
        <div class="search-field">
          <label class="search-label" for="orientador-select">Orientador</label>
          <select id="orientador-select" name="orientador" class="search-select" required>
            <option value="">Seleccione um orientador</option>
          </select>
        </div>

        <button type="submit" class="btn-buscar">
          Buscar
        </button>
      </div>
    </form>

    <div class="results-list" id="resultados-orientador"></div>
  `;

  const selectOrientador = container.querySelector('#orientador-select');
  orientadoresDisponiveis.forEach((nome) => {
    const opt = document.createElement('option');
    opt.value = nome;
    opt.textContent = nome;
    selectOrientador.appendChild(opt);
  });

  const form = container.querySelector('#form-pesquisa-orientador');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const orientador = event.target.orientador.value;
    // No futuro: pesquisarPorOrientador(orientador);
  });
}

function renderPesquisaPorAno() {
  limparContainerPesquisa();
  const container = getSearchContainer();
  if (!container) return;

  container.innerHTML = `
    <h2>Pesquisa por ano</h2>
    <p class="section-subtitle">
      Selecione o ano de defesa das monografias.
    </p>

    <form class="search-form" id="form-pesquisa-ano">
      <div class="search-row">
        <div class="search-field">
          <label class="search-label" for="ano-select">Ano</label>
          <select id="ano-select" name="ano" class="search-select" required>
            <option value="">Seleccione um ano</option>
          </select>
        </div>

        <button type="submit" class="btn-buscar">
          Buscar
        </button>
      </div>
    </form>

    <div class="results-list" id="resultados-ano"></div>
  `;

  const selectAno = container.querySelector('#ano-select');
  anosDisponiveis.forEach((ano) => {
    const opt = document.createElement('option');
    opt.value = ano;
    opt.textContent = ano;
    selectAno.appendChild(opt);
  });

  const form = container.querySelector('#form-pesquisa-ano');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const ano = event.target.ano.value;
    // No futuro: pesquisarPorAno(ano);
  });
}

function renderFiltrosCombinados() {
  limparContainerPesquisa();
  const container = getSearchContainer();
  if (!container) return;

  container.innerHTML = `
    <h2>Filtros combinados</h2>
    <p class="section-subtitle">
      Combine curso, orientador e ano para refinar a pesquisa.
    </p>

    <form class="search-form" id="form-filtros-combinados">
      <div class="search-row">
        <div class="search-field">
          <label class="search-label" for="curso-filtro">Curso</label>
          <select id="curso-filtro" name="curso" class="search-select">
            <option value="">Todos os cursos</option>
          </select>
        </div>

        <div class="search-field">
          <label class="search-label" for="orientador-filtro">Orientador</label>
          <select id="orientador-filtro" name="orientador" class="search-select">
            <option value="">Todos os orientadores</option>
          </select>
        </div>

        <div class="search-field">
          <label class="search-label" for="ano-filtro">Ano</label>
          <select id="ano-filtro" name="ano" class="search-select">
            <option value="">Todos os anos</option>
          </select>
        </div>

        <button type="submit" class="btn-buscar">
          Buscar
        </button>
      </div>
    </form>

    <div class="results-list" id="resultados-filtros"></div>
  `;

  const selectCurso = container.querySelector('#curso-filtro');
  const selectOrientador = container.querySelector('#orientador-filtro');
  const selectAno = container.querySelector('#ano-filtro');

  cursosDisponiveis.forEach((curso) => {
    const opt = document.createElement('option');
    opt.value = curso;
    opt.textContent = curso;
    selectCurso.appendChild(opt);
  });

  orientadoresDisponiveis.forEach((nome) => {
    const opt = document.createElement('option');
    opt.value = nome;
    opt.textContent = nome;
    selectOrientador.appendChild(opt);
  });

  anosDisponiveis.forEach((ano) => {
    const opt = document.createElement('option');
    opt.value = ano;
    opt.textContent = ano;
    selectAno.appendChild(opt);
  });

  const form = container.querySelector('#form-filtros-combinados');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const curso = event.target.curso.value;
    const orientador = event.target.orientador.value;
    const ano = event.target.ano.value;
    // No futuro: combinação de filtros para pesquisar na Google Sheet
    // pesquisarComFiltros({ curso, orientador, ano });
  });
}

// --- PLACEHOLDERS DE LÓGICA DE PESQUISA (a integrar com Google Sheets) ---

function pesquisarPorTitulo(termo) {
  // Lógica futura de filtragem por título na planilha
}

function pesquisarPorCurso(curso) {
  // Lógica futura de filtragem por curso na planilha
}

function pesquisarPorOrientador(nomeOrientador) {
  // Lógica futura de filtragem por orientador na planilha
}

function pesquisarPorAno(ano) {
  // Lógica futura de filtragem por ano na planilha
}

// --- LIGAÇÃO DOS BOTÕES ÀS VISTAS ---

function prepararEventos() {
  const btnPesquisaLivre = document.getElementById('btn-pesquisa-livre');
  const btnCurso = document.getElementById('btn-curso');
  const btnOrientador = document.getElementById('btn-orientador');
  const btnAno = document.getElementById('btn-ano');
  const btnFiltros = document.getElementById('btn-filtros');

  if (btnPesquisaLivre) {
    btnPesquisaLivre.addEventListener('click', renderPesquisaLivre);
  }

  if (btnCurso) {
    btnCurso.addEventListener('click', renderPesquisaPorCurso);
  }

  if (btnOrientador) {
    btnOrientador.addEventListener('click', renderPesquisaPorOrientador);
  }

  if (btnAno) {
    btnAno.addEventListener('click', renderPesquisaPorAno);
  }

  if (btnFiltros) {
    btnFiltros.addEventListener('click', renderFiltrosCombinados);
  }
}

// --- INICIALIZAÇÃO DA PÁGINA ---

document.addEventListener('DOMContentLoaded', () => {
  prepararEventos();
  inicializarRepositorio();   // pronto para futuras integrações
  mostrarUltimasPesquisas();  // estado inicial: últimas 5 pesquisas
});
