let pedidosList = document.getElementById("pedidosList")

// Load orders on page load
document.addEventListener("DOMContentLoaded", () => {
    listarPedidos()
    console.log("Página carregada e função lançada")
})

function listarPedidos() {
    fetch("http://localhost:3000/pedido/listar", {
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
                pedidosList.innerHTML = `<p style="color: red;">${data.error}</p>`
                return
            }

            if (data.length === 0) {
                pedidosList.innerHTML = "<p>Nenhum pedido encontrado.</p>"
                return
            }

            let html = `
            <h3>Lista de Pedidos</h3>
            <table class="products-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Usuário ID</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Subtotal</th>
                        <th>Frete</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `
            data.forEach(pedido => {
                const dataFormatada = new Date(pedido.dataPedido).toLocaleDateString('pt-BR')
                html += `
                <tr>
                    <td><strong>${pedido.codPedido}</strong></td>
                    <td>${pedido.idUsuario}</td>
                    <td>${dataFormatada}</td>
                    <td><span class="status ${pedido.status.toLowerCase().replace('_', '-')}">${pedido.status.replace('_', ' ')}</span></td>
                    <td>R$ ${pedido.valorSubtotal}</td>
                    <td>R$ ${pedido.valorFrete}</td>
                    <td>R$ ${pedido.valorTotal}</td>
                </tr>
            `
            })
            html += `
                </tbody>
            </table>
        `
            pedidosList.innerHTML = html
        })
        .catch((err) => {
            pedidosList.innerHTML = `<p style="color: red;">Erro ao carregar pedidos: ${err.message}</p>`
            console.error("Erro ao listar pedidos: ", err)
        })
}