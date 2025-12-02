// frontend/checkout.js - Script para páginas index.html e checkout.html

// ================================
// CONFIGURAÇÃO DE CAMINHOS
// ================================

// Detectar caminho base dinamicamente
const getBasePath = () => {
    const path = window.location.pathname;
    // Se estiver em uma subpasta, ajusta o caminho
    if (path.includes('/frontend/')) {
        return '../';
    }
    return './';
};

// Detectar em qual página estamos
const getCurrentPage = () => {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    return page || 'index.html';
};

const isIndexPage = () => {
    const page = getCurrentPage();
    return page === 'index.html' || page === '' || page === '/';
};

const isCheckoutPage = () => getCurrentPage() === 'checkout.html';

// ================================
// ESTADO DA APLICAÇÃO
// ================================

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];
let productsGrid = null;
let SHIPPING_COST;

// ================================
// FUNÇÕES COMPARTILHADAS (ambas as páginas)
// ================================

// Atualizar badge do carrinho
function updateCartBadge() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartCountHeader = document.getElementById('cartCount');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Atualizar badge no botão do carrinho (footer)
    if (cartBtn) {
        const existingBadge = cartBtn.querySelector('.cart-badge');

        if (totalItems > 0) {
            if (existingBadge) {
                existingBadge.textContent = totalItems;
            } else {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = totalItems;
                cartBtn.appendChild(badge);
            }
        } else if (existingBadge) {
            existingBadge.remove();
        }
    }

    // Atualizar contador no header (checkout.html)
    if (cartCountHeader) {
        cartCountHeader.textContent = totalItems;
    }
}

// Adicionar produto ao carrinho
function addToCart(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);

    if (!productCard) {
        alert('Erro ao adicionar produto ao carrinho');
        return;
    }

    const product = {
        id: parseInt(productCard.dataset.productId),
        name: productCard.dataset.productName,
        price: parseFloat(productCard.dataset.productPrice),
        image: productCard.dataset.productImage,
        category: productCard.dataset.productCategory,
        description: productCard.dataset.productDescription,
        quantity: 1
    };

    // Verificar se o produto já está no carrinho
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
        showNotification('Quantidade atualizada no carrinho!', 'info');
    } else {
        cart.push(product);
        showNotification('Produto adicionado ao carrinho!', 'success');
    }

    // Salvar carrinho no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();

    // Animação visual
    productCard.classList.add('added-to-cart');
    setTimeout(() => productCard.classList.remove('added-to-cart'), 600);
}

