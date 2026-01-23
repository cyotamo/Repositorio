/**********************************************
 * REPOSITÓRIO DE MONOGRAFIAS – FRONTEND
 **********************************************/

const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbylE3js2BLKlqIbTQE_VekBfZhAedYRiJcIdHv2uZQ5g_k6X4vw9A0O18GD85nosccg/exec";

/**********************************************
 * LISTAS CARREGADAS DO BACKEND
 **********************************************/
let cursosDisponiveis = [];
let orientadoresDisponiveis = [];
let anosDisponiveis = [];

/**********************************************
 * VARIÁVEIS DE PAGINAÇÃO E ESTADO
 **********************************************/
let resultadosCompletos = [];
let paginaAtual = 1;
const ITENS_POR_PAGINA = 10;


/**********************************************
 * FUNÇÕES DE INTERFACE
 **********************************************/
function getSearchContainer() {
  return document.getElementById("search-container");
}

function prepararContainer(titulo = "Pesquise aqui") {
  const container = getSearchContainer();

  container.innerHTML = `
    <h2>${titulo}</h2>

    <div id="form-area"></div>

    <div id="resultados" class="results-list"></div>

    <div id="paginacao" class="pagination"></div>
  `;

  return document.getElementById("form-area");
}


/**********************************************
 * FUNÇÃO PARA RENDERIZAR UMA PÁGINA
 **********************************************/
