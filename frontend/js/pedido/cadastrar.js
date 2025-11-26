let res = document.getElementById("res")
let formCadastrar = document.getElementById("cadastrarForm")

formCadastrar.addEventListener("submit", (e)=>{
    e.preventDefault()

    let idUsuario = document.getElementById("idUsuario").value
    let status = document.getElementById("status").value
    let valorSubtotal = document.getElementById("valorSubtotal").value
    let valorFrete = document.getElementById("valorFrete").value
    let valorTotal = document.getElementById("valorTotal").value

    let valores = {
        idUsuario: idUsuario,
        status: status,
        valorSubtotal: valorSubtotal,
        valorFrete: valorFrete,
        valorTotal: valorTotal
    }

    fetch("http://localhost:3000/pedido/cadastrar", {
        method: "POST",
        headers: {
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
            <h3>Pedido cadastrado com sucesso!</h3>
            <p><strong>Código do Pedido:</strong> ${data.codPedido}</p>
            <p><strong>ID do Usuário:</strong> ${data.idUsuario}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Valor Subtotal:</strong> R$ ${data.valorSubtotal}</p>
            <p><strong>Valor Frete:</strong> R$ ${data.valorFrete}</p>
            <p><strong>Valor Total:</strong> R$ ${data.valorTotal}</p>
        `
    })
    .catch((err)=>{
        res.innerHTML = `Ocorreu um erro ao cadastrar o pedido, tente novamente mais tarde.`
        console.error("Ocorreu um erro ao cadastrar o pedido: ", err)
    })
})