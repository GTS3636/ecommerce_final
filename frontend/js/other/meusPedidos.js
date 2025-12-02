// meusPedidos.js - Versão Corrigida

const API_BASE_URL = 'http://localhost:3000'; // Ajuste conforme sua API

// Carrega os pedidos quando a página é carregada
document.addEventListener('DOMContentLoaded', async () => {
    await carregarPedidos();
});

// Função para buscar pedidos do usuário
async function carregarPedidos() {
    const userId = localStorage.getItem('idUsuario');

    if (!userId) {
        mostrarMensagemSemPedidos();
        return;
    }

    try {
        // Busca os pedidos do usuário
        const response = await fetch(`${API_BASE_URL}/pedido/listar/`, { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } });

        if (!response.ok) {
            throw new Error('Erro ao carregar pedidos');
        }

        const result = await response.json()

        const pedidos = result.filter(pedido => pedido.idUsuario == userId)

        if (!pedidos || pedidos.length === 0) {
            mostrarMensagemSemPedidos();
            return;
        }

        // Para cada pedido, busca os itens
        const pedidosComItens = await Promise.all(
            pedidos.map(async (pedido) => {
                try {
                    // Busca os itens do pedido
                    const response = await fetch(`${API_BASE_URL}/itemPedido/listar`, { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } });
                    const responseData = await response.json()
                    const itensResponse = responseData.filter(item => item.idPedido == pedido.codPedido);

                    if (itensResponse) {
                        const itens = itensResponse
                        pedido.itens = itens || []
                        console.log("Pedido itens: ", pedido.itens)
                        console.log("Itens: ", itens)
                    } else {
                        pedido.itens = []
                    }
                } catch (error) {
                    console.error(`Erro ao carregar itens do pedido ${pedido.codPedido}:`, error);
                    pedido.itens = [];
                }
                return pedido;
            })
        );

        renderizarPedidos(pedidosComItens);

    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        mostrarErro('Não foi possível carregar seus pedidos. Tente novamente mais tarde.');
    }
}

// Renderiza os cards dos pedidos
function renderizarPedidos(pedidos) {
    const ordersContent = document.getElementById('ordersContent');
    ordersContent.innerHTML = '';

    pedidos.forEach(pedido => {
        const card = criarCardPedido(pedido);
        ordersContent.appendChild(card);
    });
}

// Cria o card de um pedido
function criarCardPedido(pedido) {
    console.log("Pedido: ", pedido);

    const card = document.createElement('div');
    card.className = 'order-card-compact';

    // Calcula o total de itens
    const totalItens = pedido.itens.reduce((total, item) => {
        return total + (item.quantidade || 1);
    }, 0);

    console.log(totalItens);


    // Formata a data
    const dataFormatada = formatarData(pedido.dataPedido || pedido.data);

    // Define o status
    const statusInfo = obterStatusInfo(pedido.status);

    // Cria preview das imagens (máximo 2 imagens + contador)
    const previewImagens = criarPreviewImagens(pedido.itens);

    card.innerHTML = `
        <div class="order-card-header">
            <div class="order-info-compact">
                <span class="order-number-compact">#${pedido.codPedido}</span>
                <span class="order-date-compact">${dataFormatada}</span>
            </div>
            <span class="order-status ${statusInfo.classe}">
                <i class="${statusInfo.icone}"></i> ${statusInfo.texto}
            </span>
        </div>
        <div class="order-card-body">
            <div class="order-preview-items">
                ${previewImagens}
            </div>
            <div class="order-summary-compact">
                <div class="summary-item">
                    <i class="fas fa-box"></i>
                    <span>${totalItens} ${totalItens === 1 ? 'item' : 'itens'}</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-dollar-sign"></i>
                    <span class="total-value">R$ ${formatarValor(pedido.valorTotal)}</span>
                </div>
            </div>
        </div>
        <div class="order-card-footer">
            <button class="btn-view-order" onclick="abrirModal(${pedido.codPedido})">
                <i class="fas fa-eye"></i> Ver Detalhes
            </button>
            ${pedido.status === 'PROCESSANDO' || pedido.status === 'CONFIRMADO' ?
            `<button class="btn-cancel-compact" onclick="cancelarPedido(${pedido.codPedido})">
                    <i class="fas fa-times"></i>
                </button>` :
            `<button class="btn-track-compact" onclick="rastrearPedido(${pedido.codPedido})">
                    <i class="fas fa-map-marker-alt"></i>
                </button>`
        }
        </div>
    `;

    return card;
}

// Cria o preview das imagens dos produtos
function criarPreviewImagens(itens) {
    if (!itens || itens.length === 0) {
        return '<div class="preview-image no-image"><i class="fas fa-image"></i></div>';
    }

    let html = '';
    const maxImagens = 2;

    // Mostra no máximo 2 imagens
    for (let i = 0; i < Math.min(itens.length, maxImagens); i++) {
        const item = itens[i];
        const imagemUrl = item.produto?.imagem || item.imagem || '';

        if (imagemUrl) {
            html += `<img src="${imagemUrl}" alt="Produto" class="preview-image">`;
        } else {
            html += '<div class="preview-image no-image"><i class="fas fa-box"></i></div>';
        }
    }

    // Se houver mais itens, mostra contador
    if (itens.length > maxImagens) {
        html += `<div class="more-items">+${itens.length - maxImagens}</div>`;
    }

    return html;
}