function renderPagina(numeroPagina) {
  paginaAtual = numeroPagina;

  const lista = document.getElementById("resultados");
  const paginacao = document.getElementById("paginacao");

  lista.innerHTML = "";
  paginacao.innerHTML = "";

  if (resultadosCompletos.length === 0) {
    lista.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  const total = resultadosCompletos.length;
  const totalPaginas = Math.ceil(total / ITENS_POR_PAGINA);

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;

  const paginaDados = resultadosCompletos.slice(inicio, fim);

  paginaDados.forEach((item) => {
    const div = document.createElement("article");
    div.className = "result-item";
    div.style.cursor = "pointer";

    div.innerHTML = `
      <p class="result-main-line">
        <span class="result-name">${item.nome}.</span>
        <span class="result-title">${item.tema}</span>
        <span class="result-course"> — ${item.curso}</span>
      </p>
      <p class="result-meta">Orientador: ${item.orientador}</p>
    `;

    div.onclick = () => {
      if (item.link) window.open(item.link, "_blank");
    };

    lista.appendChild(div);
  });

  // PAGINAÇÃO
  let pagHTML = "";

  if (paginaAtual > 1) {
    pagHTML += `<button class="page-btn" data-page="${paginaAtual - 1}">&lt;</button>`;
  }

  pagHTML += `<span class="page-info">Página ${paginaAtual} de ${totalPaginas}</span>`;

  if (paginaAtual < totalPaginas) {
    pagHTML += `<button class="page-btn" data-page="${paginaAtual + 1}">&gt;</button>`;
  }

  paginacao.innerHTML = pagHTML;
}


/**********************************************
 * FUNÇÃO PARA RECEBER RESULTADOS DO BACKEND
 **********************************************/
function processarResultados(json) {
  resultadosCompletos = json.dados || [];
  renderPagina(1);
}


/**********************************************
 * BUSCAR AO APPS SCRIPT
 **********************************************/
function fazerPesquisa(payload) {
  const body = new URLSearchParams({
    action: "repositorioPesquisar",
    curso: "",
    orientador: "",
    ano: "",
    ...payload,
  });

  return fetch(WEBAPP_URL, {
    method: "POST",
    body,
  })
    .then((r) => r.json())
    .then(processarResultados)
    .catch((err) => {
      console.error(err);
      alert("Erro na pesquisa.");
    });
}


/**********************************************
 * CARREGAR LISTAS DINÂMICAS DA PLANILHA
 **********************************************/
function carregarListas() {
  fetch(WEBAPP_URL, {
    method: "POST",
    body: new URLSearchParams({ action: "repositorioListas" }),
  })
    .then((r) => r.json())
    .then((json) => {
      cursosDisponiveis = json.cursos || [];
      orientadoresDisponiveis = json.orientadores || [];
      anosDisponiveis = json.anos || [];
    })
    .catch((err) => console.error("Erro ao carregar listas:", err));
}


/**********************************************
 * FORMULÁRIOS
 **********************************************/

// 🔍 Pesquisa livre
function renderPesquisaLivre() {
  const formArea = prepararContainer("Pesquise aqui");

  formArea.innerHTML = `
    <div class="simple-row">
      <input type="text" id="livre-input" class="simple-input" placeholder="Digite o termo..." />
      <button class="btn-buscar" id="buscar-livre">Buscar</button>
    </div>
  `;

  const botao = document.getElementById("buscar-livre");

  botao.onclick = async () => {
    const termo = document.getElementById("livre-input").value.trim();
    if (!termo) return;

    bloquearBotao(botao);

    try {
      await fazerPesquisa({
        action: "repositorioPesquisar",
        tipo: "livre",
        termo: termo,
      });
    } finally {
      desbloquearBotao(botao);
    }
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

  cursosDisponiveis.forEach((curso) => {
    document.getElementById("curso-input").innerHTML += `<option>${curso}</option>`;
  });

  const botao = document.getElementById("buscar-curso");

  botao.onclick = async () => {
    const curso = document.getElementById("curso-input").value;
    if (!curso) return;

    bloquearBotao(botao);

    try {
      await fazerPesquisa({
        action: "repositorioPesquisar",
        tipo: "curso",
        curso: curso,
      });
    } finally {
      desbloquearBotao(botao);
    }
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

  orientadoresDisponiveis.forEach((o) => {
    document.getElementById("orientador-input").innerHTML += `<option>${o}</option>`;
  });

  const botao = document.getElementById("buscar-orientador");

  botao.onclick = async () => {
    const orientador = document.getElementById("orientador-input").value;
    if (!orientador) return;

    bloquearBotao(botao);

    try {
      await fazerPesquisa({
        action: "repositorioPesquisar",
        tipo: "orientador",
        orientador: orientador,
      });
    } finally {
      desbloquearBotao(botao);
    }
  };
}


// 📅 Pesquisa por ano
function renderPesquisaPorAno() {
  const formArea = prepararContainer("Pesquise aqui");

  formArea.innerHTML = `
    <div class="simple-row">
      <select id="ano-input" class="simple-select">
        <option value="">Seleccione o ano</option>
      </select>
      <button class="btn-buscar" id="buscar-ano">Buscar</button>
    </div>
  `;

  anosDisponiveis.forEach((ano) => {
    document.getElementById("ano-input").innerHTML += `<option>${ano}</option>`;
  });

  const botao = document.getElementById("buscar-ano");

  botao.onclick = async () => {
    const ano = document.getElementById("ano-input").value;
    if (!ano) return;

    bloquearBotao(botao);

    try {
      await fazerPesquisa({
        action: "repositorioPesquisar",
        tipo: "ano",
        ano: ano,
      });
    } finally {
      desbloquearBotao(botao);
    }
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

  const filtroAno = document.getElementById("filtro-ano");
  const filtroCurso = document.getElementById("filtro-curso");
  const filtroOrientador = document.getElementById("filtro-orientador");

  anosDisponiveis.forEach((a) => {
    filtroAno.innerHTML += `<option>${a}</option>`;
  });

  cursosDisponiveis.forEach((c) => {
    filtroCurso.innerHTML += `<option>${c}</option>`;
  });

  orientadoresDisponiveis.forEach((o) => {
    filtroOrientador.innerHTML += `<option>${o}</option>`;
  });

  const botao = document.getElementById("buscar-filtros");

  botao.onclick = async () => {
    bloquearBotao(botao);

    try {
      await fazerPesquisa({
        action: "repositorioPesquisar",
        tipo: "filtros",
        ano: filtroAno.value,
        curso: filtroCurso.value,
        orientador: filtroOrientador.value,
      });
    } finally {
      desbloquearBotao(botao);
    }
  };
}


/**********************************************
 * ÚLTIMAS 5 MONOGRAFIAS
 **********************************************/
function mostrarUltimasPesquisas() {
  iniciarAnimacaoCarregar();

  const container = getSearchContainer();
  container.innerHTML = `
    <h2>Últimas monografias submetidas</h2>
    <p id="loading-text" class="section-subtitle">A carregar</p>
    <div id="ultimas-pesquisas" class="results-list"></div>
  `;

  fetch(WEBAPP_URL, {
    method: "POST",
    body: new URLSearchParams({ action: "repositorioUltimas" }),
  })
    .then((r) => r.json())
    .then((json) => {
      const lista = document.getElementById("ultimas-pesquisas");

      json.dados.forEach((item) => {
        const div = document.createElement("article");
        div.className = "result-item";
        div.style.cursor = "pointer";

        div.innerHTML = `
          <p class="result-main-line">
            <span class="result-name">${item.nome}.</span>
            <span class="result-title">${item.tema}</span>
            <span class="result-course"> — ${item.curso}</span>
          </p>
          <p class="result-meta">Orientador: ${item.orientador}</p>
        `;

        div.onclick = () => window.open(item.link, "_blank");

        lista.appendChild(div);
      });
    })
    .catch((err) => console.error(err))
    .finally(() => {
      pararAnimacaoCarregar();
    });
}

/*************** ANIMAÇÃO "A carregar..." ******************/
let loadingInterval = null;

function iniciarAnimacaoCarregar() {
  const el = document.getElementById("loading-text");
  if (!el) return;

  let pontos = 0;

  loadingInterval = setInterval(() => {
    pontos = (pontos + 1) % 4; // 0,1,2,3
    el.textContent = "A carregar" + ".".repeat(pontos);
  }, 500);
}

function pararAnimacaoCarregar() {
  clearInterval(loadingInterval);

  const el = document.getElementById("loading-text");
  if (el) el.remove(); // remove texto assim que carregar os dados
}

function bloquearBotao(botao) {
  botao.disabled = true;
  botao.dataset.originalText = botao.textContent;
  botao.textContent = "A buscar...";
  botao.classList.add("btn-disabled");
}

function desbloquearBotao(botao) {
  botao.disabled = false;
  botao.textContent = botao.dataset.originalText || "Buscar";
  botao.classList.remove("btn-disabled");
}


/**********************************************
 * EVENTOS DOS BOTÕES DO MENU
 **********************************************/
function prepararEventos() {
  document.getElementById("btn-pesquisa-livre").onclick = renderPesquisaLivre;
  document.getElementById("btn-curso").onclick = renderPesquisaPorCurso;
  document.getElementById("btn-orientador").onclick = renderPesquisaPorOrientador;
  document.getElementById("btn-ano").onclick = renderPesquisaPorAno;
  document.getElementById("btn-filtros").onclick = renderFiltrosCombinados;

  // PAGINAÇÃO
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("page-btn")) {
      const novaPagina = Number(e.target.dataset.page);
      renderPagina(novaPagina);
    }
  });
}


/**********************************************
 * INICIALIZAÇÃO DA PÁGINA
 **********************************************/
document.addEventListener("DOMContentLoaded", () => {
  carregarListas();           // Carregar cursos, orientadores e anos
  prepararEventos();          // Ligar botões
  mostrarUltimasPesquisas();  // Mostrar últimas monografias
});

