let produtoDetails = document.getElementById("produtoDetails")
let formConsultar = document.getElementById("consultarForm")

formConsultar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codProduto = document.getElementById("codProduto").value

    if (!codProduto) {
        produtoDetails.innerHTML = `<p style="color: red;">Por favor, insira o código do produto.</p>`
        return
    }

    fetch(`http://localhost:3000/produto/consultar/${codProduto}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error("Produto não encontrado.")
        }
        return resp.json()
    })
    .then((data) => {
        if (data.erro) {
            produtoDetails.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        produtoDetails.innerHTML = `
            <h3>Detalhes do Produto</h3>
            <p><strong>Código:</strong> ${data.codProduto}</p>
            <p><strong>Nome:</strong> ${data.nome}</p>
            <p><strong>Preço:</strong> R$ ${data.preco}</p>
            <p><strong>Categoria:</strong> ${data.categoria}</p>
            <p><strong>Ativo:</strong> ${data.ativo ? 'Sim' : 'Não'}</p>
            <p><strong>Descrição:</strong> ${data.descricao || 'N/A'}</p>
            <p><strong>Especificações:</strong> ${JSON.stringify(data.especificacoes)}</p>
            <p><strong>Imagem URL:</strong> ${data.imagem_url || 'N/A'}</p>
        `
    })
    .catch((err) => {
        produtoDetails.innerHTML = `<p style="color: red;">Erro ao consultar produto: ${err.message}</p>`
        console.error("Erro ao consultar produto: ", err)
    })
})