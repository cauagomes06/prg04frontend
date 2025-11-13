// --- 1. IMPORTAR MÓDULOS ---
import { apiFetch } from "./services/api.js";
import { verificarAutenticacao, fazerLogout } from "./services/auth.js";
import {
  setupModalPerfil,
  setupModalGenerico,
  abrirModalTreino,
  abrirModalSubmeterResultado,
} from "./ui/modal.js";
import {
  carregarAnuncios,
  carregarMeusTreinos,
  carregarAgenda,
  carregarCompeticoes,
  carregarBibliotecaTreinos,
  carregarPersonais,
} from "./ui/tabs.js";

// --- 2. INICIALIZAÇÃO QUANDO O DOM ESTIVER PRONTO ---
document.addEventListener("DOMContentLoaded", () => {
  // 2a. Verificar se está logado
  if (!verificarAutenticacao()) {
    return; // Para a execução se o token não for válido
  }

  let usuarioLogado = {}; // Variável global para guardar os dados do /me

  // 2b. Configurar todos os listeners da UI
  setupSidebar();
  setupTabs();
  setupModalPerfil();
  setupModalGenerico();
  setupFormulariosPerfil();
  setupEventListenersDinamicos();

  // 2c. Carregar dados iniciais e a primeira aba
  async function carregarDadosIniciais() {
    try {
      const data = await apiFetch("/api/usuarios/me");
      usuarioLogado = data; // Salva o utilizador globalmente

      popularSidebar(data);
      popularPerfil(data);

      // Carrega a primeira aba por defeito (Notificações)
      carregarAnuncios();
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
      alert(
        "Não foi possível carregar os dados do seu perfil. " + error.message
      );
    }
  }

  // --- 3. FUNÇÕES DE PREENCHIMENTO DA UI ---
  // (Estas permanecem no portal.js pois são específicas desta página)

  function popularSidebar(data) {
    const nomeCompleto = data.pessoa?.nomeCompleto || "Utilizador";
    document.getElementById("sidebar-nome").textContent = `Olá, ${
      nomeCompleto.split(" ")[0]
    }!`;
    document.getElementById("sidebar-plano").textContent =
      data.nomePlano || "Plano Indefinido";
  }

  function popularPerfil(data) {
    document.getElementById("perfil-nome").textContent =
      data.pessoa?.nomeCompleto || "Utilizador";
    document.getElementById(
      "perfil-email"
    ).innerHTML = `<i class="fas fa-envelope"></i> ${data.username}`;
    
    document.getElementById("perfil-plano-tag").textContent =
      data.nomePlano || "Plano Indefinido"; 
      
    document.getElementById("perfil-score").textContent = data.scoreTotal || 0;

    const dataCriacao = new Date(data.dataCriacao);
    const dataFormatada = dataCriacao.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    });
    document.getElementById("perfil-membro-desde").textContent =
      dataFormatada.replace(" de ", "/");

    // Passa o ID do plano atual para a função de carregar o <select>
    carregarPlanosSelect(data.planoId);
  }

  async function carregarPlanosSelect(planoAtualId) {
    const select = document.getElementById("select-plano");
    try {
      const planos = await apiFetch("/api/planos/buscar");
      select.innerHTML = ""; // Limpa o "Carregando..."

      planos.forEach((plano) => {
        const option = document.createElement("option");
        option.value = plano.id;
        option.textContent = `${plano.nome} (R$ ${plano.preco})`;
        
        if (plano.id === planoAtualId) { 
          option.selected = true; 
        }
        select.appendChild(option);
      });
    } catch (error) {
      select.innerHTML =
        "<option>Não foi possível carregar os planos.</option>";
    }
  }

  // --- 4. FUNÇÕES DE CONFIGURAÇÃO DE LISTENERS ---

  function setupSidebar() {
    const sidebar = document.querySelector(".portal-sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    const btnToggle = document.querySelector(".btn-toggle-sidebar");
    const btnClose = document.querySelector(".btn-fechar-sidebar");

    const abrirSidebar = () => {
      sidebar.classList.add("active");
      overlay.classList.add("active");
    };
    const fecharSidebar = () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    };

    btnToggle.addEventListener("click", abrirSidebar);
    btnClose.addEventListener("click", fecharSidebar);
    overlay.addEventListener("click", fecharSidebar);
  }

  function setupTabs() {
    const linksMenu = document.querySelectorAll(".portal-menu a[data-target]");
    const tabsConteudo = document.querySelectorAll(".portal-tab-content");

    linksMenu.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = link.getAttribute("data-target");
        if (!targetId) return;

        tabsConteudo.forEach((tab) => tab.classList.remove("active"));
        linksMenu.forEach((menuLink) =>
          menuLink.parentElement.classList.remove("active")
        );

        document.getElementById(targetId).classList.add("active");
        link.parentElement.classList.add("active");

        if (window.innerWidth < 992) fecharSidebar();

        // Lazy Loading: Carrega o conteúdo da aba SÓ quando ela é clicada
        switch (targetId) {
          case "anuncios":
            carregarAnuncios();
            break;
          case "meu-treino":
            carregarMeusTreinos(usuarioLogado.id); // Passa o ID do utilizador
            break;
          case "agenda":
            carregarAgenda();
            break;
          case "competicoes":
            carregarCompeticoes();
            break;
          case "biblioteca-treinos":
            carregarBibliotecaTreinos(); // Corrigido
            break;
          case "personais":
            carregarPersonais();
            break;
        }
      });
    });

    // Listener do Logout
    document.getElementById("btn-logout").addEventListener("click", (e) => {
      e.preventDefault();
      fazerLogout();
    });
  }

  function setupFormulariosPerfil() {
    // Formulário de Mudar Senha
    document
      .getElementById("form-mudar-senha")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const senhaAtual = document.getElementById("senhaAtual").value;
        const novaSenha = document.getElementById("novaSenha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;

        if (novaSenha !== confirmaSenha) {
          alert("As novas senhas não coincidem!");
          return;
        }

        try {
          await apiFetch(`/api/usuarios/update/senha/${usuarioLogado.id}`, {
            method: "PUT",
            body: JSON.stringify({
              senhaAtual: senhaAtual,
              novaSenha: novaSenha,
              confirmaSenha: confirmaSenha,
            }),
          });
          alert("Senha atualizada com sucesso!");
          e.target.reset(); // Limpa o formulário
        } catch (error) {
          alert("Erro ao atualizar a senha: " + error.message);
        }
      });

    // Formulário de Mudar Plano
    document
      .getElementById("form-mudar-plano")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const novoPlanoId = document.getElementById("select-plano").value;

        // Corrigido para 'planoId'
        if (novoPlanoId == usuarioLogado.planoId) {
          alert("Este já é o seu plano atual.");
          return;
        }

        if (!confirm("Tem a certeza que deseja mudar para este plano?")) return;

        try {
          await apiFetch(`/api/planos/mudar/${usuarioLogado.id}`, {
            method: "PATCH",
            body: JSON.stringify({ planoId: novoPlanoId }),
          });
          alert("Plano atualizado com sucesso!");
          // Recarrega os dados para atualizar o plano na UI
          carregarDadosIniciais();
        } catch (error) {
          alert("Erro ao mudar o plano: " + error.message);
        }
      });
  }

  function setupEventListenersDinamicos() {
    // Listener "pai" para todos os cliques em botões dinâmicos
    const conteudoPrincipal = document.querySelector(".portal-conteudo");

    conteudoPrincipal.addEventListener("click", async (e) => {
      const target = e.target.closest("button"); // Encontra o botão mais próximo
      if (!target) return; // Se não clicou num botão, ignora

      // Marcar notificação como lida
      if (target.classList.contains("btn-marcar-lida")) {
        const id = target.dataset.notificacaoId;
        try {
          await apiFetch(`/api/notificacoes/marcar-como-lida/${id}`, {
            method: "POST",
          });
          target.closest(".notificacao-item").classList.add("lida");
          target.remove();
        } catch (error) {
          alert("Erro ao marcar como lida: " + error.message);
        }
      }

      // Ver detalhes de um treino (de 'Meus Treinos' ou 'Biblioteca')
      if (
        target.classList.contains("btn-ver-treino") ||
        target.classList.contains("btn-ver-exercicio") // Adicionado para a biblioteca
      ) {
        const id = target.dataset.treinoId;
        abrirModalTreino(id);
      }

      // Reservar Aula
      if (target.classList.contains("btn-reservar-aula")) {
        const id = target.dataset.aulaId;
        if (!confirm("Confirmar reserva para esta aula?")) return;
        try {
          await apiFetch(`/api/aulas/${id}/reservar`, { method: "POST" });
          alert("Aula reservada com sucesso!");
          carregarAgenda(); // Recarrega a aba
        } catch (error) {
          alert("Erro ao reservar aula: " + error.message);
        }
      }

      // Cancelar Reserva
      if (target.classList.contains("btn-cancelar-reserva")) {
        const id = target.dataset.reservaId;
        if (!confirm("Confirmar cancelamento desta reserva?")) return;
        try {
          await apiFetch(`/api/reservas/cancelar/${id}`, { method: "DELETE" });
          alert("Reserva cancelada com sucesso!");
          carregarAgenda(); // Recarrega a aba
        } catch (error) {
          alert("Erro ao cancelar reserva: " + error.message);
        }
      }

      // Inscrever-se em Competição
      if (target.classList.contains("btn-inscrever-competicao")) {
        const id = target.dataset.competicaoId;
        if (!confirm("Confirmar inscrição nesta competição?")) return;
        try {
          await apiFetch(`/api/inscricoes/competicao/${id}`, { method: "POST" });
          alert("Inscrição realizada com sucesso!");
          carregarCompeticoes(); // Recarrega a aba
        } catch (error) {
          alert("Erro ao se inscrever: " + error.message);
        }
      }

      // Submeter Resultado (Abre Modal)
      if (target.classList.contains("btn-submeter-resultado")) {
        const id = target.dataset.inscricaoId;
        abrirModalSubmeterResultado(id);
      }
    });
  }

  // --- 5. INICIAR A APLICAÇÃO ---
  carregarDadosIniciais();
});