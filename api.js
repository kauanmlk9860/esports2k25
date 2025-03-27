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

function buscarTimes(query) {
  timesContainer.innerHTML = '';
  jogadoresContainer.innerHTML = '';

  fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.teams) {
        data.teams.forEach(time => {
          const card = document.createElement('div');
          card.className = 'card-time';
          card.innerHTML = `
            <img src="${time.strTeamBadge}" alt="${time.strTeam}" />
            <h3>${time.strTeam}</h3>
            <p><strong>Estádio:</strong> ${time.strStadium || 'N/A'}</p>
            <p><strong>País:</strong> ${time.strCountry || 'N/A'}</p>
            <p><strong>Esporte:</strong> ${time.strSport || 'N/A'}</p>
          `;
          
          // Adiciona o evento de clique diretamente no card
          card.addEventListener('click', () => {
            mostrarDetalhesTime(time);
          });
          
          timesContainer.appendChild(card);
        });
      } else {
        timesContainer.innerHTML = '<p>Nenhum time encontrado.</p>';
      }
    });
}

function buscarJogadores(query) {
  timesContainer.innerHTML = '';
  jogadoresContainer.innerHTML = '';

  fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.player) {
        data.player.forEach(jogador => {
          const card = document.createElement('div');
          card.className = 'card-jogador';
          card.innerHTML = `
            <img src="${jogador.strCutout || jogador.strThumb || 'default-player.png'}" alt="${jogador.strPlayer}" />
            <h3>${jogador.strPlayer}</h3>
            <p><strong>Time:</strong> ${jogador.strTeam || 'N/A'}</p>
            <p><strong>País:</strong> ${jogador.strNationality || 'N/A'}</p>
            <p><strong>Posição:</strong> ${jogador.strPosition || 'N/A'}</p>
          `;
          
          // Adiciona o evento de clique diretamente no card
          card.addEventListener('click', () => {
            mostrarDetalhesJogador(jogador);
          });
          
          jogadoresContainer.appendChild(card);
        });
      } else {
        jogadoresContainer.innerHTML = '<p>Nenhum jogador encontrado.</p>';
      }
    });
}

// Função para abrir o modal com as informações
function openModal(content) {
  const modal = document.getElementById('info-modal');
  const modalContent = document.getElementById('modal-content');
  
  modalContent.innerHTML = content;
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
  const content = `
    <div class="modal-info">
      <h2>${time.strTeam}</h2>
      <img src="${time.strTeamBadge}" alt="${time.strTeam}" class="modal-img">
    </div>
    <div class="modal-info">
      <h3>País:</h3>
      <p>${time.strCountry || 'N/A'}</p>
    </div>
    <div class="modal-info">
      <h3>Liga:</h3>
      <p>${time.strLeague || 'N/A'}</p>
    </div>
    <div class="modal-info">
      <h3>Ano de Fundação:</h3>
      <p>${time.intFormedYear || 'N/A'}</p>
    </div>
    <div class="modal-info">
      <h3>Estádio:</h3>
      <p>${time.strStadium || 'N/A'}</p>
    </div>
    <div class="modal-info">
      <h3>Descrição:</h3>
      <p>${time.strDescriptionEN || 'Descrição não disponível'}</p>
    </div>
  `;
  openModal(content);
}

// Função para mostrar detalhes do jogador no modal
function mostrarDetalhesJogador(jogador) {
  const content = `
    <div class="modal-info">
      <h2>${jogador.strPlayer}</h2>
      ${jogador.strCutout ? `<img src="${jogador.strCutout}" alt="${jogador.strPlayer}" class="modal-img">` : ''}
    </div>
    <div class="modal-info">
      <h3>Nacionalidade:</h3>
      <p>${jogador.strNationality || 'N/A'}</p>
    </div>
    <div class="modal-info">
      <h3>Time:</h3>
      <p>${jogador.strTeam || 'N/A'}</p>
    </div>
    <div class="modal-info">
      <h3>Posição:</h3>
      <p>${jogador.strPosition || 'N/A'}</p>
    </div>
    <div class="modal-info">
      <h3>Data de Nascimento:</h3>
      <p>${jogador.dateBorn || 'N/A'}</p>
    </div>
    <div class="modal-info">
      <h3>Descrição:</h3>
      <p>${jogador.strDescriptionEN || 'Descrição não disponível'}</p>
    </div>
  `;
  openModal(content);
}