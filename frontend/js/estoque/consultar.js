let estoqueDetails = document.getElementById("estoqueDetails")
let formConsultar = document.getElementById("consultarForm")

formConsultar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codEstoque = document.getElementById("codEstoque").value

    if (!codEstoque) {
        estoqueDetails.innerHTML = `<p style="color: red;">Por favor, insira o código do estoque.</p>`
        return
    }

    fetch(`http://localhost:3000/estoque/consultar/${codEstoque}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error("Estoque não encontrado.")
        }
        return resp.json()
    })
    .then((data) => {
        if (data.erro) {
            estoqueDetails.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        estoqueDetails.innerHTML = `
            <h3>Detalhes do Estoque</h3>
            <p><strong>Código do Estoque:</strong> ${data.codEstoque}</p>
            <p><strong>ID do Produto:</strong> ${data.idProduto}</p>
            <p><strong>Quantidade Atual:</strong> ${data.quantidade_atual}</p>
            <p><strong>Quantidade Mínima:</strong> ${data.quantidade_minima}</p>
        `
    })
    .catch((err) => {
        estoqueDetails.innerHTML = `<p style="color: red;">Erro ao consultar estoque: ${err.message}</p>`
        console.error("Erro ao consultar estoque: ", err)
    })
})