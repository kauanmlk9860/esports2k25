// Redirecionar ao clicar no botão "Acessar"
document.getElementById('btn-acessar').addEventListener('click', () => {
  window.location.href = 'esportes.html';
});

// Redirecionar ao clicar no link "Esportes"
document.getElementById('link-esportes').addEventListener('click', (e) => {
  e.preventDefault(); // Evita comportamento padrão do link
  window.location.href = 'esportes.html';
});

// Redirecionar ao clicar no link "Sobre nós"
document.getElementById('link-sobre').addEventListener('click', (e) => {
  e.preventDefault(); // Evita comportamento padrão do link
  window.location.href = 'sobre.html';
});
