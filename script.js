document.addEventListener("DOMContentLoaded", () => {
    let npcsData = {};
    fetch("data_nwtasks.json")
        .then((response) => response.json())
        .then((data) => {
            npcsData = data;
            applyFilters();
        })
        .catch((error) => console.error("Erro ao carregar dados:", error));

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
            return objetivos.replace(/\. /g, ".<br>");
        }

        for (const [region, npcs] of Object.entries(npcsData)) {
            npcs.forEach((npc) => {
                let matchesFilter = true;

                if (filterDerrotar && !npc.objetivos?.toLowerCase().includes("derrotar")) {
                    matchesFilter = false;
                }
                if (filterColetar && !npc.objetivos?.toLowerCase().includes("coletar")) {
                    matchesFilter = false;
                }
                if (filterLevel300 && filterLevel400) {
                    if (npc.requisitos.level < 300) {
                        matchesFilter = false;
                    }
                } else if (filterLevel300 && npc.requisitos.level !== 300) {
                    matchesFilter = false;
                } else if (filterLevel400 && npc.requisitos.level < 400) {
                    matchesFilter = false;
                }
                if (filterNWLevel50 && npc.requisitos.nw_level < 50) {
                    matchesFilter = false;
                }
                if (filterBlackGem && !(npc.recompensa.itens || []).some(item => item.nome.toLowerCase().includes("black nightmare gem"))) {
                    matchesFilter = false;
                }
                if (filterBeastBall && !(npc.recompensa.itens || []).some(item => item.nome.toLowerCase().includes("beast ball"))) {
                    matchesFilter = false;
                }

                if (
                    matchesFilter &&
                    (
                        npc.npc.toLowerCase().includes(query) ||
                        region.toLowerCase().includes(query) ||
                        npc.objetivos?.toLowerCase().includes(query) ||
                        String(npc.requisitos.level).includes(query) ||
                        String(npc.requisitos.nw_level).includes(query) ||
                        npc.recompensa.itens.some(item =>
                            item.nome.toLowerCase().includes(query) ||
                            String(item.quantidade).includes(query)
                        )
                    )
                ) {
                    foundResults = true;
                    const expFormatted = npc.recompensa.exp;
                    const nwExpFormatted = npc.recompensa.nw_exp;

                    const recompensasFormatadas = formatarRecompensas(
                        expFormatted,
                        nwExpFormatted,
                        npc.recompensa.itens || []
                    );

                    const npcCard = `
                        <div class="npc-card">
                            <h3 class="npc-name">${npc.npc}</h3>
                            <p class="npc-requirements"><strong>Requisitos:</strong> Level ${npc.requisitos.level}, NW Level ${npc.requisitos.nw_level}</p>
                            <p class="npc-objective"><strong>Objetivos:</strong><br>${formatarObjetivos(npc.objetivos)}</p>
                            <p class="npc-rewards"><strong>Recompensas:</strong> ${recompensasFormatadas}</p>
                            <button class="copy-btn" data-local="${npc.coordenadas || 'Coordenada não disponível'}">Copiar Local</button>
                        </div>
                    `;
                    resultsDiv.innerHTML += npcCard;
                }
            });
        }

        if (!foundResults) {
            resultsDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        }

        addCopyLocationFunctionality();
    };

    function addCopyLocationFunctionality() {
        const copyButtons = document.querySelectorAll(".copy-btn");

        copyButtons.forEach(button => {
            const local = button.getAttribute("data-local");

            // Remove eventos de clique existentes
            button.removeEventListener("click", button.onclick);
            button.onclick = null;

            // Verifica se as coordenadas são inválidas
            if (local === "Coordenada não disponível") {
                button.disabled = true;
                button.textContent = "Sem Coordenadas";
            } else {
                button.disabled = false;
                button.textContent = "Copiar Coordenada";
                button.addEventListener("click", function () {
                    navigator.clipboard.writeText(local).then(() => {
                        this.textContent = "Copiado!";
                        this.disabled = true;
                        setTimeout(() => {
                            this.textContent = "Copiar Local";
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