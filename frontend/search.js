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