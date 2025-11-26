let res = document.getElementById("res")
let formAtualizar = document.getElementById("atualizarForm")

formAtualizar.addEventListener("submit", (e)=>{
    e.preventDefault()

    let codProduto = document.getElementById("codProduto").value
    let nome = document.getElementById("nome").value
    let preco = document.getElementById("preco").value
    let imagem_url = document.getElementById("imagem_url").value
    let ativo = document.getElementById("ativo").checked
    let categoria = document.getElementById("categoria").value
    let descricao = document.getElementById("descricao").value
    let especificacoes = document.getElementById("especificacoes").value
    let quantidade_minima = document.getElementById("quantidade_minima").value

    console.log(especificacoes);


    if (especificacoes == '{"key":"value"}'){
        return alert("As especificações precisam ser alteradas!")
    }

    let valores = {
        codProduto: codProduto,
        nome: nome,
        preco: preco,
        imagem_url: imagem_url,
        categoria: categoria,
        ativo: ativo,
        descricao: descricao,
        especificacoes: especificacoes,
        quantidade_minima: quantidade_minima
    }

    fetch("http://localhost:3000/produto/atualizar", {
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(valores)
    })
    .then(resp=>{
        if(!resp){
            throw new Error("Ocorreu um erro ao pegar a requisição.")
        }
        return resp.json()
    })
    .then((data)=>{
        console.log(data);
        if(data.erro){
            res.style.color = "red"
            return res.innerHTML = `${data.erro}`
        }

        res.style.color = "green"
        res.innerHTML = `
            <h3>Produto atualizado com sucesso!</h3>
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
    .catch((err)=>{
        res.innerHTML = `Ocorreu um erro ao atualizar o produto, tente novamente mais tarde.`
        console.error("Ocorreu um erro ao atualizar o produto: ", err)
    })
})