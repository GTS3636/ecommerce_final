let res = document.getElementById("res")
let formCadastrar = document.getElementById("cadastrarForm")

formCadastrar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codPedido = document.getElementById("codPedido").value
    let codProduto = document.getElementById("codProduto").value
    let quantidade = document.getElementById("quantidade").value
    let preco_unitario = document.getElementById("preco_unitario").value

    let valores = {
        codPedido: codPedido,
        codProduto: codProduto,
        quantidade: quantidade,
        preco_unitario: preco_unitario
    }

    fetch("http://localhost:3000/item_pedido/cadastrar", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(valores)
    })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Ocorreu um erro ao pegar a requisição.")
            }
            return resp.json()
        })
        .then((data) => {
            console.log(data)
            if (data.error) {
                res.style.color = "red"
                return res.innerHTML = `${data.error}`
            }

            res.style.color = "green"
            res.innerHTML = `
            <h3>Item de Pedido cadastrado com sucesso!</h3>
            <p><strong>Código do Pedido:</strong> ${data.codPedido}</p>
            <p><strong>Código do Produto:</strong> ${data.codProduto}</p>
            <p><strong>Quantidade:</strong> ${data.quantidade}</p>
            <p><strong>Preço Unitário:</strong> R$ ${data.preco_unitario}</p>
        `
        })
        .catch((err) => {
            res.style.color = "red"
            res.innerHTML = `Ocorreu um erro ao fazer o cadastro do item de pedido, tente novamente mais tarde.`
            console.error("Ocorreu um erro ao cadastrar o item de pedido: ", err)
        })
})
