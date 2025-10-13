document.addEventListener("DOMContentLoaded", function () {
  // =======================================================
  // --- LÓGICA PARA ABRIR E FECHAR SIDEBAR NO MOBILE ---
  // =======================================================
  const toggleBtn = document.querySelector(".btn-toggle-sidebar");
  const closeBtn = document.querySelector(".btn-fechar-sidebar");
  const overlay = document.querySelector(".sidebar-overlay");
  const body = document.querySelector("body");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () =>
      body.classList.add("sidebar-visible")
    );
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", () =>
      body.classList.remove("sidebar-visible")
    );
  }
  if (overlay) {
    overlay.addEventListener("click", () =>
      body.classList.remove("sidebar-visible")
    );
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("sidebar-visible")) {
      body.classList.remove("sidebar-visible");
    }
  });

  // =======================================================
  // --- LÓGICA PARA TROCAR ABAS (TABS) ---
  // =======================================================
  const tabLinks = document.querySelectorAll(".portal-menu a[data-target]");
  const tabContents = document.querySelectorAll(".portal-tab-content");

  tabLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.dataset.target;
      const targetContent = document.getElementById(targetId);

      tabLinks.forEach((l) => l.parentElement.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      this.parentElement.classList.add("active");
      if (targetContent) {
        targetContent.classList.add("active");
      }

      if (window.innerWidth <= 992) {
        body.classList.remove("sidebar-visible");
      }
    });
  });

  // =======================================================
  // --- LÓGICA PARA A ABA DE AGENDA DE AULAS ---
  // =======================================================
  const calendarDays = document.getElementById("calendar-days");
  const currentMonthYear = document.getElementById("current-month-year");
  const prevMonthBtn = document.getElementById("prev-month-btn");
  const nextMonthBtn = document.getElementById("next-month-btn");
  const aulasList = document.getElementById("aulas-list");

  // Roda o código do calendário apenas se os elementos existirem na página
  if (
    calendarDays &&
    currentMonthYear &&
    prevMonthBtn &&
    nextMonthBtn &&
    aulasList
  ) {
    const sampleEvents = {
      "2025-10-14": [
        { time: "08:00", name: "Spinning", instructor: "Ricardo" },
        { time: "17:00", name: "Yoga", instructor: "Juliana" },
      ],
      "2025-10-16": [
        { time: "18:00", name: "Funcional", instructor: "Bruno" },
        { time: "19:00", name: "Zumba", instructor: "Juliana" },
      ],
      "2025-11-05": [{ time: "09:00", name: "Boxe", instructor: "Ricardo" }],
    };

    let currentDate = new Date(); // Inicia com a data atual do sistema

    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      currentMonthYear.textContent = `${currentDate.toLocaleString("pt-BR", {
        month: "long",
      })} ${year}`;
      calendarDays.innerHTML = "";

      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.insertAdjacentHTML(
          "beforeend",
          '<div class="prev-month"></div>'
        );
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          i
        ).padStart(2, "0")}`;
        let classes = "";
        const today = new Date();
        if (
          i === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        ) {
          classes += " today";
        }
        if (sampleEvents[dateStr]) {
          classes += " has-events";
        }

        calendarDays.insertAdjacentHTML(
          "beforeend",
          `<div class="${classes}" data-date="${dateStr}">${i}</div>`
        );
      }

      document
        .querySelectorAll("#calendar-days div:not(.prev-month)")
        .forEach((day) => {
          day.addEventListener("click", (e) => {
            const selected = document.querySelector(
              ".calendario-days .selected"
            );
            if (selected) selected.classList.remove("selected");
            e.currentTarget.classList.add("selected");
            renderAulas(e.currentTarget.dataset.date);
          });
        });
    }

    function renderAulas(dateStr) {
      const events = sampleEvents[dateStr];
      aulasList.innerHTML = "";

      if (events && events.length > 0) {
        events.forEach((event) => {
          aulasList.innerHTML += `
            <div class="aula-item">
              <div class="aula-info">
                <h4>${event.name}</h4>
                <p>${event.time} - Prof. ${event.instructor}</p>
              </div>
              <button class="btn-agendar-aula">Reservar</button>
            </div>
          `;
        });
      } else {
        aulasList.innerHTML =
          '<p class="sem-aulas">Nenhuma aula agendada para este dia.</p>';
      }
    }

    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    renderCalendar();
  }
});
