let entregasList = document.getElementById("entregasList")

// Load deliveries on page load
window.addEventListener("load", () => {
    listarEntregas()
})

function listarEntregas() {
    fetch("http://localhost:3000/entrega/listar", {
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
            entregasList.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        if (data.length === 0) {
            entregasList.innerHTML = "<p>Nenhuma entrega encontrada.</p>"
            return
        }

        let html = "<h3>Lista de Entregas</h3><ul>"
        data.forEach(entrega => {
            html += `
                <li>
                    <strong>Entrega ${entrega.codEntrega}</strong> - Pedido ${entrega.idPedido} - ${entrega.statusEntrega}
                    <br>CEP: ${entrega.cep} - ${entrega.logradouro}, ${entrega.numero}
                    <br>Data Estimada: ${entrega.dataEstimada || 'N/A'}
                </li><hr>
            `
        })
        html += "</ul>"
        entregasList.innerHTML = html
    })
    .catch((err) => {
        entregasList.innerHTML = `<p style="color: red;">Erro ao carregar entregas: ${err.message}</p>`
        console.error("Erro ao listar entregas: ", err)
    })
}