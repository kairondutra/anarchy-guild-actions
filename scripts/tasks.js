document.addEventListener("DOMContentLoaded", () => {
    let npcsData = {};

    // Carregamento dos dados JSON
    Promise.all([
        fetch("./assets/data/data_nwtasks.json").then(response => response.json()),
        fetch("./assets/data/data_tasks.json").then(response => response.json())
    ])
        .then(([nwtasksData, tasksData]) => {
            npcsData.nwtasks = nwtasksData;
            npcsData.tasks = {};
            for (const region in tasksData) {
                for (const subregion in tasksData[region]) {
                    npcsData.tasks[`${region} - ${subregion}`] = tasksData[region][subregion];
                }
            }
            applyFilters();
        })
        .catch((error) => console.error("Erro ao carregar dados:", error));

    // Função para alternar visibilidade dos filtros
    window.toggleFilters = () => {
        const filtersContainer = document.getElementById("filtersContainer");
        const toggleButton = document.getElementById("toggleFilters");
        if (filtersContainer.style.display === "none") {
            filtersContainer.style.display = "block";
            toggleButton.textContent = "Esconder Filtros";
        } else {
            filtersContainer.style.display = "none";
            toggleButton.textContent = "Mostrar Filtros";
        }
    };

    // Função para aplicar filtros
    window.applyFilters = () => {
        const query = document.getElementById("searchInput").value.toLowerCase();
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        const filterDerrotar = document.getElementById("filterDerrotar").checked;
        const filterColetar = document.getElementById("filterColetar").checked;
        const filterLevel300 = document.getElementById("filterLevel300").checked;
        const filterLevel400 = document.getElementById("filterLevel400").checked;
        const filterNWLevel50 = document.getElementById("filterNWLevel50").checked;
        const filterBlackGem = document.getElementById("filterBlackGem").checked;
        const filterBeastBall = document.getElementById("filterBeastBall").checked;

        const displayMode = document.querySelector('input[name="displayMode"]:checked').value;
        const anyFilterActive = filterDerrotar || filterColetar || filterLevel300 || filterLevel400 || filterNWLevel50 || filterBlackGem || filterBeastBall;

        let foundResults = false;

        function formatarRecompensas(exp, nw_exp, itens) {
            let resultado = `EXP ${exp}, NW EXP ${nw_exp}`;
            if (itens.length === 0) {
                return resultado;
            } else if (itens.length === 1) {
                resultado += ` e ${itens[0].quantidade}x ${itens[0].nome}`;
            } else {
                const itensFormatados = itens.map(item => `${item.quantidade}x ${item.nome}`);
                const ultimoItem = itensFormatados.pop();
                resultado += `, ${itensFormatados.join(", ")} e ${ultimoItem}`;
            }
            return resultado;
        }

        function formatarObjetivos(objetivos) {
            if (!objetivos) return "";
            return Array.isArray(objetivos) ? objetivos.join("<br>") : objetivos.replace(/\. /g, ".<br>");
        }

        function createNWTaskCard(npc, region) {
            const expFormatted = npc.recompensa.exp;
            const nwExpFormatted = npc.recompensa.nw_exp;
            const recompensasFormatadas = formatarRecompensas(expFormatted, nwExpFormatted, npc.recompensa.itens || []);

            return `
                <div class="npc-card nwtask-card">
                    <h3 class="npc-name">${npc.npc}</h3>
                    <p class="npc-requirements"><strong>Requisitos:</strong> Level ${npc.requisitos.level}, NW Level ${npc.requisitos.nw_level}</p>
                    <p class="npc-objective"><strong>Objetivos:</strong><br>${formatarObjetivos(npc.objetivos)}</p>
                    <p class="npc-rewards"><strong>Recompensas:</strong> ${recompensasFormatadas}</p>
                    <button class="copy-btn" data-local="${npc.coordenadas || 'Coordenada não disponível'}">Copiar Coordenadas</button>
                </div>
            `;
        }

        function createTasksCard(npc, region) {
            const objectiveText = Array.isArray(npc.objective) ? npc.objective.join("<br>") : npc.objective;
            const rewardText = Array.isArray(npc.reward) ? npc.reward.join("<br>") : npc.reward;

            return `
                <div class="npc-card tasks-card">
                    <h3 class="npc-name">${npc.npc}</h3>
                    <p class="npc-objective"><strong>Objetivo:</strong> ${objectiveText}</p>
                    <p class="npc-location"><strong>Localização:</strong> ${npc.location}</p>
                    <p class="npc-rewards"><strong>Recompensa:</strong> ${rewardText}</p>
                </div>
            `;
        }

        // Processa NW Tasks
        for (const [region, npcs] of Object.entries(npcsData.nwtasks || {})) {
            npcs.forEach((npc) => {
                let matchesFilter = true;
                const objetivosText = Array.isArray(npc.objetivos) ? npc.objetivos.join(" ") : npc.objetivos || "";

                if (filterDerrotar && !objetivosText.toLowerCase().includes("derrotar")) matchesFilter = false;
                if (filterColetar && !objetivosText.toLowerCase().includes("coletar")) matchesFilter = false;
                if (filterLevel300 && filterLevel400) {
                    if (npc.requisitos.level < 300) matchesFilter = false;
                } else if (filterLevel300 && npc.requisitos.level !== 300) matchesFilter = false;
                else if (filterLevel400 && npc.requisitos.level < 400) matchesFilter = false;
                if (filterNWLevel50 && npc.requisitos.nw_level < 50) matchesFilter = false;
                if (filterBlackGem && !(npc.recompensa.itens || []).some(item => item.nome.toLowerCase().includes("black nightmare gem"))) matchesFilter = false;
                if (filterBeastBall && !(npc.recompensa.itens || []).some(item => item.nome.toLowerCase().includes("beast ball"))) matchesFilter = false;

                if (
                    matchesFilter &&
                    (
                        npc.npc.toLowerCase().includes(query) ||
                        region.toLowerCase().includes(query) ||
                        objetivosText.toLowerCase().includes(query) ||
                        String(npc.requisitos.level).includes(query) ||
                        String(npc.requisitos.nw_level).includes(query) ||
                        (npc.recompensa.itens || []).some(item =>
                            item.nome.toLowerCase().includes(query) ||
                            String(item.quantidade).includes(query)
                        )
                    )
                ) {
                    foundResults = true;
                    resultsDiv.innerHTML += createNWTaskCard(npc, region);
                }
            });
        }

        // Processa Tasks apenas se "Mostrar Todos" estiver selecionado e nenhum filtro NW estiver ativo
        if (displayMode === "all" && !anyFilterActive) {
            for (const [region, npcs] of Object.entries(npcsData.tasks || {})) {
                npcs.forEach((npc) => {
                    const objectiveText = Array.isArray(npc.objective) ? npc.objective.join(" ") : npc.objective || "";
                    const rewardText = Array.isArray(npc.reward) ? npc.reward.join(" ") : npc.reward || "";

                    if (
                        npc.npc.toLowerCase().includes(query) ||
                        region.toLowerCase().includes(query) ||
                        objectiveText.toLowerCase().includes(query) ||
                        (npc.location || "").toLowerCase().includes(query) ||
                        rewardText.toLowerCase().includes(query)
                    ) {
                        foundResults = true;
                        resultsDiv.innerHTML += createTasksCard(npc, region);
                    }
                });
            }
        }

        if (!foundResults) {
            resultsDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        }

        addCopyLocationFunctionality();
    };

    // Função para adicionar funcionalidade de copiar coordenadas
    function addCopyLocationFunctionality() {
        const copyButtons = document.querySelectorAll(".copy-btn");

        copyButtons.forEach(button => {
            const local = button.getAttribute("data-local");

            button.removeEventListener("click", button.onclick);
            button.onclick = null;

            if (local === "Coordenada não disponível") {
                button.disabled = true;
                button.textContent = "Sem Coordenadas";
            } else {
                button.disabled = false;
                button.textContent = "Copiar Coordenadas";
                button.addEventListener("click", function () {
                    navigator.clipboard.writeText(local).then(() => {
                        this.textContent = "Copiado!";
                        this.disabled = true;
                        setTimeout(() => {
                            this.textContent = "Copiar Coordenadas";
                            this.disabled = false;
                        }, 2000);
                    }).catch(err => {
                        console.error("Erro ao copiar a coordenada:", err);
                        alert("Ocorreu um erro ao copiar a coordenada.");
                    });
                });
            }
        });
    }
});