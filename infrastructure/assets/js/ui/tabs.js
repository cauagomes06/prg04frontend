import { apiFetch } from "../services/api.js";

/**
 * Carrega as Notificações
 * (Endpoint: /api/notificacoes/minhas)
 */
export async function carregarAnuncios() {
  const container = document.getElementById("anuncios-lista");
  container.innerHTML = "<p>Carregando notificações...</p>";
  try {
    const notificacoes = await apiFetch("/api/notificacoes/minhas");

    if (notificacoes.length === 0) {
      container.innerHTML = "<p>Você não tem nenhuma notificação.</p>";
      return;
    }

    container.innerHTML = ""; // Limpa
    notificacoes.forEach((n) => {
      container.innerHTML += `
        <div class="notificacao-item ${n.lida ? "lida" : ""}">
          <div class="notificacao-info">
            <i class="fas fa-info-circle"></i>
            <p>${n.mensagem}</p>
          </div>
          ${
            !n.lida
              ? `<button class="btn-marcar-lida" data-notificacao-id="${n.id}">Marcar como lida</button>`
              : ""
          }
        </div>
      `;
    });
  } catch (error) {
    container.innerHTML =
      "<p>Erro ao carregar notificações. Tente novamente.</p>";
  }
}

/**
 * Carrega os Treinos do Utilizador
 * (Endpoint: /api/treinos/usuario/{id})
 */
export async function carregarMeusTreinos(usuarioId) {
  const container = document.getElementById("meus-treinos-lista");
  container.innerHTML = "<p>Carregando treinos...</p>";
  try {
    const treinos = await apiFetch(`/api/treinos/usuario/${usuarioId}`);

    if (treinos.length === 0) {
      container.innerHTML =
        "<p>Você ainda não tem nenhum treino atribuído.</p>";
      return;
    }

    container.innerHTML = "";
    treinos.forEach((treino) => {
      container.innerHTML += `
        <article class="personal-card no-image">
          <div class="personal-info">
            <h3>${treino.nome}</h3>
            <span>Foco em ${treino.objetivo || "Geral"}</span>
            <div class="workout-tags">
              <span><i class="fas fa-clock"></i> ${
                treino.duracaoMinutos || 60
              } min</span>
              <span><i class="fas fa-fire"></i> ${
                treino.nivelDificuldade || "Indefinido"
              }</span>
            </div>
            <button class="btn-ver-treino" data-treino-id="${
              treino.id
            }">Ver Treino</button>
          </div>
        </article>
      `;
    });
  } catch (error) {
    container.innerHTML =
      "<p>Erro ao carregar seus treinos. Tente novamente.</p>";
  }
}

/**
 * Carrega a Agenda (Aulas e Reservas)
 * (Endpoints: /api/aulas/buscar e /api/reservas/minhas)
 */
export async function carregarAgenda() {
  const aulasContainer = document.getElementById("aulas-disponiveis-lista");
  const reservasContainer = document.getElementById("minhas-reservas-lista");
  aulasContainer.innerHTML = "<p>Carregando aulas...</p>";
  reservasContainer.innerHTML = "<p>Carregando reservas...</p>";

  // Carrega Aulas Disponíveis
  try {
    const aulas = await apiFetch("/api/aulas/buscar");
    aulasContainer.innerHTML = "";
    if (aulas.length === 0) {
      aulasContainer.innerHTML = "<p>Nenhuma aula disponível no momento.</p>";
    }
    aulas.forEach((aula) => {
      aulasContainer.innerHTML += `
        <div class="lista-item">
          <div>
            <strong>${aula.nome}</strong> (com ${
        // O DTO da Aula tem 'instrutorNome'
        aula.instrutorNome || "Instrutor"
      })
            <small>${new Date(aula.dataHora).toLocaleString("pt-BR")}</small>
          </div>
          <button class="btn-reservar-aula" data-aula-id="${
            aula.id
          }">Reservar</button>
        </div>
      `;
    });
  } catch (error) {
    aulasContainer.innerHTML = "<p>Erro ao carregar aulas.</p>";
  }

  // Carrega Minhas Reservas
  try {
    const reservas = await apiFetch("/api/reservas/usuario");
    reservasContainer.innerHTML = "";
    if (reservas.length === 0) {
      reservasContainer.innerHTML = "<p>Você não possui reservas.</p>";
    }
    reservas.forEach((reserva) => {
      reservasContainer.innerHTML += `
        <div class="lista-item">
          <div>
            <strong>${reserva.aula.nome}</strong>
            <small>${new Date(reserva.aula.dataHora).toLocaleString(
              "pt-BR"
            )}</small>
          </div>
          <button class="btn-cancelar-reserva" data-reserva-id="${
            reserva.id
          }">Cancelar</button>
        </div>
      `;
    });
  } catch (error) {
    reservasContainer.innerHTML = "<p>Erro ao carregar suas reservas.</p>";
  }
}

/**
 * Carrega a Aba de Competições (Ranking, Abertas, Inscritas)
 * (Endpoints: /api/usuarios/ranking, /api/competicoes/buscar, /api/competicoes/inscricao/usuario)
 */
