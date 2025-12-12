const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwianMYwt_3V5yjE8awonLgh4z-xw0AFCYWM6w_KUDk1Pac-D0V5-fR7VKpmllJAujBVA/exec";

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

let ultimaPesquisaPayload = null;

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

function renderResultados(json) {
  const lista = document.getElementById('resultados');
  if (!lista) return;

  lista.innerHTML = '';

  const dados = json?.dados || json?.resultados || [];
  const paginaAtual = Number(json?.pagina) || 1;
  const totalPaginas = Number(json?.totalPaginas) || Math.max(1, Math.ceil((json?.total || dados.length) / 10));

  if (!dados.length) {
    lista.innerHTML = '<p class="section-subtitle">Nenhum resultado encontrado.</p>';
    return;
  }

  dados.slice(0, 10).forEach(item => {
    const artigo = document.createElement('article');
    artigo.className = 'result-item';

    const titulo = item.titulo || item.Titulo || 'Monografia sem título';
    const autor = item.autor || item.Autor || item.nome || 'Autor desconhecido';
    const curso = item.curso || item.Curso || '';
    const orientador = item.orientador || item.Orientador || '';
    const ano = item.ano || item.Ano || '';
    const link = item.link || item.url || item.URL || item.L || '#';

    artigo.innerHTML = `
      <p class="result-main-line">
        <span class="result-name">${autor}.</span>
        <span class="result-title">${titulo}</span>
        ${curso ? `<span class="result-course"> — ${curso}</span>` : ''}
      </p>
      <p class="result-meta">${[orientador && `Orientador: ${orientador}`, ano && `Ano: ${ano}`].filter(Boolean).join(' | ')}</p>
    `;

    if (link && link !== '#') {
      artigo.addEventListener('click', () => window.open(link, '_blank'));
      artigo.style.cursor = 'pointer';
    }

    lista.appendChild(artigo);
  });

  if (totalPaginas > 1) {
    const paginacao = document.createElement('div');
    paginacao.className = 'pagination';

    for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
      const botao = document.createElement('button');
      botao.className = 'page-btn';
      botao.textContent = pagina;
      if (pagina === paginaAtual) {
        botao.disabled = true;
        botao.ariaCurrent = 'page';
      }

      botao.addEventListener('click', () => {
        if (!ultimaPesquisaPayload) return;
        const novoPayload = { ...ultimaPesquisaPayload, pagina };
        realizarPesquisa(novoPayload);
      });

      paginacao.appendChild(botao);
    }

    lista.appendChild(paginacao);
  }
}

function mostrarUltimasPesquisas() {
  const container = getSearchContainer();

  container.innerHTML = `
    <h2>Últimas pesquisas submetidas</h2>
    <div id="ultimas-pesquisas" class="results-list"></div>
  `;

  fetch(WEBAPP_URL, {
    method: "POST",
    body: new URLSearchParams({ action: "repositorioUltimas" })
  })
    .then(r => r.json())
    .then(json => {
      const lista = document.getElementById('ultimas-pesquisas');
      if (!lista) return;
      lista.innerHTML = '';

      const dados = json?.dados || json?.resultados || [];
      dados.slice(0, 5).forEach(item => {
        const artigo = document.createElement('article');
        artigo.className = 'result-item';

        const titulo = item.titulo || item.Titulo || 'Monografia sem título';
        const autor = item.autor || item.Autor || item.nome || 'Autor desconhecido';
        const curso = item.curso || item.Curso || '';
        const orientador = item.orientador || item.Orientador || '';

        artigo.innerHTML = `
          <p class="result-main-line">
            <span class="result-name">${autor}.</span>
            <span class="result-title">${titulo}</span>
            ${curso ? `<span class="result-course"> — ${curso}</span>` : ''}
          </p>
          <p class="result-meta">${orientador ? `Orientador: ${orientador}` : ''}</p>
        `;

        lista.appendChild(artigo);
      });
    })
    .catch(() => {
      const lista = document.getElementById('ultimas-pesquisas');
      if (lista) {
        lista.innerHTML = '<p class="section-subtitle">Não foi possível carregar as últimas pesquisas.</p>';
      }
    });
}

function realizarPesquisa(payload) {
  ultimaPesquisaPayload = payload;

  fetch(WEBAPP_URL, {
    method: "POST",
    body: new URLSearchParams(payload)
  })
    .then(r => r.json())
    .then(renderResultados);
}

function renderPesquisaLivre() {
  const formArea = prepararContainer("Pesquise aqui");

  formArea.innerHTML = `
    <div class="simple-row">
      <input type="text" id="livre-input" class="simple-input" placeholder="Digite o termo..." />
      <button class="btn-buscar" id="buscar-livre">Buscar</button>
    </div>
  `;

  document.getElementById("buscar-livre").onclick = () => {
    const termo = document.getElementById("livre-input").value.trim();
    realizarPesquisa({
      action: "repositorioPesquisar",
      tipo: "livre",
      termo,
      pagina: 1
    });
  };
}

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

  const select = document.getElementById("curso-input");
  cursosDisponiveis.forEach(curso => {
    select.innerHTML += `<option value="${curso}">${curso}</option>`;
  });

  document.getElementById("buscar-curso").onclick = () => {
    const curso = select.value;
    realizarPesquisa({
      action: "repositorioPesquisar",
      tipo: "curso",
      curso,
      pagina: 1
    });
  };
}

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

  const select = document.getElementById("orientador-input");
  orientadoresDisponiveis.forEach(o => {
    select.innerHTML += `<option value="${o}">${o}</option>`;
  });

  document.getElementById("buscar-orientador").onclick = () => {
    const orientador = select.value;
    realizarPesquisa({
      action: "repositorioPesquisar",
      tipo: "orientador",
      orientador,
      pagina: 1
    });
  };
}

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

  const select = document.getElementById("ano-input");
  anosDisponiveis.forEach(ano => {
    select.innerHTML += `<option value="${ano}">${ano}</option>`;
  });

  document.getElementById("buscar-ano").onclick = () => {
    const ano = select.value;
    realizarPesquisa({
      action: "repositorioPesquisar",
      tipo: "ano",
      ano,
      pagina: 1
    });
  };
}

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

  const selectAno = document.getElementById("filtro-ano");
  anosDisponiveis.forEach(a => {
    selectAno.innerHTML += `<option>${a}</option>`;
  });

  const selectCurso = document.getElementById("filtro-curso");
  cursosDisponiveis.forEach(c => {
    selectCurso.innerHTML += `<option>${c}</option>`;
  });

  const selectOrientador = document.getElementById("filtro-orientador");
  orientadoresDisponiveis.forEach(o => {
    selectOrientador.innerHTML += `<option>${o}</option>`;
  });

  document.getElementById("buscar-filtros").onclick = () => {
    realizarPesquisa({
      action: "repositorioPesquisar",
      tipo: "filtros",
      ano: selectAno.value,
      curso: selectCurso.value,
      orientador: selectOrientador.value,
      pagina: 1
    });
  };
}

function prepararEventos() {
  document.getElementById('btn-pesquisa-livre').onclick = renderPesquisaLivre;
  document.getElementById('btn-curso').onclick = renderPesquisaPorCurso;
  document.getElementById('btn-orientador').onclick = renderPesquisaPorOrientador;
  document.getElementById('btn-ano').onclick = renderPesquisaPorAno;
  document.getElementById('btn-filtros').onclick = renderFiltrosCombinados;
}

document.addEventListener('DOMContentLoaded', () => {
  prepararEventos();
  mostrarUltimasPesquisas();
});
