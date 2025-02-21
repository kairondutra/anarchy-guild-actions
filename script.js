document.addEventListener("DOMContentLoaded", () => {
    let npcsData = {};
    // Carrega os dados do JSON
    fetch("data_nwtasks.json")
        .then((response) => response.json())
        .then((data) => {
            npcsData = data;
        })
        .catch((error) => console.error("Erro ao carregar dados:", error));

    // Função de busca
    window.searchNPCs = () => {
        const query = document.getElementById("searchInput").value.toLowerCase();
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";
        if (!query) {
            resultsDiv.innerHTML = "<p>Digite algo para buscar...</p>";
            return;
        }
        let foundResults = false;

        // Itera sobre todas as regiões e NPCs
        for (const [region, npcs] of Object.entries(npcsData)) {
            npcs.forEach((npc) => {
                // Verifica se o termo está presente em algum dos campos relevantes
                if (
                    // Nome do NPC
                    npc.npc.toLowerCase().includes(query) ||
                    // Região
                    region.toLowerCase().includes(query) ||
                    // Objetivo
                    npc.objetivos.toLowerCase().includes(query) ||
                    // Nível mínimo (Level)
                    String(npc.requisitos.level).includes(query) ||
                    // NW Level
                    String(npc.requisitos.nw_level).includes(query) ||
                    // Recompensa EXP
                    String(npc.recompensa.exp).includes(query) ||
                    // Recompensa NW EXP
                    String(npc.recompensa.nw_exp).includes(query) ||
                    // Itens de recompensa
                    npc.recompensa.itens.some(item =>
                        item.nome.toLowerCase().includes(query) ||
                        String(item.quantidade).includes(query)
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