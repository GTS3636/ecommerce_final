// ============================================
// GERENCIAMENTO DO CARRINHO
// ============================================

// Função para obter o carrinho do localStorage
function getCart() {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
}

// Função para salvar o carrinho no localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCartCount()
}

// Função para adicionar item ao carrinho (para usar em outras páginas)
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId)
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity })
    }
    
    saveCart(cart);
    alert('Produto adicionado ao carrinho!')
}

// Função para remover item do carrinho
function removeFromCart(productId) {
    if (confirm('Deseja remover este item do carrinho?')) {
        let cart = getCart()
        cart = cart.filter(item => item.id !== productId)
        saveCart(cart)
        loadCartItems()
    }
}

// Função para atualizar quantidade de um item
function updateQuantity(productId, newQuantity) {
    const cart = getCart()
    const item = cart.find(item => item.id === productId)
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId)
        } else {
            // Verificar estoque
            const product = getProductInfo(productId)
            if (newQuantity > product.stock) {
                alert(`Estoque disponível: ${product.stock} unidades`)
                return
            }
            
            item.quantity = parseInt(newQuantity)
            saveCart(cart)
            loadCartItems()
        }
    }
}

// Função para limpar todo o carrinho
function limparCarrinho() {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        localStorage.removeItem('cart')
        updateCartCount()
        loadCartItems()
    }
}

// Função para atualizar contador do carrinho no header
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// ============================================
// DADOS DOS PRODUTOS (Mock Data)
// ============================================

// Simulação de banco de dados de produtos
// IMPORTANTE: Substitua isso por uma chamada à sua API/banco de dados real
const productsDatabase = {
    '1': {
        id: '1',
        name: 'Notebook Gamer',
        price: 4500.00,
        image: 'https://via.placeholder.com/200x200/00bfff/ffffff?text=Notebook',
        category: 'Eletrônicos',
        stock: 10
    },
    '2': {
        id: '2',
        name: 'Mouse Gamer RGB',
        price: 150.00,
        image: 'https://via.placeholder.com/200x200/1e90ff/ffffff?text=Mouse',
        category: 'Periféricos',
        stock: 25
    },
    '3': {
        id: '3',
        name: 'Teclado Mecânico',
        price: 350.00,
        image: 'https://via.placeholder.com/200x200/00bfff/ffffff?text=Teclado',
        category: 'Periféricos',
        stock: 15
    },
    '4': {
        id: '4',
        name: 'Monitor 27" 144Hz',
        price: 1200.00,
        image: 'https://via.placeholder.com/200x200/1e90ff/ffffff?text=Monitor',
        category: 'Eletrônicos',
        stock: 8
    },
    '5': {
        id: '5',
        name: 'Headset Gamer',
        price: 280.00,
        image: 'https://via.placeholder.com/200x200/00bfff/ffffff?text=Headset',
        category: 'Periféricos',
        stock: 20
    },
    '6': {
        id: '6',
        name: 'Webcam Full HD',
        price: 320.00,
        image: 'https://via.placeholder.com/200x200/1e90ff/ffffff?text=Webcam',
        category: 'Periféricos',
        stock: 12
    },
    '7': {
        id: '7',
        name: 'SSD 1TB NVMe',
        price: 650.00,
        image: 'https://via.placeholder.com/200x200/00bfff/ffffff?text=SSD',
        category: 'Armazenamento',
        stock: 30
    },
    '8': {
        id: '8',
        name: 'Placa de Vídeo RTX',
        price: 3200.00,
        image: 'https://via.placeholder.com/200x200/1e90ff/ffffff?text=GPU',
        category: 'Hardware',
        stock: 5
    }
}

// Função para buscar informações de um produto
function getProductInfo(productId) {
    return productsDatabase[productId] || {
        id: productId,
        name: 'Produto não encontrado',
        price: 0,
        image: 'https://via.placeholder.com/200x200/cccccc/666666?text=Sem+Imagem',
        category: 'N/A',
        stock: 0
    }
}

// ============================================
// CARREGAMENTO E EXIBIÇÃO DOS ITENS
// ============================================

