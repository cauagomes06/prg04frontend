
const modal = document.getElementById('modalPlanos');
const botaoFechar = document.querySelector('.fechar-modal');


const botoesAbrir = document.querySelectorAll('.js-abrir-modal');

botoesAbrir.forEach(function(botao) {
  botao.addEventListener('click', function(event) {
    event.preventDefault(); 
    modal.classList.add('active');
  });
});


function fecharModal() {
    modal.classList.remove('active');
}

botaoFechar.addEventListener('click', fecharModal);

modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        fecharModal();
    }
});