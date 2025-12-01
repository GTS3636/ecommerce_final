let itemPedidosList = document.getElementById("itemPedidosList")

// Load items on page load
document.addEventListener("DOMContentLoaded", () => {
    listarItemPedidos()
    console.log("Página carregada e função lançada");

})

function listarItemPedidos() {
    fetch("http://localhost:3000/item_pedido/listar", {
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
                itemPedidosList.innerHTML = `<p style="color: red;">${data.erro}</p>`
                return
            }

            if (data.length === 0) {
                itemPedidosList.innerHTML = "<p>Nenhum item de pedido encontrado.</p>"
                return
            }

            let html = "<h3>Lista de Itens de Pedido</h3><ul>"
            data.forEach(item => {
                html += `
                <li>
                    <strong>Item ID: ${item.codItemPedido}</strong>
                    <br>Pedido: ${item.codPedido}
                    <br>Produto: ${item.codProduto}
                    <br>Quantidade: ${item.quantidade}
                    <br>Preço Unitário: R$ ${item.preco_unitario}
                </li><hr>
            `
            })
            html += "</ul>"
            itemPedidosList.innerHTML = html
        })
        .catch((err) => {
            itemPedidosList.innerHTML = `<p style="color: red;">Erro ao carregar itens de pedido: ${err.message}</p>`
            console.error("Erro ao listar itens de pedido: ", err)
        })
}
