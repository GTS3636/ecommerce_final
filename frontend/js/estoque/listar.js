let estoqueList = document.getElementById("estoqueList")

// Load stock on page load
document.addEventListener("DOMContentLoaded", () => {
    listarEstoques()
    console.log("Página carregada e função lançada")
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
            if (data.error) {
                estoqueList.innerHTML = `<p style="color: red;">${data.error}</p>`
                return
            }

            if (data.length === 0) {
                estoqueList.innerHTML = "<p>Nenhum estoque encontrado.</p>"
                return
            }

            let html = `
            <h3>Lista de Estoques</h3>
            <table class="products-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Produto ID</th>
                        <th>Quantidade Atual</th>
                        <th>Quantidade Mínima</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `
            data.forEach(estoque => {
                const status = estoque.quantidade_atual >= estoque.quantidade_minima ? 'suficiente' : 'baixo'
                html += `
                <tr>
                    <td><strong>${estoque.codEstoque}</strong></td>
                    <td>${estoque.idProduto}</td>
                    <td>${estoque.quantidade_atual}</td>
                    <td>${estoque.quantidade_minima}</td>
                    <td><span class="status ${status}">${status === 'suficiente' ? 'Suficiente' : 'Baixo Estoque'}</span></td>
                </tr>
            `
            })
            html += `
                </tbody>
            </table>
        `
            estoqueList.innerHTML = html
        })
        .catch((err) => {
            estoqueList.innerHTML = `<p style="color: red;">Erro ao carregar estoques: ${err.message}</p>`
            console.error("Erro ao listar estoques: ", err)
        })
}