// Formata a data para dd/mm/yyyy
function formatarData(data) {
    if (!data) return 'Data não disponível';

    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

// Formata valor monetário
function formatarValor(valor) {
    if (!valor) return '0,00';
    return parseFloat(valor).toFixed(2).replace('.', ',');
}

// Retorna informações de estilo baseado no status
function obterStatusInfo(status) {
    const statusMap = {
        'CONFIRMADO': { classe: 'status-confirmado', icone: 'fas fa-check-circle', texto: 'Confirmado' },
        'PROCESSANDO': { classe: 'status-processando', icone: 'fas fa-cog', texto: 'Processando' },
        'ENVIADO': { classe: 'status-enviado', icone: 'fas fa-shipping-fast', texto: 'Em Trânsito' },
        'ENTREGUE': { classe: 'status-entregue', icone: 'fas fa-check-double', texto: 'Entregue' },
        'CANCELADO': { classe: 'status-cancelado', icone: 'fas fa-times-circle', texto: 'Cancelado' }
    };

    return statusMap[status] || { classe: 'status-processando', icone: 'fas fa-question', texto: status };
}

// Abre o modal com detalhes do pedido
async function abrirModal(pedidoId) {
    try {
        // Buscar dados do pedido
        const response = await fetch(`${API_BASE_URL}/pedido/consultar/${pedidoId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error('Erro ao buscar detalhes');

        const pedido = await response.json();

        // Buscar itens do pedido
        const itensResponse = await fetch(`${API_BASE_URL}/itemPedido/listar`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (itensResponse.ok) {
            const itens = await itensResponse.json()
            console.log("ITEMS DA API:", itens);

            pedido.itens = itens.filter(item => item.idPedido == pedido.codPedido);
        }
        

        renderizarModal(pedido);

        // Mostrar modal
        const modal = document.getElementById('orderModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        alert('Não foi possível carregar os detalhes do pedido.');
    }
}

// Renderiza o conteúdo do modal
function renderizarModal(pedido) {
    const modalBody = document.getElementById('orderModalBody')
    console.log(modalBody);

    const statusInfo = obterStatusInfo(pedido.status);
    const dataFormatada = formatarData(pedido.dataPedido || pedido.data);

    let itensHtml = '';
    if (pedido.itens && pedido.itens.length > 0) {
        itensHtml = pedido.itens.map(item => `
            <div class="item-row">
                <div class="item-info">
                    <img src="${item.produto?.imagem || ''}" alt="Produto" class="item-image" 
                         onerror="this.src=''">
                    <div class="item-details">
                        <h4>${item.produto?.nome || item.nomeProduto || 'Produto'}</h4>
                        <p>Quantidade: ${item.quantidade}</p>
                    </div>
                </div>
                <div class="item-price">R$ ${formatarValor(item.precoUnitario * item.quantidade)}</div>
            </div>
        `).join('');
    }

    modalBody.innerHTML = `
        <div class="order-detail-header">
            <h2>Pedido #${pedido.codPedido}</h2>
            <span class="order-status ${statusInfo.classe}">
                <i class="${statusInfo.icone}"></i> ${statusInfo.texto}
            </span>
        </div>
        <p class="order-detail-date">Realizado em ${dataFormatada}</p>

        <div class="order-items">
            <h3><i class="fas fa-list"></i> Itens do Pedido</h3>
            ${itensHtml || '<p>Nenhum item encontrado</p>'}
        </div>

        <div class="order-total">
            <span>Total do Pedido</span>
            <span>R$ ${formatarValor(pedido.valorTotal)}</span>
        </div>

        <div class="order-actions">
            ${pedido.status === 'ENVIADO' ?
            `<button class="btn-action btn-track" onclick="rastrearPedido(${pedido.codPedido})">
                    <i class="fas fa-map-marker-alt"></i> Rastrear Pedido
                </button>` : ''
        }
            ${pedido.status === 'PROCESSANDO' || pedido.status === 'CONFIRMADO' ?
            `<button class="btn-action btn-cancel" onclick="cancelarPedido(${pedido.codPedido})">
                    <i class="fas fa-times-circle"></i> Cancelar Pedido
                </button>` : ''
        }
        </div>
    `;
}

// Fecha o modal
function fecharModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Mostra mensagem quando não há pedidos
function mostrarMensagemSemPedidos() {
    const ordersContent = document.getElementById('ordersContent');
    ordersContent.innerHTML = `
        <div class="empty-orders">
            <i class="fas fa-shopping-bag"></i>
            <h2>Você ainda não fez nenhum pedido</h2>
            <p>Explore nossa loja e encontre produtos incríveis!</p>
            <a href="./index.html" class="btn-shop">
                <i class="fas fa-shopping-cart"></i> Começar a Comprar
            </a>
        </div>
    `;
}

// Mostra mensagem de erro
function mostrarErro(mensagem) {
    const ordersContent = document.getElementById('ordersContent');
    ordersContent.innerHTML = `
        <div class="empty-orders">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Ops! Algo deu errado</h2>
            <p>${mensagem}</p>
            <button onclick="carregarPedidos()" class="btn-shop">
                <i class="fas fa-redo"></i> Tentar Novamente
            </button>
        </div>
    `;
}