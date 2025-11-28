// frontend/checkout.js - Script para páginas index.html e checkout.html

// Detectar em qual página estamos
const getCurrentPage = () => window.location.pathname.split('/').pop();
const isIndexPage = () => {
    const page = getCurrentPage();
    return page === 'index.html' || page === '' || page === '/';
};
const isCheckoutPage = () => getCurrentPage() === 'checkout.html';

// Estado da aplicação
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];
let productsGrid = null;

// Constantes
const SHIPPING_COST = 15.90; // Custo fixo de frete

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
    return parseFloat(price).toFixed(2).replace('.', ',');
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
// FUNCÇÕES ESPECÍFICAS DA PÁGINA INDEX.HTML
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

        productsGrid.innerHTML = products.map(product => `
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
    function viewProductDetails(productId) {
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
    function closeProductModal() {
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
    });

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

    // Prevenir que ESC feche modal se não houver modal ativo
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });
}

// ================================
// FUNCÕES ESPECÍFICAS DA PÁGINA CHECKOUT.HTML
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
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${item.id}, this.value)" />
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="cart-item-total">
                    <span class="item-total-label">Total:</span>
                    <span class="item-total-price">R$ ${formatPrice(item.price * item.quantity)}</span>
                </div>
                
                <div class="cart-item-remove">
                    <button onclick="removeFromCart(${item.id})" title="Remover produto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
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
        const shipping = cart.length > 0 ? SHIPPING_COST : 0;
        const total = subtotal + shipping;
        
        subtotalElement.textContent = `R$ ${formatPrice(subtotal)}`;
        shippingElement.textContent = `R$ ${formatPrice(shipping)}`;
        totalElement.textContent = `R$ ${formatPrice(total)}`;

        // Atualizar também no header se existir
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    // Finalizar compra
    function finalizarCompra() {
        if (cart.length === 0) {
            showNotification('Adicione produtos ao carrinho primeiro!', 'error');
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + SHIPPING_COST;
        
        if (confirm(`Confirmar pedido?\n\nTotal: R$ ${formatPrice(total)}\n\nVocê será redirecionado para a página de pagamento.`)) {
            // Aqui você pode implementar a lógica de finalização
            // Por enquanto, apenas limpa o carrinho e mostra mensagem
            
            localStorage.removeItem('cart');
            cart = [];
            
            renderCartItems();
            updateOrderSummary();
            updateCartBadge();
            
            showNotification('Pedido finalizado com sucesso!', 'success');
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
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

    // Event listeners para inputs de quantidade
    document.addEventListener('change', (e) => {
        if (e.target.type === 'number' && e.target.closest('.quantity-controls')) {
            const cartItem = e.target.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.productId);
            updateQuantityOnBlur(productId, e.target);
        }
    });

    // Event listeners para botões de quantidade
    document.addEventListener('click', (e) => {
        if (e.target.closest('.quantity-controls button')) {
            const button = e.target.closest('button');
            const input = button.parentElement.querySelector('input');
            const cartItem = button.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.productId);
            const currentValue = parseInt(input.value);
            const newValue = button.querySelector('.fa-minus') ? currentValue - 1 : currentValue + 1;
            
            if (newValue >= 1) {
                input.value = newValue;
                updateQuantity(productId, newValue);
            }
        }
    });
}