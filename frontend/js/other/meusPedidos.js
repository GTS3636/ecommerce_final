document.addEventListener("DOMContentLoaded", () => {
    // Verificar se usuário está logado
    if (!token) {
        alert('Você precisa estar logado para acessar seus pedidos!');
        window.location.href = 'login.html';
        return;
    }

    // Carregar pedidos do usuário
    carregarPedidosUsuario();

    // Botão "ver detalhes"
    document.addEventListener("click", (e) => {
        if (e.target.closest(".btn-view-order")) {
            const btn = e.target.closest(".btn-view-order");
            const id = btn.dataset.pedidoId;
            verDetalhes(id);
        }
    });

    // Botão "rastrear pedido"
    document.addEventListener("click", (e) => {
        if (e.target.closest(".btn-track-compact")) {
            const btn = e.target.closest(".btn-track-compact");
            const id = btn.dataset.pedidoId;
            rastrearPedido(id);
        }
    });
});

// Carregar pedidos do usuário logado
async function carregarPedidosUsuario() {
    try {
        const response = await fetch('http://localhost:3000/pedido/listar', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar pedidos');
        }

        const pedidos = await response.json();

        const ordersContent = document.getElementById("ordersContent");

        if (!pedidos || pedidos.length === 0) {
            ordersContent.innerHTML = `
                <div class="empty-orders" style="grid-column: 1 / -1; text-align: center; padding: 40px; margin-top: 20px;">
                    <i class="fas fa-shopping-bag" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <h2>Você ainda não fez nenhum pedido</h2>
                    <p>Explore nossa loja e encontre produtos incríveis!</p>
                    <a href="./index.html" class="btn-shop" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
                        <i class="fas fa-shopping-cart"></i> Começar a Comprar
                    </a>
                </div>
            `;
            return;
        }

        // Renderizar pedidos
        ordersContent.innerHTML = pedidos.map(pedido => `
            <div class="order-card-compact">
                <div class="order-card-header">
                    <div class="order-info-compact">
                        <span class="order-number-compact">#${pedido.codPedido}</span>
                        <span class="order-date-compact">${new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <span class="order-status status-${mapearStatusCss(pedido.status)}">
                        ${getStatusIcon(pedido.status)} ${mapearStatusTexto(pedido.status)}
                    </span>
                </div>
                <div class="order-card-body">
                    <div class="order-summary-compact">
                        <div class="summary-item">
                            <i class="fas fa-box"></i>
                            <span>${pedido.itens ? pedido.itens.length : 0} itens</span>
                        </div>
                        <div class="summary-item">
                            <i class="fas fa-dollar-sign"></i>
                            <span class="total-value">R$ ${parseFloat(pedido.valorTotal).toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                </div>
                <div class="order-card-footer">
                    <button class="btn-view-order" data-pedido-id="${pedido.codPedido}">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        const ordersContent = document.getElementById("ordersContent");
        ordersContent.innerHTML = `
            <div style="grid-column: 1 / -1; color: red; text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; margin-bottom: 20px;"></i>
                <p>Erro ao carregar seus pedidos. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Mapear status para classe CSS
function mapearStatusCss(status) {
    const mapa = {
        'PENDENTE_PAGAMENTO': 'pendente',
        'PAGO': 'pago',
        'ENVIADO': 'enviado',
        'ENTREGUE': 'entregue',
        'CANCELADO': 'cancelado'
    };
    return mapa[status] || 'pendente';
}

// Mapear status para texto amigável
function mapearStatusTexto(status) {
    const mapa = {
        'PENDENTE_PAGAMENTO': 'Pendente de Pagamento',
        'PAGO': 'Pago',
        'ENVIADO': 'Em Trânsito',
        'ENTREGUE': 'Entregue',
        'CANCELADO': 'Cancelado'
    };
    return mapa[status] || status;
}

// Retornar ícone apropriado para status
function getStatusIcon(status) {
    const icones = {
        'PENDENTE_PAGAMENTO': '<i class="fas fa-clock"></i>',
        'PAGO': '<i class="fas fa-check-circle"></i>',
        'ENVIADO': '<i class="fas fa-shipping-fast"></i>',
        'ENTREGUE': '<i class="fas fa-box"></i>',
        'CANCELADO': '<i class="fas fa-times-circle"></i>'
    };
    return icones[status] || '<i class="fas fa-question-circle"></i>';
}

/* ---------------------------------------------------
   Função VER DETALHES
----------------------------------------------------*/
async function verDetalhes(pedidoId) {
    try {
        const response = await fetch(`http://localhost:3000/pedido/consultar/${pedidoId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

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

// Rastrear pedido
function rastrearPedido(pedidoId) {
    alert(`Funcionalidade de rastreamento em desenvolvimento para o pedido #${pedidoId}`);
}

/* ---------------------------------------------------
   Funções auxiliares do modal
----------------------------------------------------*/
function abrirModal() {
    const modal = document.getElementById("orderModal");
    if (modal) {
        modal.classList.add("active");
    }
}

function fecharModal() {
    const modal = document.getElementById("orderModal");
    if (modal) {
        modal.classList.remove("active");
    }
}

// Preencher modal com detalhes do pedido
function preencherDetalhesModal(pedido) {
    const modalBody = document.getElementById("orderModalBody");

    if (!modalBody) return;

    const itensHtml = pedido.itens && pedido.itens.length > 0
        ? pedido.itens.map(item => `
            <div class="item-row">
                <div class="item-info">
                    ${item.Produto && item.Produto.imagem_url
                ? `<img src="${item.Produto.imagem_url}" class="item-image" alt="${item.Produto.nome}">`
                : `<div class="no-image"><i class="fas fa-image"></i></div>`
            }
                    <div class="item-details">
                        <h4>${item.Produto ? item.Produto.nome : 'Produto'}</h4>
                        <p>Quantidade: ${item.quantidade}</p>
                    </div>
                </div>
                <div class="item-price">R$ ${parseFloat(item.valorTotalItem).toFixed(2).replace('.', ',')}</div>
            </div>
        `).join("")
        : '<p>Nenhum item no pedido</p>';

    const dataFormatada = new Date(pedido.dataPedido).toLocaleString("pt-BR");

    modalBody.innerHTML = `
        <div class="order-detail-header">
            <h2>Pedido #${pedido.codPedido}</h2>
            <span class="order-status status-${mapearStatusCss(pedido.status)}">
                ${getStatusIcon(pedido.status)} ${mapearStatusTexto(pedido.status)}
            </span>
        </div>

        <p class="order-detail-date">
            Realizado em ${dataFormatada}
        </p>

        <div class="order-timeline">
            <div class="timeline-item ${['PAGO', 'ENVIADO', 'ENTREGUE'].includes(pedido.status) ? 'active' : ''}">
                <div class="timeline-content">
                    <h4><i class="fas fa-check-circle"></i> Pedido Confirmado</h4>
                </div>
            </div>
            <div class="timeline-item ${['ENVIADO', 'ENTREGUE'].includes(pedido.status) ? 'active' : ''}">
                <div class="timeline-content">
                    <h4><i class="fas fa-truck"></i> Enviado</h4>
                </div>
            </div>
            <div class="timeline-item ${pedido.status === 'ENTREGUE' ? 'active' : ''}">
                <div class="timeline-content">
                    <h4><i class="fas fa-home"></i> Entregue</h4>
                </div>
            </div>
        </div>

        <h3><i class="fas fa-list"></i> Itens do Pedido</h3>
        ${itensHtml}

        <div class="order-total">
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Subtotal:</span>
                <span>R$ ${parseFloat(pedido.valorSubtotal).toFixed(2).replace('.', ',')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Frete:</span>
                <span>R$ ${parseFloat(pedido.valorFrete).toFixed(2).replace('.', ',')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; font-weight: bold; font-size: 18px;">
                <span>Total do Pedido</span>
                <span>R$ ${parseFloat(pedido.valorTotal).toFixed(2).replace('.', ',')}</span>
            </div>
        </div>

        <div class="order-actions">
            <button class="btn-action btn-track" onclick="rastrearPedido(${pedido.codPedido})">
                <i class="fas fa-map-marker-alt"></i> Rastrear Pedido
            </button>
        </div>
    `;
}
