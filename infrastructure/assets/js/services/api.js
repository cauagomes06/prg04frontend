// O URL base da sua API
const API_URL = "http://localhost:8080";

/**
 * Faz uma chamada 'fetch' para a API, já incluindo o token de autenticação
 * e tratando erros comuns (como 401 - Sessão Expirada).
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("fithub_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(API_URL + endpoint, config);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("fithub_token");
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      window.location.href = "loginpage.html";
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Erro na API: ${response.statusText}`
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null;
};