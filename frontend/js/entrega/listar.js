let entregasList = document.getElementById("entregasList")

// Load deliveries on page load
document.addEventListener("DOMContentLoaded", () => {
    listarEntregas()
    console.log("Página carregada e função lançada")
})

function listarEntregas() {
    fetch("http://localhost:3000/entrega/listar", {
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
                entregasList.innerHTML = `<p style="color: red;">${data.error}</p>`
                return
            }

            if (data.length === 0) {
                entregasList.innerHTML = "<p>Nenhuma entrega encontrada.</p>"
                return
            }

            let html = `
            <h3>Lista de Entregas</h3>
            <table class="products-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Pedido ID</th>
                        <th>CEP</th>
                        <th>Endereço</th>
                        <th>Status</th>
                        <th>Data Estimada</th>
                    </tr>
                </thead>
                <tbody>
        `
            data.forEach(entrega => {
                html += `
                <tr>
                    <td><strong>${entrega.codEntrega}</strong></td>
                    <td>${entrega.idPedido}</td>
                    <td>${entrega.cep}</td>
                    <td>${entrega.logradouro}, ${entrega.numero} - ${entrega.bairro}</td>
                    <td><span class="status ${entrega.statusEntrega.toLowerCase().replace('_', '-')}">${entrega.statusEntrega.replace('_', ' ')}</span></td>
                    <td>${entrega.dataEstimada || 'N/A'}</td>
                </tr>
            `
            })
            html += `
                </tbody>
            </table>
        `
            entregasList.innerHTML = html
        })
        .catch((err) => {
            entregasList.innerHTML = `<p style="color: red;">Erro ao carregar entregas: ${err.message}</p>`
            console.error("Erro ao listar entregas: ", err)
        })
}