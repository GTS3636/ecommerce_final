let entregaDetails = document.getElementById("entregaDetails")
let formConsultar = document.getElementById("consultarForm")

formConsultar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codEntrega = document.getElementById("codEntrega").value

    if (!codEntrega) {
        entregaDetails.innerHTML = `<p style="color: red;">Por favor, insira o código da entrega.</p>`
        return
    }

    fetch(`http://localhost:3000/entrega/consultar/${codEntrega}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error("Entrega não encontrada.")
        }
        return resp.json()
    })
    .then((data) => {
        if (data.erro) {
            entregaDetails.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        entregaDetails.innerHTML = `
            <h3>Detalhes da Entrega</h3>
            <p><strong>Código da Entrega:</strong> ${data.codEntrega}</p>
            <p><strong>ID do Pedido:</strong> ${data.idPedido}</p>
            <p><strong>CEP:</strong> ${data.cep}</p>
            <p><strong>Logradouro:</strong> ${data.logradouro}</p>
            <p><strong>Complemento:</strong> ${data.complemento || 'N/A'}</p>
            <p><strong>Bairro:</strong> ${data.bairro}</p>
            <p><strong>Localidade:</strong> ${data.localidade}</p>
            <p><strong>UF:</strong> ${data.uf}</p>
            <p><strong>Número:</strong> ${data.numero}</p>
            <p><strong>Data Estimada:</strong> ${data.dataEstimada || 'N/A'}</p>
            <p><strong>Código de Rastreio:</strong> ${data.codigoRastreio || 'N/A'}</p>
            <p><strong>Status da Entrega:</strong> ${data.statusEntrega}</p>
        `
    })
    .catch((err) => {
        entregaDetails.innerHTML = `<p style="color: red;">Erro ao consultar entrega: ${err.message}</p>`
        console.error("Erro ao consultar entrega: ", err)
    })
})