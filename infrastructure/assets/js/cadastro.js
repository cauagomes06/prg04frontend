document.addEventListener("DOMContentLoaded", function () {
  // --- 1. LÓGICA PARA PEGAR O PLANO DA URL ---

  const mensagemPlanoEl = document.getElementById("mensagem-plano");
  const planoIdInput = document.getElementById("plano-id");
  const urlParams = new URLSearchParams(window.location.search);
  const planoEscolhido = urlParams.get("plano");

  // Mapeamento estático de Nomes de Plano para IDs
  const planoMap = {
    fit: 1,
    pro: 2,
    premium: 3,
  };

  // ID do plano por defeito (ex: 'Fit' ou o seu plano básico)
  let planoIdDefault = 1;

  if (planoEscolhido && planoMap[planoEscolhido.toLowerCase()]) {
    const nomePlanoFormatado =
      planoEscolhido.charAt(0).toUpperCase() + planoEscolhido.slice(1);
    planoIdInput.value = planoMap[planoEscolhido.toLowerCase()];

    // Mostra a mensagem
    mensagemPlanoEl.innerHTML = `Você está a registar-se no <strong>Plano ${nomePlanoFormatado}</strong>.`;
    mensagemPlanoEl.style.display = "block";
  } else {
    // Se o utilizador veio para /cadastro.html diretamente
    mensagemPlanoEl.innerHTML =
      "Você está a registar-se no plano <strong>Fit</strong>. Pode alterá-lo mais tarde no seu portal.";
    mensagemPlanoEl.style.display = "block";
    planoIdInput.value = planoIdDefault;
  }

  // --- 2. LÓGICA DE SUBMISSÃO DO FORMULÁRIO (COM FETCH) ---

  const form = document.getElementById("form-cadastro");

  form.addEventListener("submit", function (event) {
    // Previne o envio padrão do formulário
    event.preventDefault();

    // Pega todos os valores dos campos
    const nomeCompleto = document.getElementById("nomeCompleto").value;
    // O seu código corrigido (no cadastro.js)
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    const telefone = document
      .getElementById("telefone")
      .value.replace(/\D/g, "");
    const username = document.getElementById("email").value; // O seu DTO espera 'username'
    const password = document.getElementById("senha").value;
    const planoId = parseInt(planoIdInput.value, 10);
    const perfilId = parseInt(document.getElementById("perfil-id").value, 10);

    // Monta o objeto JSON exatamente como o back-end (UsuarioCreateDto) espera
    const data = {
      username: username,
      password: password,
      perfil: perfilId, // Estamos a usar 'perfil' e 'plano' (sem "Id")
      plano: planoId,
      pessoa: {
        nomeCompleto: nomeCompleto,
        cpf: cpf,
        telefone: telefone,
      },
    };

    // --- INÍCIO DA LÓGICA DA API ---
    console.log("A enviar para a API:", JSON.stringify(data, null, 2));

    fetch("http://localhost:8080/api/usuarios/register", {
      // Use a URL completa do seu back-end
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 201) {
          // 201 Created
          return response.json();
        }

        // Se houver um erro de validação (400) ou conflito (409)
        return response.json().then((errorData) => {
          // A 'message' virá do seu GlobalExceptionHandler (se o tiver)
          // ou da sua UsernameUniqueViolationException
          throw new Error(
            errorData.message || "Erro desconhecido no servidor."
          );
        });
      })
      .then((data) => {
        // Sucesso!
        alert(
          "Cadastro realizado com sucesso! Você será redirecionado para o login."
        );
        window.location.href = "loginpage.html"; // Redireciona para o login
      })
      .catch((error) => {
        // Mostra o erro para o utilizador
        console.error("Erro ao cadastrar:", error);
        alert(`Erro no cadastro: ${error.message}`);
      });
    // --- FIM DA LÓGICA DA API ---
  });
});
