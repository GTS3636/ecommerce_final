let pedidoDetails = document.getElementById("pedidoDetails")
let formConsultar = document.getElementById("consultarForm")

formConsultar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codPedido = document.getElementById("codPedido").value

    if (!codPedido) {
        pedidoDetails.innerHTML = `<p style="color: red;">Por favor, insira o código do pedido.</p>`
        return
    }

    fetch(`http://localhost:3000/pedido/consultar/${codPedido}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error("Pedido não encontrado.")
        }
        return resp.json()
    })
    .then((data) => {
        if (data.erro) {
            pedidoDetails.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        pedidoDetails.innerHTML = `
            <h3>Detalhes do Pedido</h3>
            <p><strong>Código do Pedido:</strong> ${data.codPedido}</p>
            <p><strong>ID do Usuário:</strong> ${data.idUsuario}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Valor Subtotal:</strong> R$ ${data.valorSubtotal}</p>
            <p><strong>Valor Frete:</strong> R$ ${data.valorFrete}</p>
            <p><strong>Valor Total:</strong> R$ ${data.valorTotal}</p>
        `
    })
    .catch((err) => {
        pedidoDetails.innerHTML = `<p style="color: red;">Erro ao consultar pedido: ${err.message}</p>`
        console.error("Erro ao consultar pedido: ", err)
    })
})