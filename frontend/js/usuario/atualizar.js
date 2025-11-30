let res = document.getElementById("res")
let formAtualizar = document.getElementById("atualizarForm")

formAtualizar.addEventListener("submit", (e)=>{
    e.preventDefault()

    let codUsuario = document.getElementById("codUsuario").value
    let nome = document.getElementById("nome").value
    let email = document.getElementById("email").value
    let senha = document.getElementById("senha").value
    let telefone = document.getElementById("telefone").value
    let cpf = document.getElementById("cpf").value
    let identidade = document.getElementById("identidade").value
    let tipo_usuario = document.getElementById("tipo_usuario").value

    if(!codUsuario){
        return alert("Por favor, insira o código do usuário para sabermos quem irá sofrer as alterações!")
    }

    if(!nome && !email && !senha && !telefone && !cpf && !identidade && !tipo_usuario){
        return alert("Por favor, ao menos um campo deve ser alterado para ocorrer a atualização!")
    }

    let valores = {
        codUsuario: codUsuario,
        nome: nome,
        email: email,
        senha: senha,
        telefone: telefone,
        cpf: cpf,
        identidade: identidade,
        tipo_usuario: tipo_usuario
    }

    fetch("http://localhost:3000/usuario/atualizar", {
        method: "PUT",
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
        console.log(data);
        if(data.erro){
            res.style.color = "red"
            return res.innerHTML = `${data.erro}`
        }

        res.style.color = "green"
        res.innerHTML = `
            <h3>Usuário atualizado com sucesso!</h3>
            <p><strong>Código:</strong> ${data.codUsuario}</p>
            <p><strong>Nome:</strong> ${data.nome}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Telefone:</strong> ${data.telefone || 'N/A'}</p>
            <p><strong>CPF:</strong> ${data.cpf}</p>
            <p><strong>Identidade:</strong> ${data.identidade || 'N/A'}</p>
            <p><strong>Tipo de Usuário:</strong> ${data.tipo_usuario}</p>
        `
    })
    .catch((err)=>{
        res.innerHTML = `Ocorreu um erro ao atualizar o usuário, tente novamente mais tarde.`
        console.error("Ocorreu um erro ao atualizar o usuário: ", err)
    })
})
