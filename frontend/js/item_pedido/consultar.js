let itemPedidoDetails = document.getElementById("itemPedidoDetails")
let formConsultar = document.getElementById("consultarForm")

formConsultar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codItemPedido = document.getElementById("codItemPedido").value

    if (!codItemPedido) {
        itemPedidoDetails.innerHTML = `<p style="color: red;">Por favor, insira o código do item de pedido.</p>`
        return
    }

    fetch(`http://localhost:3000/item_pedido/consultar/${codItemPedido}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Item de pedido não encontrado.")
            }
            return resp.json()
        })
        .then((data) => {
            if (data.erro) {
                itemPedidoDetails.innerHTML = `<p style="color: red;">${data.erro}</p>`
                return
            }

            itemPedidoDetails.innerHTML = `
            <h3>Detalhes do Item de Pedido</h3>
            <p><strong>Código do Item:</strong> ${data.codItemPedido}</p>
            <p><strong>Código do Pedido:</strong> ${data.codPedido}</p>
            <p><strong>Código do Produto:</strong> ${data.codProduto}</p>
            <p><strong>Quantidade:</strong> ${data.quantidade}</p>
            <p><strong>Preço Unitário:</strong> R$ ${data.preco_unitario}</p>
        `
        })
        .catch((err) => {
            itemPedidoDetails.innerHTML = `<p style="color: red;">Erro ao consultar item de pedido: ${err.message}</p>`
            console.error("Erro ao consultar item de pedido: ", err)
        })
})
