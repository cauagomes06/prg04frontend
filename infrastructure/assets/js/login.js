// Dentro de assets/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  // Encontra o formulário com o ID "form-login"
  const formLogin = document.getElementById("form-login");

  if (formLogin) {
    // Adiciona o "escutador" para o evento de SUBMIT
    formLogin.addEventListener("submit", async (event) => {
      
      // Impede o envio padrão do HTML
      event.preventDefault(); 

      // Pega os valores dos inputs "email" e "senha"
      const username = document.getElementById("email").value;
      const password = document.getElementById("senha").value;

      // Monta o objeto JSON que o seu backend espera
      const data = {
        username: username,
        password: password,
      };

      try {
        // Faz a requisição para o seu backend
        const response = await fetch(
          "http://localhost:8080/api/auth/login", //
          {
            method: "POST",
            headers: {
              // Define o Content-Type correto
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Envia os dados como JSON
          }
        );

        if (!response.ok) {
          // Se o login falhar (usuário/senha errados)
          alert("Erro: Usuário ou senha inválidos.");
          throw new Error("Falha no login");
        }

        // Se o login for SUCESSO
        const responseData = await response.json(); // Pega o { "token": "..." }

        // Salva o token no navegador
        localStorage.setItem("fithub_token", responseData.token);

        // Redireciona o usuário (O que o seu onclick estava fazendo)
        alert("Login realizado com sucesso! Redirecionando...");
        
        // !! IMPORTANTE !!
        // Troque 'admin.html' pela página correta para onde o usuário deve ir
        window.location.href = "portal.html"; // ou "dashboard.html", etc.

      } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
      }
    });
  }
});