function loadCartItems() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 80px; color: #ccc; margin-bottom: 20px;"></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione produtos para continuar comprando</p>
                <button class="btnFunction" onclick="window.location.href='produtos.html'" style="margin-top: 20px;">
                    <i class="fas fa-shopping-bag"></i> Ir para Produtos
                </button>
            </div>
        `;
        updateOrderSummary(0, 0);
        return;
    }
    
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const product = getProductInfo(item.id);
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${product.name}</h3>
                    <p class="cart-item-category">
                        <i class="fas fa-tag"></i> ${product.category}
                    </p>
                    <p class="cart-item-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    <p style="font-size: 12px; color: #28a745; margin-top: 5px;">
                        <i class="fas fa-box"></i> Estoque: ${product.stock} unidades
                    </p>
                </div>
                <div class="cart-item-quantity">
                    <label>Quantidade:</label>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" title="Diminuir">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input 
                            type="number" 
                            value="${item.quantity}" 
                            min="1" 
                            max="${product.stock}"
                            onchange="updateQuantity('${item.id}', this.value)"
                        >
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" title="Aumentar">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <p class="item-total-label">Total:</p>
                    <p class="item-total-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="cart-item-remove">
                    <button onclick="removeFromCart('${item.id}')" title="Remover item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    // Calcular frete (exemplo: R$ 15 fixo ou grátis acima de R$ 500)
    const shipping = subtotal >= 500 ? 0 : 15.00;
    updateOrderSummary(subtotal, shipping);
}

// ============================================
// RESUMO DO PEDIDO
// ============================================

function updateOrderSummary(subtotal, shipping) {
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    
    if (shipping === 0) {
        document.getElementById('shipping').innerHTML = '<span style="color: #28a745; font-weight: bold;">GRÁTIS</span>';
    } else {
        document.getElementById('shipping').textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
    }
    
    document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ============================================
// FINALIZAR COMPRA
// ============================================

function finalizarCompra() {
    const cart = getCart();
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Verificar se usuário está logado
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        if (confirm('Você precisa estar logado para finalizar a compra. Deseja fazer login agora?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    const total = document.getElementById('total').textContent;
    
    if (confirm(`Confirmar compra no valor de ${total}?\n\nOs itens serão processados e você receberá um email de confirmação.`)) {
        
        // Preparar dados do pedido
        const orderData = {
            user: JSON.parse(currentUser),
            items: cart.map(item => {
                const product = getProductInfo(item.id);
                return {
                    productId: item.id,
                    productName: product.name,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    total: product.price * item.quantity
                };
            }),
            subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('R$ ', '').replace(',', '.')),
            shipping: document.getElementById('shipping').textContent === 'GRÁTIS' ? 0 : 15,
            total: parseFloat(document.getElementById('total').textContent.replace('R$ ', '').replace(',', '.')),
            timestamp: new Date().toISOString(),
            status: 'pendente'
        };
        
        // Aqui você enviaria os dados para o servidor
        console.log('📦 Pedido finalizado:', orderData);
        
        // Salvar histórico de pedidos (opcional)
        let orders = localStorage.getItem('orders');
        orders = orders ? JSON.parse(orders) : [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Limpar carrinho após compra
        localStorage.removeItem('cart');
        updateCartCount();
        
        // Mensagem de sucesso
        alert('✅ Compra realizada com sucesso!\n\nNúmero do pedido: #' + Date.now() + '\n\nObrigado pela preferência!');
        
        // Redirecionar
        window.location.href = 'index.html';
    }
}

// ============================================
// MENU SIDEBAR
// ============================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Event listeners para o menu
document.getElementById('menuBtn')?.addEventListener('click', toggleSidebar);
document.getElementById('closeBtn')?.addEventListener('click', toggleSidebar);
document.getElementById('overlay')?.addEventListener('click', toggleSidebar);

// ============================================
// LOGOUT
// ============================================

function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// ============================================
// CARREGAMENTO DE DADOS DO USUÁRIO
// ============================================

function loadUserData() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            document.getElementById('userName').textContent = user.nome || 'Usuário';
            document.getElementById('userEmail').textContent = user.email || 'email@exemplo.com';
        } catch (e) {
            console.error('Erro ao carregar dados do usuário:', e);
            document.getElementById('userName').textContent = 'Usuário';
            document.getElementById('userEmail').textContent = 'email@exemplo.com';
        }
    } else {
        // Usuário não logado
        document.getElementById('userName').textContent = 'Visitante';
        document.getElementById('userEmail').textContent = 'Faça login';
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Sistema de Checkout carregado');
    loadUserData()
    updateCartCount()
    loadCartItems()
});

// ============================================
// FUNÇÕES AUXILIARES PARA OUTRAS PÁGINAS
// ============================================

// Exemplo de uso em produtos.html:
// <button onclick="addToCart('1', 1)">Adicionar ao Carrinho</button>

// Exportar funções para uso global
window.cartSystem = {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    updateCartCount,
    limparCarrinho
}