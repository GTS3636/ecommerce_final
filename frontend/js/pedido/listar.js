let pedidosList = document.getElementById("pedidosList")

// Load orders on page load
window.addEventListener("load", () => {
    listarPedidos()
})

function listarPedidos() {
    fetch("http://localhost:3000/pedido/listar", {
        method: "GET",
        headers: {
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
            pedidosList.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        if (data.length === 0) {
            pedidosList.innerHTML = "<p>Nenhum pedido encontrado.</p>"
            return
        }

        let html = "<h3>Lista de Pedidos</h3><ul>"
        data.forEach(pedido => {
            html += `
                <li>
                    <strong>Pedido ${pedido.codPedido}</strong> - Usuário ${pedido.idUsuario} - ${pedido.status}
                    <br>Valor Total: R$ ${pedido.valorTotal}
                </li><hr>
            `
        })
        html += "</ul>"
        pedidosList.innerHTML = html
    })
    .catch((err) => {
        pedidosList.innerHTML = `<p style="color: red;">Erro ao carregar pedidos: ${err.message}</p>`
        console.error("Erro ao listar pedidos: ", err)
    })
}