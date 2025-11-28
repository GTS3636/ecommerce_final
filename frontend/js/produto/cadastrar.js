let res = document.getElementById("res")
let formCadastrar = document.getElementById("cadastrarForm")

formCadastrar.addEventListener("submit", (e)=>{
    e.preventDefault()

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
        nome: nome,
        preco: preco,
        imagem_url: imagem_url,
        categoria: categoria,
        ativo: ativo,
        descricao: descricao,
        especificacoes: especificacoes,
        quantidade_minima: quantidade_minima
    }

    fetch("http://localhost:4000/produto/cadastrar", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body: JSON.stringify(valores)
    })
    .then(resp=>{
        if(!resp.ok){
            throw new Error("Ocorreu um erro ao pegar a requisição.")
        }
        return resp.json()
    })
    .then((data)=>{
        console.log(data)
        let produto = data.produto.produto
        let estoque = data.estoque.estoque
        if(data.error){
            res.style.color = "red"
            return res.innerHTML = `${data.error}`
        }

        res.style.color = "green"
        res.innerHTML = `
            <h3>Produto cadastrado com sucesso!</h3>
            <p><strong>Nome:</strong> ${produto.nome}</p>
            <p><strong>Preço:</strong> R$ ${produto.preco}</p>
            <p><strong>Categoria:</strong> ${produto.categoria}</p>
            <p><strong>Ativo:</strong> ${produto.ativo ? 'Sim' : 'Não'}</p>
            <p><strong>Descrição:</strong> ${produto.descricao || 'N/A'}</p>
            <p><strong>Especificações:</strong> ${JSON.stringify(produto.especificacoes)}</p>
            <p><strong>Imagem URL:</strong> ${produto.imagem_url || 'N/A'}</p>
            <h4>Estoque:</h4>
            <p><strong>Quantidade Mínima:</strong> ${estoque.quantidade_minima}</p>
            <p><strong>Quantidade Atual:</strong> ${estoque.quantidade_atual}</p>
        `
    })
    .catch((err)=>{
        res.style.color = "red"
        res.innerHTML = `Ocorreu um erro ao fazer o cadastro do produto, tente novamente mais tarde.`
        console.error("Ocorreu um erro ao cadastrar o produto: ", err)
    })
})