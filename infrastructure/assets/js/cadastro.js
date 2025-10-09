document.addEventListener('DOMContentLoaded', function() {
  
  const mensagemPlanoEl = document.getElementById('mensagem-plano');
  const urlParams = new URLSearchParams(window.location.search);
  const planoEscolhido = urlParams.get('plano');

  if (planoEscolhido) {
    const nomePlanoFormatado = planoEscolhido.charAt(0).toUpperCase() + planoEscolhido.slice(1);
    
    // Mostra a mensagem confirmando o plano escolhido
    mensagemPlanoEl.innerHTML = `Você está a um passo de assinar o <strong>Plano ${nomePlanoFormatado}</strong>.`;

    // Você também pode guardar essa informação em um campo escondido do formulário
    // para enviar ao servidor junto com o cadastro. Ex:
    // <input type="hidden" name="plano" value="${planoEscolhido}">
  } else {
      mensagemPlanoEl.style.display = 'none';
  }

});