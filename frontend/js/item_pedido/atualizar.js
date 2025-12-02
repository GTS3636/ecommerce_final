let res = document.getElementById("res")
let formAtualizar = document.getElementById("atualizarForm")

formAtualizar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codItemPedido = document.getElementById("codItemPedido").value
    let codPedido = document.getElementById("codPedido").value
    let codProduto = document.getElementById("codProduto").value
    let quantidade = document.getElementById("quantidade").value
    let preco_unitario = document.getElementById("preco_unitario").value

    if (!codItemPedido) {
        return alert("Por favor, insira o código do item de pedido para sabermos quem irá sofrer as alterações!")
    }

    if (!codPedido && !codProduto && !quantidade && !preco_unitario) {
        return alert("Por favor, ao menos um campo deve ser alterado para ocorrer a atualização!")
    }

    let valores = {
        codItemPedido: codItemPedido,
        codPedido: codPedido,
        codProduto: codProduto,
        quantidade: quantidade,
        precoUnitario: preco_unitario
    }
    
    // Filtra campos não preenchidos
    Object.keys(valores).forEach((key) => {
        if (valores[key] === "") {
            delete valores[key];
        }
    })


    fetch("http://localhost:3000/itemPedido/atualizar", {
        method: "PUT",
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
            console.log(data);
            if (data.erro) {
                res.style.color = "red"
                return res.innerHTML = `${data.erro}`
            }

            res.style.color = "green"
            res.innerHTML = `
            <h3>Item de Pedido atualizado com sucesso!</h3>
            <p><strong>Código do Item:</strong> ${data.codItemPedido}</p>
            <p><strong>Código do Pedido:</strong> ${data.idPedido}</p>
            <p><strong>Código do Produto:</strong> ${data.idProduto}</p>
            <p><strong>Quantidade:</strong> ${data.quantidade}</p>
            <p><strong>Preço Unitário:</strong> R$ ${data.precoUnitario}</p>
            <p><strong>Valor total:</strong> R$ ${data.valorTotalItem}</p>
        `
        })
        .catch((err) => {
            res.innerHTML = `Ocorreu um erro ao atualizar o item de pedido, tente novamente mais tarde.`
            console.error("Ocorreu um erro ao atualizar o item de pedido: ", err)
        })
})
