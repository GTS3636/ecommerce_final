let deleteResult = document.getElementById("deleteResult")
let formDeletar = document.getElementById("deletarForm")

formDeletar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codItemPedido = document.getElementById("codItemPedido").value

    if (!codItemPedido) {
        deleteResult.innerHTML = `<p style="color: red;">Por favor, insira o código do item de pedido.</p>`
        return
    }

    if (!confirm("Tem certeza que deseja deletar este item de pedido?")) {
        return
    }

    fetch(`http://localhost:3000/item_pedido/deletar/${codItemPedido}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Erro ao deletar item de pedido.")
            }
            return resp.json()
        })
        .then((data) => {
            if (data.erro) {
                deleteResult.innerHTML = `<p style="color: red;">${data.erro}</p>`
                return
            }

            deleteResult.innerHTML = `<p style="color: green;">${data.message || "Item de pedido deletado com sucesso!"}</p>`
        })
        .catch((err) => {
            deleteResult.innerHTML = `<p style="color: red;">Erro ao deletar item de pedido: ${err.message}</p>`
            console.error("Erro ao deletar item de pedido: ", err)
        })
})
