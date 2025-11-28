let deleteResult = document.getElementById("deleteResult")
let formDeletar = document.getElementById("deletarForm")

formDeletar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codProduto = document.getElementById("codProduto").value

    if (!codProduto) {
        deleteResult.innerHTML = `<p style="color: red;">Por favor, insira o código do produto.</p>`
        return
    }

    if (!confirm("Tem certeza que deseja deletar este produto?")) {
        return
    }

    fetch(`http://localhost:3000/produto/deletar/${codProduto}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error("Erro ao deletar produto.")
        }
        return resp.json()
    })
    .then((data) => {
        if (data.erro) {
            deleteResult.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        deleteResult.innerHTML = `<p style="color: green;">${data.message || "Produto deletado com sucesso!"}</p>`
    })
    .catch((err) => {
        deleteResult.innerHTML = `<p style="color: red;">Erro ao deletar produto: ${err.message}</p>`
        console.error("Erro ao deletar produto: ", err)
    })
})