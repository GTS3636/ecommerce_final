let itemPedidosList = document.getElementById("itemPedidosList")

// Load items on page load
document.addEventListener("DOMContentLoaded", () => {
    listarItemPedidos()
    console.log("Página carregada e função lançada")
})

function listarItemPedidos() {
    fetch("http://localhost:3000/itemPedido/listar", {
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
                itemPedidosList.innerHTML = `<p style="color: red;">${data.error}</p>`
                return
            }

            if (data.length === 0) {
                itemPedidosList.innerHTML = "<p>Nenhum item de pedido encontrado.</p>"
                return
            }

            let html = `
            <h3>Lista de Itens de Pedido</h3>
            <table class="products-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Pedido ID</th>
                        <th>Produto ID</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
        `
            data.forEach(item => {
                html += `
                <tr>
                    <td><strong>${item.codItemPedido}</strong></td>
                    <td>${item.idPedido}</td>
                    <td>${item.idProduto}</td>
                    <td>${item.quantidade}</td>
                    <td>R$ ${item.precoUnitario}</td>
                    <td>R$ ${item.valorTotalItem}</td>
                </tr>
            `
            })
            html += `
                </tbody>
            </table>
        `
            itemPedidosList.innerHTML = html
        })
        .catch((err) => {
            itemPedidosList.innerHTML = `<p style="color: red;">Erro ao carregar itens de pedido: ${err.message}</p>`
            console.error("Erro ao listar itens de pedido: ", err)
        })
}
