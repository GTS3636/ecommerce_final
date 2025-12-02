// Load products on page load
document.addEventListener("DOMContentLoaded", () => {
    listarProdutos()
    console.log("Página carregada e função lançada")
})

function listarProdutos() {
    fetch("http://localhost:3000/produto/listar", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Erro na requisição.")
            }
            return resp.json()
        })
        .then((data) => {
            if (data.error) {
                produtosList.innerHTML = `<p style="color: red;">${data.error}</p>`
                return
            }

            if (data.length === 0) {
                produtosList.innerHTML = "<p>Nenhum produto encontrado.</p>"
                return
            }

            let html = `
            <h3>Lista de Produtos</h3>
            <table class="products-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Categoria</th>
                        <th>Status</th>
                        <th>Descrição</th>
                        <th>Especificações</th>
                    </tr>
                </thead>
                <tbody>
        `
            data.forEach(produto => {
                html += `
                <tr>
                    <td><strong>${produto.nome}</strong></td>
                    <td>R$ ${produto.preco}</td>
                    <td>${produto.categoria}</td>
                    <td><span class="status ${produto.ativo ? 'ativo' : 'inativo'}">${produto.ativo ? 'Ativo' : 'Inativo'}</span></td>
                    <td>${produto.descricao || 'N/A'}</td>
                    <td>${JSON.stringify(produto.especificacoes)}</td>
                </tr>
            `
            })
            html += `
                </tbody>
            </table>
        `
            produtosList.innerHTML = html
        })
        .catch((err) => {
            produtosList.innerHTML = `<p style="color: red;">Erro ao carregar produtos: ${err.message}</p>`
            console.error("Erro ao listar produtos: ", err)
        })
}