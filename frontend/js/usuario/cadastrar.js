let res = document.getElementById("res")
let formCadastrar = document.getElementById("cadastrarForm")

formCadastrar.addEventListener("submit", (e) => {
    e.preventDefault()

    let nome = document.getElementById("nome").value
    let email = document.getElementById("email").value
    let senha = document.getElementById("senha").value
    let telefone = document.getElementById("telefone").value
    let cpf = document.getElementById("cpf").value
    let identidade = document.getElementById("identidade").value
    let tipo_usuario = document.getElementById("tipo_usuario").value

    // Validate required fields
    if (!nome || !email || !senha) {
        return alert("Por favor, preencha os campos obrigatórios: Nome, Email e Senha!")
    }

    let valores = {
        nome: nome,
        email: email,
        senha: senha,
        telefone: telefone,
        cpf: cpf,
        identidade: identidade,
        tipo_usuario: tipo_usuario
    }

    // Filter empty fields
    Object.keys(valores).forEach((key) => {
        if (valores[key] === "") {
            delete valores[key];
        }
    })

    fetch("http://localhost:3000/usuario/cadastrar", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(valores)
    })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Ocorreu um erro ao processar a requisição.")
            }
            return resp.json()
        })
        .then((data) => {
            console.log(data);
            if (data.erro) {
                res.style.color = "red"
                return res.innerHTML = `${data.erro}`
            }

            res.style.color = "green"
            res.innerHTML = `
            <h3>Usuário cadastrado com sucesso!</h3>
            <p><strong>Código:</strong> ${data.codUsuario}</p>
            <p><strong>Nome:</strong> ${data.nome}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Telefone:</strong> ${data.telefone || 'N/A'}</p>
            <p><strong>CPF:</strong> ${data.cpf || 'N/A'}</p>
            <p><strong>Identidade:</strong> ${data.identidade || 'N/A'}</p>
            <p><strong>Tipo de Usuário:</strong> ${data.tipo_usuario}</p>
        `
        })
        .catch((err) => {
            res.innerHTML = `Ocorreu um erro ao cadastrar o usuário, tente novamente mais tarde.`
            console.error("Ocorreu um erro ao cadastrar o usuário: ", err)
        })
})