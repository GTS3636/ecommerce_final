let estoqueList = document.getElementById("estoqueList")

// Load stock on page load
window.addEventListener("load", () => {
    listarEstoques()
})

function listarEstoques() {
    fetch("http://localhost:3000/estoque/listar", {
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
            estoqueList.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        if (data.length === 0) {
            estoqueList.innerHTML = "<p>Nenhum estoque encontrado.</p>"
            return
        }

        let html = "<h3>Lista de Estoques</h3><ul>"
        data.forEach(estoque => {
            html += `
                <li>
                    <strong>Estoque ${estoque.codEstoque}</strong> - Produto ${estoque.idProduto}
                    <br>Quantidade Atual: ${estoque.quantidade_atual}
                    <br>Quantidade Mínima: ${estoque.quantidade_minima}
                </li><hr>
            `
        })
        html += "</ul>"
        estoqueList.innerHTML = html
    })
    .catch((err) => {
        estoqueList.innerHTML = `<p style="color: red;">Erro ao carregar estoques: ${err.message}</p>`
        console.error("Erro ao listar estoques: ", err)
    })
}