// Funções utilitárias
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatPrice(price) {
    if (typeof price === "string") price = parseFloat(price);
    if (isNaN(price)) return "0,00";
    return price.toFixed(2).replace('.', ',');
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================================
// FUNÇÕES ESPECÍFICAS DA PÁGINA INDEX.HTML
// ================================

if (isIndexPage()) {
    // Buscar produtos do backend
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/produto/listar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }

            const products = await response.json();
            allProducts = products.filter(product => product.ativo); // Apenas produtos ativos
            renderProducts(allProducts);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            if (productsGrid) {
                productsGrid.innerHTML = `
                    <p style="color: red; grid-column: 1 / -1; text-align: center;">
                        Erro ao carregar produtos. Tente novamente mais tarde.
                    </p>
                `;
            }
        }
    }

    // Renderizar produtos na grid
    function renderProducts(products) {
        if (!productsGrid) return;

        if (products.length === 0) {
            productsGrid.innerHTML = `
                <p style="grid-column: 1 / -1; text-align: center; color: #666;">
                    Nenhum produto encontrado.
                </p>
            `;
            return;
        }

        productsGrid.innerHTML = products.map(product =>
            `
            <div class="product-card" 
                 data-product-id="${product.codProduto}"
                 data-product-name="${escapeHtml(product.nome)}"
                 data-product-price="${product.preco}"
                 data-product-image="${product.imagem_url || ''}"
                 data-product-category="${escapeHtml(product.categoria)}"
                 data-product-description="${escapeHtml(product.descricao || '')}">
                
                <div class="product-image">
                    ${product.imagem_url
                ? `<img src="${product.imagem_url}" alt="${escapeHtml(product.nome)}">`
                : `<div class="no-image"><i class="fas fa-image"></i></div>`
            }
                </div>
                
                <div class="product-info">
                    <h3 class="product-title">${escapeHtml(product.nome)}</h3>
                    <p class="product-category">
                        <i class="fas fa-tag"></i> ${escapeHtml(product.categoria)}
                    </p>
                    <p class="product-price">R$ ${formatPrice(product.preco)}</p>
                    
                    ${product.descricao
                ? `<p class="product-description">${truncateText(escapeHtml(product.descricao), 80)}</p>`
                : ''
            }
                </div>
                
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.codProduto})">
                        <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                    </button>
                    <button class="btn-view-details" onclick="viewProductDetails(${product.codProduto})">
                        <i class="fas fa-info-circle"></i> Detalhes
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Ver detalhes do produto
    window.viewProductDetails = function(productId) {
        const product = allProducts.find(p => p.codProduto === productId);

        if (!product) {
            alert('Produto não encontrado');
            return;
        }

        // Criar modal de detalhes
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeProductModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closeProductModal()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="modal-body">
                    <div class="modal-image">
                        ${product.imagem_url
                ? `<img src="${product.imagem_url}" alt="${escapeHtml(product.nome)}">`
                : `<div class="no-image-large"><i class="fas fa-image"></i></div>`
            }
                    </div>
                    
                    <div class="modal-info">
                        <h2>${escapeHtml(product.nome)}</h2>
                        <p class="modal-category">
                            <i class="fas fa-tag"></i> ${escapeHtml(product.categoria)}
                        </p>
                        <p class="modal-price">R$ ${formatPrice(product.preco)}</p>
                        
                        ${product.descricao
                ? `<div class="modal-description">
                                <h3>Descrição</h3>
                                <p>${escapeHtml(product.descricao)}</p>
                               </div>`
                : ''
            }
                        
                        ${Object.keys(product.especificacoes || {}).length > 0
                ? `<div class="modal-specifications">
                                <h3>Especificações</h3>
                                <ul>
                                    ${Object.entries(product.especificacoes)
                    .map(([key, value]) => `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(String(value))}</li>`)
                    .join('')}
                                </ul>
                               </div>`
                : ''
            }
                        
                        <button class="btn-add-cart-modal" onclick="addToCart(${product.codProduto}); closeProductModal();">
                            <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    // Fechar modal de detalhes
    window.closeProductModal = function() {
        const modal = document.querySelector('.product-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Buscar produtos
    function searchProducts() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase().trim();

        if (!searchTerm) {
            renderProducts(allProducts);
            return;
        }

        const filteredProducts = allProducts.filter(product =>
            product.nome.toLowerCase().includes(searchTerm) ||
            product.categoria.toLowerCase().includes(searchTerm) ||
            (product.descricao && product.descricao.toLowerCase().includes(searchTerm))
        );

        renderProducts(filteredProducts);
    }

    // Event Listeners para página inicial
    document.addEventListener('DOMContentLoaded', () => {
        productsGrid = document.querySelector('.products-grid');
        fetchProducts();
        updateCartBadge();

        // Adicionar listener ao botão do carrinho
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = './frontend/checkout.html';
            });
        }

        // Event Listeners para busca
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', searchProducts);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchProducts();
                }
            });
        }
    });

    // Prevenir que ESC feche modal se não houver modal ativo
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeProductModal();
        }
    });
}

// ================================
// FUNÇÕES ESPECÍFICAS DA PÁGINA CHECKOUT.HTML
// ================================

if (isCheckoutPage()) {
    let cartItemsContainer = null;
    let subtotalElement = null;
    let shippingElement = null;
    let totalElement = null;
    let cartCountElement = null;

    // Inicializar quando a página carregar
    document.addEventListener('DOMContentLoaded', () => {
        initializeCheckout();
    });

    // Inicializar funcionalidades do checkout
    function initializeCheckout() {
        // Pegar referências dos elementos
        cartItemsContainer = document.getElementById('cartItems');
        subtotalElement = document.getElementById('subtotal');
        shippingElement = document.getElementById('shipping');
        totalElement = document.getElementById('total');
        cartCountElement = document.getElementById('cartCount');

        // Carregar e renderizar carrinho
        loadCart();
        updateCartBadge();

        // Adicionar listener ao botão de calcular frete
        const calcularFrete = document.getElementById("calcularFrete");
        if (calcularFrete) {
            calcularFrete.addEventListener("click", calcularFreteHandler);
        }

        // Adicionar listeners aos botões de finalizar e limpar
        const btnFinalizar = document.querySelector('.btn-finalizar');
        const btnLimpar = document.querySelector('.btn-limpar');

        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', finalizarCompra);
        }

        if (btnLimpar) {
            btnLimpar.addEventListener('click', limparCarrinho);
        }
    }

    // Handler para calcular frete
    async function calcularFreteHandler(e) {
        e.preventDefault();
        let cep = document.getElementById("cep").value;

        if (!cep || cep === "") {
            return alert("É necessário informar um CEP!");
        }

        try {
            const responseCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dataCep = await responseCep.json();

            if (dataCep.erro) {
                return alert("O CEP informado é inválido.");
            }

            let valores = {
                uf: dataCep.uf
            };

            const response = await fetch("http://localhost:3000/entrega/frete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(valores)
            });

            const data = await response.json();

            SHIPPING_COST = data.valorFrete;
            updateOrderSummary();
            showNotification('Frete calculado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao calcular frete:', error);
            showNotification('Erro ao calcular frete. Tente novamente.', 'error');
        }
    }

    // Carregar carrinho do localStorage
    function loadCart() {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        renderCartItems();
        updateOrderSummary();
    }

    // Renderizar itens do carrinho
    function renderCartItems() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Adicione produtos ao seu carrinho para continuar</p>
                    <button class="btnFunction" onclick="window.location.href='index.html'" style="margin-top: 20px;">
                        <i class="fas fa-arrow-left"></i> Continuar Comprando
                    </button>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    ${item.image
                ? `<img src="${item.image}" alt="${escapeHtml(item.name)}">`
                : `<div class="no-image"><i class="fas fa-image"></i></div>`
            }
                </div>
                
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${escapeHtml(item.name)}</h4>
                    <p class="cart-item-category">
                        <i class="fas fa-tag"></i> ${escapeHtml(item.category)}
                    </p>
                    <p class="cart-item-price">R$ ${formatPrice(item.price)}</p>
                </div>
                
                <div class="cart-item-quantity">
                    <label>Quantidade:</label>
                    <div class="quantity-controls">
                        <button class="btn-quantity-decrease" data-product-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" value="${item.quantity}" min="1" 
                               class="quantity-input" data-product-id="${item.id}" />
                        <button class="btn-quantity-increase" data-product-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="cart-item-total">
                    <span class="item-total-label">Total:</span>
                    <span class="item-total-price">R$ ${formatPrice(item.price * item.quantity)}</span>
                </div>
                
                <div class="cart-item-remove">
                    <button class="btn-remove-item" data-product-id="${item.id}" title="Remover produto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Adicionar event listeners aos botões
        addCartItemListeners();
    }

    // Adicionar event listeners aos itens do carrinho
    function addCartItemListeners() {
        // Botões de diminuir quantidade
        document.querySelectorAll('.btn-quantity-decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                const product = cart.find(item => item.id === productId);
                if (product) {
                    updateQuantity(productId, product.quantity - 1);
                }
            });
        });

        // Botões de aumentar quantidade
        document.querySelectorAll('.btn-quantity-increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                const product = cart.find(item => item.id === productId);
                if (product) {
                    updateQuantity(productId, product.quantity + 1);
                }
            });
        });

        // Inputs de quantidade
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.dataset.productId);
                const newQuantity = parseInt(this.value);
                if (newQuantity > 0) {
                    updateQuantity(productId, newQuantity);
                }
            });
        });

        // Botões de remover
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                removeFromCart(productId);
            });
        });
    }

    // Atualizar quantidade de um produto
    function updateQuantity(productId, newQuantity) {
        const quantity = parseInt(newQuantity);

        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex !== -1) {
            cart[productIndex].quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));

            // Atualizar apenas o item modificado
            renderCartItems();
            updateOrderSummary();
            updateCartBadge();

            showNotification('Quantidade atualizada!', 'success');
        }
    }

    // Remover produto do carrinho
    function removeFromCart(productId) {
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex !== -1) {
            const productName = cart[productIndex].name;
            cart.splice(productIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));

            renderCartItems();
            updateOrderSummary();
            updateCartBadge();

            showNotification(`${productName} removido do carrinho!`, 'info');
        }
    }

    // Atualizar resumo do pedido
    function updateOrderSummary() {
        if (!subtotalElement || !shippingElement || !totalElement) return;

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Sempre atualiza o subtotal
        subtotalElement.textContent = `R$ ${formatPrice(subtotal)}`;

        // Verifica se há itens no carrinho
        if (cart.length > 0) {
            const shipping = SHIPPING_COST;

            if (typeof shipping !== "number") {
                const total = subtotal;
                totalElement.textContent = `R$ ${formatPrice(total)}`;
                shippingElement.textContent = "Digite o seu CEP";
            } else {
                const total = subtotal + shipping;
                totalElement.textContent = `R$ ${formatPrice(total)}`;
                shippingElement.textContent = `R$ ${formatPrice(shipping)}`;
            }
        } else {
            shippingElement.textContent = "Digite o seu CEP.";
            totalElement.textContent = `R$ ${formatPrice(subtotal)}`;
        }

        // Atualizar contador no header
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    // Finalizar compra
    function finalizarCompra() {
        let cep = document.getElementById("cep").value;

        if (!cep || cep === "") {
            return alert("É necessário informar um CEP para a entrega do pedido!");
        }

        if (cart.length === 0) {
            showNotification('Adicione produtos ao carrinho primeiro!', 'error');
            return;
        }

        // Verificar se usuário está logado
        if (!token) {
            showNotification('Você precisa estar logado para finalizar a compra!', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        if (typeof SHIPPING_COST !== 'number') {
            showNotification('Por favor, calcule o frete antes de finalizar!', 'error');
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + SHIPPING_COST;

        if (confirm(`Confirmar pedido?\n\nTotal: R$ ${formatPrice(total)}\n\nVocê será redirecionado para a página de pedidos.`)) {
            // Chamar API para criar pedido
            criarPedido(subtotal, total, cep);
        }
    }

    // Criar pedido na API
    async function criarPedido(subtotal, total, cep) {
        try {
            // Preparar dados do pedido
            const itens = cart.map(item => ({
                codProduto: item.id,
                quantidade: item.quantity,
                precoUnitario: item.price,
                valorTotalItem: item.price * item.quantity
            }));

            const idUsuario = localStorage.getItem("idUsuario");

            const pedidoData = {
                itens: itens,
                valorSubtotal: subtotal,
                valorFrete: SHIPPING_COST,
                valorTotal: total,
                idUsuario: idUsuario,
                cep: cep
            };

            // Log para debug
            console.log('Dados do pedido sendo enviados:', pedidoData);
            console.log('Número de itens:', itens.length);
            console.log('Itens detalhados:', itens);

            const response = await fetch('http://localhost:3000/pedido/cadastrar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedidoData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao criar pedido');
            }

            const result = await response.json();

            showNotification('Pedido criado com sucesso!', 'success');

            // Limpar carrinho
            localStorage.removeItem('cart');
            cart = [];

            // Redirecionar para página de pedidos após 2 segundos
            setTimeout(() => {
                window.location.href = 'pedidosCliente.html';
            }, 2000);

        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            showNotification(`Erro ao criar pedido: ${error.message}`, 'error');
        }
    }

    // Limpar carrinho
    function limparCarrinho() {
        if (cart.length === 0) {
            showNotification('Carrinho já está vazio!', 'info');
            return;
        }

        if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));

            renderCartItems();
            updateOrderSummary();
            updateCartBadge();

            showNotification('Carrinho limpo com sucesso!', 'success');
        }
    }
}