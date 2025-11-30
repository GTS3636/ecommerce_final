let res = document.getElementById("res")
let formAtualizar = document.getElementById("atualizarForm")

formAtualizar.addEventListener("submit", (e)=>{
    e.preventDefault()

    let codPedido = document.getElementById("codPedido").value
    let idUsuario = document.getElementById("idUsuario").value
    let status = document.getElementById("status").value
    let valorSubtotal = document.getElementById("valorSubtotal").value
    let valorFrete = document.getElementById("valorFrete").value
    let valorTotal = document.getElementById("valorTotal").value

    if(!codPedido || !idUsuario){
        return alert("Por favor, insira o código do usuário e/ou pedido para sabermos quem irá sofrer as alterações!")
    }

    if(!status && !valorSubtotal && !valorFrete && !valorTotal){
        return alert("Por favor, ao menos um campo deve ser alterado para ocorrer a atualização!")
    }

    let valores = {
        codPedido: codPedido,
        idUsuario: idUsuario,
        status: status,
        valorSubtotal: valorSubtotal,
        valorFrete: valorFrete,
        valorTotal: valorTotal
    }

    fetch("http://localhost:3000/pedido/atualizar", {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body: JSON.stringify(valores)
    })
    .then(resp=>{
        if(!resp.ok){
            throw new Error("Erro na requisição.")
        }
        return resp.json()
    })
    .then((data)=>{
        if(data.erro){
            res.style.color = "red"
            return res.innerHTML = `${data.erro}`
        }

        res.style.color = "green"
        res.innerHTML = `
            <h3>Pedido atualizado com sucesso!</h3>
            <p><strong>Código do Pedido:</strong> ${data.codPedido}</p>
            <p><strong>ID do Usuário:</strong> ${data.idUsuario}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Valor Subtotal:</strong> R$ ${data.valorSubtotal}</p>
            <p><strong>Valor Frete:</strong> R$ ${data.valorFrete}</p>
            <p><strong>Valor Total:</strong> R$ ${data.valorTotal}</p>
        `
    })
    .catch((err)=>{
        res.innerHTML = `Ocorreu um erro ao atualizar o pedido, tente novamente mais tarde.`
        console.error("Ocorreu um erro ao atualizar o pedido: ", err)
    })
})