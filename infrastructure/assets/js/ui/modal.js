import { apiFetch } from "../services/api.js";
// Importa a função de recarregar as competições,
// para atualizar a lista após submeter um resultado.
import { carregarCompeticoes } from "./tabs.js"; 

/**
 * Configura os listeners para o Modal de "Editar Perfil"
 */
export function setupModalPerfil() {
  const modalPerfil = document.getElementById("modal-perfil");
  const btnAbrirModalPerfil = document.getElementById("btn-abrir-modal-perfil");
  const btnFecharModalPerfil = document.getElementById("modal-perfil-fechar");

  if (btnAbrirModalPerfil) {
    btnAbrirModalPerfil.addEventListener("click", () => {
      modalPerfil.style.display = "flex";
    });
  }

  const fecharModalPerfil = () => {
    modalPerfil.style.display = "none";
  };

  btnFecharModalPerfil.addEventListener("click", fecharModalPerfil);
  modalPerfil.addEventListener("click", (e) => {
    if (e.target === modalPerfil) {
      fecharModalPerfil();
    }
  });

  // Lógica das ABAS INTERNAS do modal
  const modalTabLinks = document.querySelectorAll(".modal-tab-link");
  const modalTabContents = document.querySelectorAll(".modal-tab-content");

  modalTabLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-modal-target");

      modalTabLinks.forEach((tab) => tab.classList.remove("active"));
      modalTabContents.forEach((content) => content.classList.remove("active"));

      link.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    });
  });
}

/**
 * Configura os listeners para o Modal Genérico (Treinos, Resultados)
 */
export function setupModalGenerico() {
  const modal = document.getElementById("modal");
  const btnFecharModal = document.getElementById("modal-fechar");

  btnFecharModal.addEventListener("click", fecharModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });
}

// Funções públicas que abrem o modal genérico com conteúdos diferentes
const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modal-titulo");
const modalCorpo = document.getElementById("modal-corpo");

const abrirModal = () => (modal.style.display = "flex");
const fecharModal = () => (modal.style.display = "none");

export async function abrirModalTreino(treinoId) {
  abrirModal();
  modalTitulo.textContent = "Carregando Treino...";
  modalCorpo.innerHTML = "<p>Buscando detalhes...</p>";
  try {
    const treino = await apiFetch(`/api/treinos/${treinoId}`);
    modalTitulo.textContent = treino.nome;

    let htmlItens = "<ul>";
    treino.itensTreino.forEach((item) => {
      htmlItens += `
        <li>
          <strong>${item.exercicio.nome}</strong>: 
          ${item.series} séries de ${item.repeticoes} repetições 
          (Descanso: ${item.descansoSegundos}s)
        </li>
      `;
    });
    htmlItens += "</ul>";
    modalCorpo.innerHTML = htmlItens;
  } catch (error) {
    modalCorpo.innerHTML = "<p>Erro ao carregar detalhes do treino.</p>";
  }
}

export function abrirModalSubmeterResultado(inscricaoId) {
  abrirModal();
  modalTitulo.textContent = "Submeter Resultado";
  modalCorpo.innerHTML = `
    <form id="form-submeter-resultado" class="form-portal">
      <div class="form-grupo">
        <label for="resultado-valor">Seu Resultado (ex: 100)</label>
        <input type="number" id="resultado-valor" required />
      </div>
      <button type="submit" class="btn-primario">Enviar</button>
    </form>
  `;

  document
    .getElementById("form-submeter-resultado")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const resultado = document.getElementById("resultado-valor").value;
      try {
        await apiFetch(`/api/inscricoes/resultado/${inscricaoId}`, {
          method: "POST",
          body: JSON.stringify({ resultado: resultado }),
        });
        alert("Resultado enviado com sucesso!");
        fecharModal();
        carregarCompeticoes(); // Recarrega a aba
      } catch (error) {
        alert("Erro ao enviar resultado: " + error.message);
      }
    });
}