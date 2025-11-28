// Este arquivo pode ser usado para funcionalidades adicionais da página
// A funcionalidade do menu está no arquivo de autenticação

// Exemplo: Adicionar funcionalidade ao botão de carrinho
const cartBtn = document.querySelector('.cart-btn');
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        // Redirecionar para a página do carrinho
        window.location.href = './carrinho.html';
    });
}

// Exemplo: Funcionalidade de busca
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // Redirecionar para página de busca com o termo
            window.location.href = `./search.html?q=${encodeURIComponent(searchTerm)}`;
        }
    });

    // Permitir busca ao pressionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `./search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
}

// Funcionalidade para carregar produtos na homepage
const loadHomepageProducts = async () => {
    // Verificar se estamos na página inicial
    if (window.location.pathname.endsWith('index.html') || 
        window.location.pathname === '/' || 
        window.location.pathname.endsWith('/')) {
        
        try {
            // Fazer requisição para buscar produtos ativos com estoque > 0
            const response = await fetch('http://localhost:3000/produto/homepage');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const produtos = await response.json();
            
            // Limpar grid de produtos atual
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid) {
                productsGrid.innerHTML = '';
                
                // Criar cards de produtos
                produtos.forEach(produto => {
                    const productCard = createProductCard(produto);
                    productsGrid.appendChild(productCard);
                });
                
                // Se não há produtos, mostrar mensagem
                if (produtos.length === 0) {
                    const noProductsMsg = document.createElement('div');
                    noProductsMsg.className = 'no-products-message';
                    noProductsMsg.innerHTML = `
                        <p>Nenhum produto disponível no momento.</p>
                        <p>Por favor, volte mais tarde!</p>
                    `;
                    productsGrid.appendChild(noProductsMsg);
                }
            }
            
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            
            // Mostrar mensagem de erro na página
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid) {
                productsGrid.innerHTML = `
                    <div class="error-message">
                        <p>Erro ao carregar produtos.</p>
                        <p>Por favor, tente novamente mais tarde.</p>
                    </div>
                `;
            }
        }
    }
};

// Função para criar card de produto
const createProductCard = (produto) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Verificar se há imagem, se não usar placeholder
    const imagemUrl = produto.imagem_url || 'https://via.placeholder.com/300x200?text=Produto+Sem+Imagem';
    
    // Verificar especificações e criar string legível
    let especificacoesTexto = '';
    if (produto.especificacoes && typeof produto.especificacoes === 'object') {
        especificacoesTexto = Object.entries(produto.especificacoes)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
    }
    
    // Verificar descrição
    const descricao = produto.descricao || especificacoesTexto || 'Produto de qualidade';
    
    // Preço formatado
    const preco = parseFloat(produto.preco).toFixed(2);
    
    // Estoque disponível
    const estoqueAtual = produto.estoqueProduto ? produto.estoqueProduto.quantidade_atual : 0;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${imagemUrl}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagem+não+disponível'">
        </div>
        <div class="product-info">
            <h3 class="product-name">${produto.nome}</h3>
            <p class="product-description">${descricao}</p>
            <div class="product-details">
                <span class="product-category">${produto.categoria}</span>
                <span class="product-price">R$ ${preco}</span>
            </div>
            <div class="product-stock">
                <span class="stock-info">Estoque: ${estoqueAtual} unidades</span>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${produto.codProduto})">
                <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    return card;
};

// Função para adicionar ao carrinho (será implementada posteriormente)
const addToCart = (productId) => {
    // Por enquanto, apenas um alert. Implementação completa do carrinho será feita depois
    alert(`Produto ${productId} adicionado ao carrinho!`);
};

// Carregar produtos quando a página for carregada
document.addEventListener('DOMContentLoaded', loadHomepageProducts);