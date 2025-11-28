let res = document.getElementById("res")
let formCadastrar = document.getElementById("cadastrarForm")

formCadastrar.addEventListener("submit", (e)=>{
    e.preventDefault()

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

    let valores = {
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

    fetch("http://localhost:3000/entrega/cadastrar", {
        method: "POST",
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
            <h3>Entrega cadastrada com sucesso!</h3>
            <p><strong>ID da Entrega:</strong> ${data.codEntrega}</p>
            <p><strong>ID do Pedido:</strong> ${data.idPedido}</p>
            <p><strong>CEP:</strong> ${data.cep}</p>
            <p><strong>Logradouro:</strong> ${data.logradouro}</p>
            <p><strong>Status:</strong> ${data.statusEntrega}</p>
        `
    })
    .catch((err)=>{
        res.innerHTML = `Ocorreu um erro ao cadastrar a entrega, tente novamente mais tarde.`
        console.error("Ocorreu um erro ao cadastrar a entrega: ", err)
    })
})