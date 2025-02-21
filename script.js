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
                if (
                    npc.npc.toLowerCase().includes(query) ||
                    region.toLowerCase().includes(query)
                ) {
                    foundResults = true;
                    const npcCard = `
              <div class="npc-card">
                <h3>${npc.npc} (${region})</h3>
                <p><strong>Objetivo:</strong> ${npc.objetivos}</p>
                <p><strong>Requisitos:</strong> Level ${npc.requisitos.level}, NW Level ${npc.requisitos.nw_level}</p>
                <p><strong>Recompensas:</strong> EXP ${npc.recompensa.exp}, NW EXP ${npc.recompensa.nw_exp}</p>
                <p><strong>Itens:</strong> ${npc.recompensa.itens.map(item => `${item.quantidade}x ${item.nome}`).join(", ")}</p>
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