const timesContainer = document.getElementById('times-container');
const jogadoresContainer = document.getElementById('jogadores-container');
const searchInput = document.getElementById('search-input');
const btnTimes = document.getElementById('btn-times');
const btnJogadores = document.getElementById('btn-jogadores');
const loader = document.getElementById('loader');

// Redirecionamentos com loader
function redirecionarComLoader(url) {
  loader.classList.remove('hidden');
  setTimeout(() => {
    window.location.href = url;
  }, 800);
}

// Links com loader
document.getElementById('link-home').addEventListener('click', (e) => {
  e.preventDefault();
  redirecionarComLoader('index.html');
});
document.getElementById('link-sobre').addEventListener('click', (e) => {
  e.preventDefault();
  redirecionarComLoader('sobre.html');
});
document.getElementById('link-esportes').addEventListener('click', (e) => {
  e.preventDefault();
  redirecionarComLoader('esportes.html');
});
document.getElementById('link-home-logo').addEventListener('click', () => {
  redirecionarComLoader('index.html');
});

// Mostrar loader durante busca
function mostrarLoaderDuranteBusca(callback) {
  loader.classList.remove('hidden');
  setTimeout(() => {
    callback();
    loader.classList.add('hidden');
  }, 1000);
}

btnTimes.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    mostrarLoaderDuranteBusca(() => buscarTimes(query));
  }
});

btnJogadores.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    mostrarLoaderDuranteBusca(() => buscarJogadores(query));
  }
});

function limparContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function criarElementoTexto(tag, texto) {
  const elemento = document.createElement(tag);
  elemento.textContent = texto;
  return elemento;
}

function buscarTimes(query) {
  limparContainer(timesContainer);
  limparContainer(jogadoresContainer);

  fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.teams) {
        data.teams.forEach(time => {
          const card = document.createElement('div');
          card.className = 'card-time';
          
          const img = document.createElement('img');
          img.src = time.strTeamBadge;
          img.alt = time.strTeam;
          
          const h3 = criarElementoTexto('h3', time.strTeam);
          
          const pEstadio = criarElementoTexto('p', `Estádio: ${time.strStadium || 'N/A'}`);
          const pPais = criarElementoTexto('p', `País: ${time.strCountry || 'N/A'}`);
          const pEsporte = criarElementoTexto('p', `Esporte: ${time.strSport || 'N/A'}`);
          
          card.appendChild(img);
          card.appendChild(h3);
          card.appendChild(pEstadio);
          card.appendChild(pPais);
          card.appendChild(pEsporte);
          
          card.addEventListener('click', () => {
            mostrarDetalhesTime(time);
          });
          
          timesContainer.appendChild(card);
        });
      } else {
        timesContainer.appendChild(criarElementoTexto('p', 'Nenhum time encontrado.'));
      }
    });
}

function buscarJogadores(query) {
  limparContainer(timesContainer);
  limparContainer(jogadoresContainer);

  fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.player) {
        data.player.forEach(jogador => {
          const card = document.createElement('div');
          card.className = 'card-jogador';
          
          const img = document.createElement('img');
          img.src = jogador.strCutout || jogador.strThumb || 'default-player.png';
          img.alt = jogador.strPlayer;
          
          const h3 = criarElementoTexto('h3', jogador.strPlayer);
          
          const pTime = criarElementoTexto('p', `Time: ${jogador.strTeam || 'N/A'}`);
          const pPais = criarElementoTexto('p', `País: ${jogador.strNationality || 'N/A'}`);
          const pPosicao = criarElementoTexto('p', `Posição: ${jogador.strPosition || 'N/A'}`);
          
          card.appendChild(img);
          card.appendChild(h3);
          card.appendChild(pTime);
          card.appendChild(pPais);
          card.appendChild(pPosicao);
          
          card.addEventListener('click', () => {
            mostrarDetalhesJogador(jogador);
          });
          
          jogadoresContainer.appendChild(card);
        });
      } else {
        jogadoresContainer.appendChild(criarElementoTexto('p', 'Nenhum jogador encontrado.'));
      }
    });
}

// Função para abrir o modal com as informações
function openModal(content) {
  const modal = document.getElementById('info-modal');
  const modalContent = document.getElementById('modal-content');
  
  limparContainer(modalContent);
  modalContent.appendChild(content);
  modal.style.display = 'block';
  
  // Fechar modal ao clicar no X
  document.querySelector('.close-modal').onclick = function() {
    modal.style.display = 'none';
  };
  
  // Fechar modal ao clicar fora do conteúdo
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

// Função para mostrar detalhes do time no modal
function mostrarDetalhesTime(time) {
  const container = document.createElement('div');
  
  const infoPrincipal = document.createElement('div');
  infoPrincipal.className = 'modal-info';
  
  const h2 = criarElementoTexto('h2', time.strTeam);
  
  const img = document.createElement('img');
  img.src = time.strTeamBadge;
  img.alt = time.strTeam;
  img.className = 'modal-img';
  
  infoPrincipal.appendChild(h2);
  infoPrincipal.appendChild(img);
  container.appendChild(infoPrincipal);
  
  function adicionarInfo(titulo, valor) {
    const divInfo = document.createElement('div');
    divInfo.className = 'modal-info';
    
    const h3 = criarElementoTexto('h3', titulo);
    const p = criarElementoTexto('p', valor || 'N/A');
    
    divInfo.appendChild(h3);
    divInfo.appendChild(p);
    container.appendChild(divInfo);
  }
  
  adicionarInfo('País:', time.strCountry);
  adicionarInfo('Liga:', time.strLeague);
  adicionarInfo('Ano de Fundação:', time.intFormedYear);
  adicionarInfo('Estádio:', time.strStadium);
  adicionarInfo('Descrição:', time.strDescriptionEN || 'Descrição não disponível');
  
  openModal(container);
}

// Função para mostrar detalhes do jogador no modal
function mostrarDetalhesJogador(jogador) {
  const container = document.createElement('div');
  
  const infoPrincipal = document.createElement('div');
  infoPrincipal.className = 'modal-info';
  
  const h2 = criarElementoTexto('h2', jogador.strPlayer);
  
  infoPrincipal.appendChild(h2);
  
  if (jogador.strCutout) {
    const img = document.createElement('img');
    img.src = jogador.strCutout;
    img.alt = jogador.strPlayer;
    img.className = 'modal-img';
    infoPrincipal.appendChild(img);
  }
  
  container.appendChild(infoPrincipal);
  
  function adicionarInfo(titulo, valor) {
    const divInfo = document.createElement('div');
    divInfo.className = 'modal-info';
    
    const h3 = criarElementoTexto('h3', titulo);
    const p = criarElementoTexto('p', valor || 'N/A');
    
    divInfo.appendChild(h3);
    divInfo.appendChild(p);
    container.appendChild(divInfo);
  }
  
  adicionarInfo('Nacionalidade:', jogador.strNationality);
  adicionarInfo('Time:', jogador.strTeam);
  adicionarInfo('Posição:', jogador.strPosition);
  adicionarInfo('Data de Nascimento:', jogador.dateBorn);
  adicionarInfo('Descrição:', jogador.strDescriptionEN || 'Descrição não disponível');
  
  openModal(container);
}