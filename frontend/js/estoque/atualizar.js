let res = document.getElementById("res")
let formAtualizar = document.getElementById("atualizarForm")

formAtualizar.addEventListener("submit", (e)=>{
    e.preventDefault()

    let idProduto = document.getElementById("idProduto").value
    let quantidade_atual = document.getElementById("quantidade_atual").value
    let quantidade_minima = document.getElementById("quantidade_minima").value

    let valores = {
        idProduto: idProduto,
        quantidade_atual: quantidade_atual,
        quantidade_minima: quantidade_minima
    }

    fetch("http://localhost:3000/estoque/atualizar", {
        method: "PUT",
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