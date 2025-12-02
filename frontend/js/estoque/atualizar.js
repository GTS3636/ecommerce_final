let res = document.getElementById("res")
let formAtualizar = document.getElementById("atualizarForm")

formAtualizar.addEventListener("submit", (e)=>{
    e.preventDefault()

    let idProduto = document.getElementById("idProduto").value
    let quantidade_atual = Number(document.getElementById("quantidade_atual").value)
    let quantidade_minima = Number(document.getElementById("quantidade_minima").value)

    if(!idProduto){
        return alert("Por favor, insira o código do produto para sabermos quem irá sofrer as alterações!")
    }

    if(!quantidade_atual && !quantidade_minima){
        return alert("Por favor, ao menos um campo deve ser alterado para ocorrer a atualização!")
    }

    let valores = {}

    if(quantidade_minima == 0){
        valores = {
            codEstoque: idProduto,
            quantidade_atual: quantidade_atual
        }
    } else {
        valores = {
            codEstoque: idProduto,
            quantidade_atual: quantidade_atual,
            quantidade_minima: quantidade_minima
        }
    }
    
    fetch("http://localhost:3000/estoque/atualizar", {
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
            <h3>Estoque atualizado com sucesso!</h3>
            <p><strong>ID do Produto:</strong> ${data.idProduto}</p>
            <p><strong>Quantidade Atual:</strong> ${data.quantidade_atual}</p>
            <p><strong>Quantidade Mínima:</strong> ${data.quantidade_minima}</p>
        `
    })
    .catch((err)=>{
        res.innerHTML = `Ocorreu um erro ao atualizar o estoque, tente novamente mais tarde.`
        console.error("Ocorreu um erro ao atualizar o estoque: ", err)
    })
})