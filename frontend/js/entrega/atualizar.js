let res = document.getElementById("res")
let formAtualizar = document.getElementById("atualizarForm")

formAtualizar.addEventListener("submit", (e)=>{
    e.preventDefault()

    let codEntrega = document.getElementById("codEntrega").value
    let idPedido = document.getElementById("idPedido").value
    let cep = document.getElementById("cep").value
    let logradouro = document.getElementById("logradouro").value
    let complemento = document.getElementById("complemento").value
    let bairro = document.getElementById("bairro").value
    let localidade = document.getElementById("localidade").value
    let uf = document.getElementById("uf").value
    let numero = document.getElementById("numero").value
    let dataEstimada = document.getElementById("dataEstimada").value
    let codigoRastreio = document.getElementById("codigoRastreio").value
    let statusEntrega = document.getElementById("statusEntrega").value

    if(!codEntrega || !idPedido){
        return alert("Por favor, insira o código da entrega e/ou do pedido para sabermos quem irá sofrer as alterações!")
    }

    if(!cep && !logradouro && !complemento && !bairro && !localidade && !uf && !numero && !dataEstimada && !codigoRastreio && !statusEntrega){
        return alert("Por favor, ao menos um campo deve ser alterado para ocorrer a atualização!")
    }

    let valores = {
        codEntrega: codEntrega,
        idPedido: idPedido,
        cep: cep,
        logradouro: logradouro,
        complemento: complemento,
        bairro: bairro,
        localidade: localidade,
        uf: uf,
        numero: numero,
        dataEstimada: dataEstimada,
        codigoRastreio: codigoRastreio,
        statusEntrega: statusEntrega
    }

    fetch("http://localhost:3000/entrega/atualizar", {
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
            <h3>Entrega atualizada com sucesso!</h3>
            <p><strong>Código da Entrega:</strong> ${data.codEntrega}</p>
            <p><strong>ID do Pedido:</strong> ${data.idPedido}</p>
            <p><strong>CEP:</strong> ${data.cep}</p>
            <p><strong>Logradouro:</strong> ${data.logradouro}</p>
            <p><strong>Status:</strong> ${data.statusEntrega}</p>
        `
    })
    .catch((err)=>{
        res.innerHTML = `Ocorreu um erro ao atualizar a entrega, tente novamente mais tarde.`
        console.error("Ocorreu um erro ao atualizar a entrega: ", err)
    })
})