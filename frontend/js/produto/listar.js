let produtosList = document.getElementById("produtosList")

// Load products on page load
document.addEventListener("DOMContentLoaded", () => {
    listarProdutos()
    console.log("Página carregada e função lançada");
    
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
        if (data.erro) {
            produtosList.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        if (data.length === 0) {
            produtosList.innerHTML = "<p>Nenhum produto encontrado.</p>"
            return
        }

        let html = "<h3>Lista de Produtos</h3><ul>"
        data.forEach(produto => {
            html += `
                <li>
                    <strong>${produto.nome}</strong> - R$ ${produto.preco} - ${produto.categoria} - ${produto.ativo ? 'Ativo' : 'Inativo'}
                    <br>Descrição: ${produto.descricao || 'N/A'}
                    <br>Especificações: ${JSON.stringify(produto.especificacoes)}
                </li><hr>
            `
        })
        html += "</ul>"
        produtosList.innerHTML = html
    })
    .catch((err) => {
        produtosList.innerHTML = `<p style="color: red;">Erro ao carregar produtos: ${err.message}</p>`
        console.error("Erro ao listar produtos: ", err)
    })
}