export async function carregarCompeticoes() {
  const rankingContainer = document.getElementById("ranking-lista");
  const disponiveisContainer = document.getElementById(
    "competicoes-disponiveis-lista"
  );
  const inscricoesContainer = document.getElementById(
    "minhas-inscricoes-lista"
  );

  rankingContainer.innerHTML = "<p>Carregando ranking...</p>";
  disponiveisContainer.innerHTML = "<p>Carregando competições...</p>";
  inscricoesContainer.innerHTML = "<p>Carregando inscrições...</p>";

  // Carrega Ranking
  try {
    const ranking = await apiFetch("/api/usuarios/ranking");
    rankingContainer.innerHTML = "";
    ranking.forEach((user, index) => {
      rankingContainer.innerHTML += `
        <li>
          <span><strong>${index + 1}.</strong> ${user.nomeCompleto}</span>
          <span>${user.scoreTotal} pts</span>
        </li>
      `;
    });
  } catch (error) {
    rankingContainer.innerHTML = "<p>Erro ao carregar ranking.</p>";
  }

  // Carrega Competições Abertas
  try {
    const competicoes = await apiFetch("/api/competicoes/buscar");
    disponiveisContainer.innerHTML = "";
    let abertas = 0;
    competicoes.forEach((comp) => {
      if (comp.status === "ABERTA") {
        abertas++;
        disponiveisContainer.innerHTML += `
          <div class="lista-item">
            <div>
              <strong>${comp.nome}</strong>
              <small>Termina em: ${new Date(
                comp.dataFim
              ).toLocaleDateString("pt-BR")}</small>
            </div>
            <button class="btn-inscrever-competicao" data-competicao-id="${
              comp.id
            }">Inscrever</button>
          </div>
        `;
      }
    });
    if (abertas === 0) {
      disponiveisContainer.innerHTML = "<p>Nenhuma competição aberta no momento.</p>";
    }
  } catch (error) {
    disponiveisContainer.innerHTML =
      "<p>Erro ao carregar competições.</p>";
  }

  // Carrega Minhas Inscrições
  try {
    const inscricoes = await apiFetch("/api/competicoes/inscricao/usuario");
    inscricoesContainer.innerHTML = "";
    if (inscricoes.length === 0) {
      inscricoesContainer.innerHTML = "<p>Você não está inscrito em nada.</p>";
    }
    inscricoes.forEach((insc) => {
      inscricoesContainer.innerHTML += `
        <div class="lista-item">
          <div>
            <strong>${insc.competicaoNome}</strong>
            <small>Seu resultado: ${insc.resultado || "Pendente"}</small>
          </div>
          <button class="btn-submeter-resultado" data-inscricao-id="${
            insc.id
          }">Submeter</button>
        </div>
      `;
    });
  } catch (error) {
    inscricoesContainer.innerHTML =
      "<p>Erro ao carregar suas inscrições.</p>";
  }
}

/**
 * Carrega a Biblioteca de Treinos
 * (Endpoint: /api/treinos/buscar)
 */
// DENTRO DE assets/js/ui/tab.js

/**
 * Carrega a Biblioteca de Treinos
 * (Endpoint: GET /api/treinos)
 */
export async function carregarBibliotecaTreinos() {
  const container = document.getElementById("treinos-lista");
  container.innerHTML = "<p>Carregando treinos...</p>";
  
  try {
    const treinos = await apiFetch("/api/treinos/buscar");

    if (treinos.length === 0) {
      container.innerHTML = "<p>Nenhum treino encontrado na biblioteca.</p>";
      return;
    }

    container.innerHTML = "";
    treinos.forEach((treino) => {
      container.innerHTML += `
        <article class="personal-card no-image">
          <div class="personal-info">
            <h3>${treino.nome}</h3>
            <div class="workout-tags">
              <span><i class="fas fa-bullseye"></i> ${treino.objetivo || 'Geral'}</span>
              <span><i class="fas fa-fire"></i> ${treino.nivelDificuldade}</span>
            </div>
            <button class="btn-ver-treino" data-treino-id="${treino.id}">Ver Detalhes</button>
          </div>
        </article>
      `;
    });

    document.querySelectorAll(".btn-ver-treino").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const treinoId = e.currentTarget.getAttribute("data-treino-id");
        import("../ui/modal.js").then((mod) => {
          mod.abrirModalTreino(treinoId);
        });
      });
    });
  } catch (error) {
    container.innerHTML =
      "<p>Erro ao carregar a biblioteca de treinos. Tente novamente.</p>";
  }
}

/**
 * Carrega a lista de Personais (Instrutores)
 * (Endpoint: /api/aulas/instrutores)
 */
export async function carregarPersonais() {
  const container = document.getElementById("personais-lista");
  container.innerHTML = "<p>Carregando personais...</p>";
  try {
    const instrutores = await apiFetch("/api/aulas/instrutores");
    container.innerHTML = "";

    if (instrutores.length === 0) {
      container.innerHTML = "<p>Nenhum instrutor encontrado.</p>";
      return;
    }

    instrutores.forEach((instrutor) => {
      container.innerHTML += `
        <article class="personal-card">
          <img src="${
            instrutor.fotoUrl || "../assets/images/foto twitter.jpg"
          }" alt="Foto de ${instrutor.nomeCompleto}">
          <div class="personal-info">
            <h3>${instrutor.nomeCompleto}</h3>
            <span>${instrutor.especialidade || "Personal Trainer"}</span>
            <button class="btn-agendar" data-instrutor-id="${
              instrutor.id
            }">Agendar Horário</button>
          </div>
        </article>
      `;
    });
  } catch (error) {
    container.innerHTML =
      "<p>Erro ao carregar os personais. Tente novamente.</p>";
  }
}