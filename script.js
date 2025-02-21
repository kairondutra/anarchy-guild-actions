document.addEventListener("DOMContentLoaded", () => {
    let npcsData = {};

    // Carrega os dados do JSON
    fetch("data/data_nwtasks.json")
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

        // Itera sobre todas as regiões, NPC's, 
        for (const [region, npcs] of Object.entries(npcsData)) {
            npcs.forEach((npc) => {
                // Verifica se o termo está presente em algum dos campos relevantes
                if (
                    npc.npc.toLowerCase().includes(query) ||
                    region.toLowerCase().includes(query) ||
                    npc.objetivos.toLowerCase().includes(query) ||
                    npc.recompensa.exp.toString().includes(query) ||
                    npc.recompensa.nw_exp.toString().includes(query) ||
                    npc.recompensa.itens.some(item => 
                        item.nome.toLowerCase().includes(query) || 
                        item.quantidade.toString().includes(query)
                    )
                ) {
                    foundResults = true;
                    const npcCard = `
                        <div class="npc-card">
                            <h3>${npc.npc} (${region})</h3>
                            <p><strong>Objetivo:</strong> ${npc.objective}</p>
                            <p><strong>Requisitos:</strong> Level ${npc.requisitos.level}, NW Level ${npc.requisitos.nw_level}</p>
                            <p><strong>Recompensas:</strong> EXP ${npc.recompensa.exp}, NW EXP ${npc.recompensa.nw_exp}</p>
                            <p><strong>Itens:</strong> ${npc.recompensa.itens.length > 0 ? npc.recompensa.itens.map(item => `${item.quantidade}x ${item.nome}`).join(", ") : "Nenhum item"}</p>
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
