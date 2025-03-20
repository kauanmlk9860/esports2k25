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
            <button class="btn-detalhes" onclick="mostrarDetalhesTime('${encodeURIComponent(JSON.stringify(time))}')">Ver mais detalhes</button>
          `;
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
            <button class="btn-detalhes" onclick="mostrarDetalhesJogador('${encodeURIComponent(JSON.stringify(jogador))}')">Ver mais detalhes</button>
          `;
          jogadoresContainer.appendChild(card);
        });
      } else {
        jogadoresContainer.innerHTML = '<p>Nenhum jogador encontrado.</p>';
      }
    });
}

// Detalhes com alert
window.mostrarDetalhesTime = function(timeDataEncoded) {
  const time = JSON.parse(decodeURIComponent(timeDataEncoded));
  alert(`🏟️ ${time.strTeam}\n📍 País: ${time.strCountry}\n🏠 Estádio: ${time.strStadium}\n📝 Descrição: ${time.strDescriptionEN || 'Sem descrição disponível.'}`);
};

window.mostrarDetalhesJogador = function(jogadorDataEncoded) {
  const jogador = JSON.parse(decodeURIComponent(jogadorDataEncoded));
  alert(`👤 ${jogador.strPlayer}\n📍 País: ${jogador.strNationality}\n🏟️ Time: ${jogador.strTeam}\n🎯 Posição: ${jogador.strPosition}\n📝 Descrição: ${jogador.strDescriptionEN || 'Sem descrição disponível.'}`);
};
