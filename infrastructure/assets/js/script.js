// --- FUNCIONALIDADE DO MODAL DE PLANOS ---

// 1. Seleciona os elementos do HTML que vamos usar
const botaoAbrir = document.getElementById('abrirModalPlanos');
const modal = document.getElementById('modalPlanos');
const botaoFechar = modal.querySelector('.fechar-modal');

// 2. Cria as funções para abrir e fechar o modal
function abrirModal(event) {
  event.preventDefault(); // Impede que o link '#' recarregue a página
  modal.classList.add('active');
}

function fecharModal() {
  modal.classList.remove('active');
}

// 3. Adiciona os "escutadores de eventos" (event listeners)
//    Eles ficam esperando uma ação do usuário (um clique) para executar uma função.

// Quando o usuário clicar no botão de abrir, executa a função abrirModal
botaoAbrir.addEventListener('click', abrirModal);

// Quando o usuário clicar no botão de fechar (o 'X'), executa a função fecharModal
botaoFechar.addEventListener('click', fecharModal);

// BÔNUS: Fechar o modal se o usuário clicar fora da caixa branca (no fundo escuro)
modal.addEventListener('click', function(event) {
  // Se o local clicado (event.target) for o próprio container do modal...
  if (event.target === modal) {
    fecharModal(); // ...então fecha o modal.
  }
});