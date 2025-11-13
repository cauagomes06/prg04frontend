/**
 * Verifica se o token existe. Se não, expulsa o utilizador.
 */
export function verificarAutenticacao() {
  const token = localStorage.getItem("fithub_token");
  if (!token) {
    alert("Acesso negado. Por favor, faça o login.");
    window.location.href = "loginpage.html";
    return false; // Indica que a verificação falhou
  }
  return true; // Verificação OK
}

/**
 * Faz o logout do utilizador.
 */
export function fazerLogout() {
  if (confirm("Tem a certeza que deseja sair?")) {
    localStorage.removeItem("fithub_token");
    window.location.href = "loginpage.html";
  }
}