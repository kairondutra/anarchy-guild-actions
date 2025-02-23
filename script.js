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

    // Função para formatar as recompensas
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

    // Função para formatar os objetivos
    function formatarObjetivo(objetivo) {
        // Substitui pontos finais seguidos de espaço por "<br>" para criar quebras de linha
        return objetivo.replace(/\. /g, ".<br>");
    }


    // Itera sobre todas as regiões e NPCs
    for (const [region, npcs] of Object.entries(npcsData)) {
        npcs.forEach((npc) => {
            let matchesFilter = true;

            // Verifica se a task corresponde aos filtros
            if (filterDerrotar && !npc.objetivo.toLowerCase().includes("derrotar")) {
                matchesFilter = false;
            }
            if (filterColetar && !npc.objetivo.toLowerCase().includes("coletar")) {
                matchesFilter = false;
            }
            if (filterLevel300 && npc.requisitos.level !== 300) {
                matchesFilter = false;
            }
            if (filterLevel400 && npc.requisitos.level < 400) {
                matchesFilter = false;
            }
            if (filterLevel300 && filterLevel400 && npc.requisitos.level < 400) {
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
                    npc.objetivo.toLowerCase().includes(query) ||
                    String(npc.requisitos.level).includes(query) ||
                    String(npc.requisitos.nw_level).includes(query) ||
                    npc.recompensa.itens.some(item =>
                        item.nome.toLowerCase().includes(query) ||
                        String(item.quantidade).includes(query)
                    )
                )
            ) {
                foundResults = true;

                // Formata as recompensas
                const recompensasFormatadas = formatarRecompensas(
                    npc.recompensa.exp,
                    npc.recompensa.nw_exp,
                    npc.recompensa.itens || []
                );

                // Cria o card do NPC
                const npcCard = `
                    <div class="npc-card">
                        <h3>${npc.npc} (${region})</h3>
                        <p><strong>Objetivo:</strong><br>${formatarObjetivo(npc.objetivo)}</p>
                        <p><strong>Requisitos:</strong> Level ${npc.requisitos.level}, NW Level ${npc.requisitos.nw_level}</p>
                        <p><strong>Recompensas:</strong> ${recompensasFormatadas}</p>
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