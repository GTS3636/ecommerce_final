// frontend/checkout.js

const productsGrid = document.querySelector('.products-grid');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

// Estado da aplicação
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
        productsGrid.innerHTML = `
            <p style="color: red; grid-column: 1 / -1; text-align: center;">
                Erro ao carregar produtos. Tente novamente mais tarde.
            </p>
        `;
    }
}

// Renderizar produtos na grid
function renderProducts(products) {
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
                    ? `<img src="${product.imagem_url}" alt="${escapeHtml(product.nome)}" onerror="this.src='https://via.placeholder.com/200?text=Sem+Imagem'">` 
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

// Atualizar badge do carrinho
function updateCartBadge() {
    const cartBtn = document.querySelector('.cart-btn');
    const existingBadge = cartBtn.querySelector('.cart-badge');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
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

// Buscar produtos
function searchProducts() {
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

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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

// Event Listeners
if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', searchProducts);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartBadge();
});

// Prevenir que ESC feche modal se não houver modal ativo
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});