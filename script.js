document.addEventListener("DOMContentLoaded", () => {
    let npcsData = {};

    // Carrega os dados do JSON
    fetch("data_nwtasks.json")
        .then((response) => response.json())
        .then((data) => {
            npcsData = data;
            applyFilters(); // Aplica os filtros iniciais
        })
        .catch((error) => console.error("Erro ao carregar dados:", error));

    // Função para aplicar filtros
    window.applyFilters = () => {
        const query = document.getElementById("searchInput").value.toLowerCase();
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        // Verifica os filtros selecionados
        const filterDerrotar = document.getElementById("filterDerrotar").checked;
        const filterColetar = document.getElementById("filterColetar").checked;
        const filterLevel300 = document.getElementById("filterLevel300").checked;
        const filterLevel400 = document.getElementById("filterLevel400").checked;
        const filterNWLevel50 = document.getElementById("filterNWLevel50").checked;
        const filterBlackGem = document.getElementById("filterBlackGem").checked;
        const filterBeastBall = document.getElementById("filterBeastBall").checked;

        let foundResults = false;

        // Itera sobre todas as regiões e NPCs
        for (const [region, npcs] of Object.entries(npcsData)) {
            npcs.forEach((npc) => {
                let matchesFilter = true;

                // Verifica se a task corresponde aos filtros
                if (filterDerrotar && !npc.objetivos.toLowerCase().includes("derrotar")) {
                    matchesFilter = false;
                }
                if (filterColetar && !npc.objetivos.toLowerCase().includes("coletar")) {
                    matchesFilter = false;
                }
                if (filterLevel300 && npc.requisitos.level < 300) {
                    matchesFilter = false;
                }
                if (filterLevel400 && npc.requisitos.level < 400) {
                    matchesFilter = false;
                }
                if (filterNWLevel50 && npc.requisitos.nw_level < 50) {
                    matchesFilter = false;
                }
                if (filterBlackGem && !npc.recompensa.itens.some(item => item.nome.toLowerCase().includes("black nightmare gem"))) {
                    matchesFilter = false;
                }
                if (filterBeastBall && !npc.recompensa.itens.some(item => item.nome.toLowerCase().includes("beast ball"))) {
                    matchesFilter = false;
                }

                // Verifica se a consulta de texto está presente
                if (
                    matchesFilter &&
                    (
                        npc.npc.toLowerCase().includes(query) ||
                        region.toLowerCase().includes(query) ||
                        npc.objetivos.toLowerCase().includes(query) ||
                        String(npc.requisitos.level).includes(query) ||
                        String(npc.requisitos.nw_level).includes(query) ||
                        npc.recompensa.itens.some(item =>
                            item.nome.toLowerCase().includes(query) ||
                            String(item.quantidade).includes(query)
                        )
                    )
                ) {
                    foundResults = true;
                    const npcCard = `
                        <div class="npc-card">
                            <h3>${npc.npc} (${region})</h3>
                            <p><strong>Objetivo:</strong> ${npc.objetivos}</p>
                            <p><strong>Requisitos:</strong> Level ${npc.requisitos.level}, NW Level ${npc.requisitos.nw_level}</p>
                            <p><strong>Recompensas:</strong> EXP ${npc.recompensa.exp}, NW EXP ${npc.recompensa.nw_exp}</p>
                            <p><strong>Itens:</strong> ${npc.recompensa.itens.length > 0 
                                ? npc.recompensa.itens.map(item => `${item.quantidade}x ${item.nome}`).join(", ") 
                                : "Nenhum item"}</p>
                        </div>
                    `;
                    resultsDiv.innerHTML += npcCard;
                }
            });
        }

        if (!foundResults) {
            resultsDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        }
    };
});