let deleteResult = document.getElementById("deleteResult")
let formDeletar = document.getElementById("deletarForm")

formDeletar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codPedido = document.getElementById("codPedido").value

    if (!codPedido) {
        deleteResult.innerHTML = `<p style="color: red;">Por favor, insira o código do pedido.</p>`
        return
    }

    if (!confirm("Tem certeza que deseja deletar este pedido?")) {
        return
    }

    fetch(`http://localhost:3000/pedido/deletar/${codPedido}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Erro ao deletar pedido.")
            }
            return resp.json()
        })
        .then((data) => {
            if (data.erro) {
                deleteResult.innerHTML = `<p style="color: red;">${data.erro}</p>`
                return
            }

            deleteResult.innerHTML = `<p style="color: green;">${data.message || "Pedido deletado com sucesso!"}</p>`
        })
        .catch((err) => {
            deleteResult.innerHTML = `<p style="color: red;">Erro ao deletar pedido: ${err.message}</p>`
            console.error("Erro ao deletar pedido: ", err)
        })
})