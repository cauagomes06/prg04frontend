document.addEventListener('DOMContentLoaded', function() {
  
  // Seleciona os elementos que vamos manipular
  const mensagemPlanoEl = document.getElementById('mensagem-plano');
  const linkCadastro = document.querySelector('.link-cadastro a'); // Seleciona o link 'Cadastre-se'

  // Pega os parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const planoEscolhido = urlParams.get('plano');

  // Se um plano foi escolhido
  if (planoEscolhido) {
    const nomePlanoFormatado = planoEscolhido.charAt(0).toUpperCase() + planoEscolhido.slice(1);
    
    // Mostra a mensagem personalizada no topo do formulário
    mensagemPlanoEl.innerHTML = `Faça login para continuar a assinatura do <strong>Plano ${nomePlanoFormatado}</strong>.`;
    
    // ATUALIZA O LINK de cadastro para incluir o plano
    linkCadastro.href = `cadastro.html?plano=${planoEscolhido}`;

  } else {
    // Se não houver plano na URL, esconde a mensagem e mantém o link de cadastro simples
    mensagemPlanoEl.style.display = 'none';
    linkCadastro.href = 'cadastro.html';
  }

});