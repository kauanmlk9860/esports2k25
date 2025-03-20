
document.getElementById('link-esportes').addEventListener('click', (e) => {
    e.preventDefault(); 
    window.location.href = 'esportes.html';
  });
  const loader = document.getElementById('loader');

function redirecionarComLoader(url) {
  loader.classList.remove('hidden');
  setTimeout(() => {
    window.location.href = url;
  }, 800);
}

document.getElementById('link-esportes').addEventListener('click', () => {
  redirecionarComLoader('esportes.html');
});

document.getElementById('link-esportes-texto').addEventListener('click', (e) => {
  e.preventDefault();
  redirecionarComLoader('esportes.html');
});

document.getElementById('link-sobre').addEventListener('click', (e) => {
  e.preventDefault();
  redirecionarComLoader('sobre.html');
});
