document.addEventListener("DOMContentLoaded", () => {
    // Botão "ver detalhes"
    document.querySelectorAll(".btn-view-order").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.pedidoId;
            verDetalhes(id);
        });
    });

    // Botão "rastrear pedido"
    document.querySelectorAll(".btn-track-compact").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.pedidoId;
            rastrearPedido(id);
        });
    });
});


/* ---------------------------------------------------
   Função VER DETALHES — versão inicial com fetch
----------------------------------------------------*/
async function verDetalhes(pedidoId) {
    try {
        const response = await fetch(`/api/pedidos/${pedidoId}`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar pedido #${pedidoId}`);
        }

        const pedido = await response.json();

        preencherDetalhesModal(pedido);
        abrirModal();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar os detalhes do pedido.");
    }
}


/* ---------------------------------------------------
   Funções auxiliares do modal
----------------------------------------------------*/
function abrirModal() {
    document.getElementById("orderModal").classList.add("active");
}

function fecharModal() {
    document.getElementById("orderModal").classList.remove("active");
}


function preencherDetalhesModal(pedido) {
    const modalBody = document.getElementById("orderModalBody");

    modalBody.innerHTML = `
        <div class="order-detail-header">
            <h2>Pedido #${pedido.id}</h2>
            <span class="order-status status-${pedido.status.toLowerCase()}">
                ${pedido.status}
            </span>
        </div>

        <p class="order-detail-date">
            Realizado em ${new Date(pedido.data).toLocaleString("pt-BR")}
        </p>

        <h3><i class="fas fa-list"></i> Itens do Pedido</h3>
        ${pedido.itens.map(item => `
            <div class="item-row">
                <div class="item-info">
                    <img src="${item.produto.imagem}" class="item-image">
                    <div class="item-details">
                        <h4>${item.produto.nome}</h4>
                        <p>Quantidade: ${item.quantidade}</p>
                    </div>
                </div>
                <div class="item-price">R$ ${item.valor.toFixed(2)}</div>
            </div>
        `).join("")}

        <div class="order-total">
            <span>Total do Pedido</span>
            <span>R$ ${pedido.total.toFixed(2)}</span>
        </div>

        <div class="order-actions">
            <button class="btn-action btn-track">
                <i class="fas fa-map-marker-alt"></i> Rastrear Pedido
            </button>

            ${pedido.status === "Processando" ? `
                <button class="btn-action btn-cancel">
                    <i class="fas fa-times-circle"></i> Cancelar Pedido
                </button>
            ` : ""}
        </div>
    `;
}
