const res = document.getElementById("res");
const registrarForm = document.getElementById("registrarForm")

// Função auxiliar para mostrar mensagens
function mostrarMensagem(mensagem, tipo = "error") {
    res.style.color = tipo === "error" ? "red" : "green"
    res.innerHTML = mensagem
}

// Função auxiliar para requisições
async function fazerRequisicao(url, dados) {
    console.log('Enviando requisição para:', url)
    console.log('Dados:', dados)
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const responseData = await response.json()
    console.log('Resposta do servidor:', responseData)

    if (!response.ok) {
        const errorMsg = responseData.error || `Erro HTTP: ${response.status}`
        throw new Error(errorMsg)
    }

    return responseData
}

function validarFormulario(valores) {
    const { nome, email, senha, telefone, cpf } = valores
    
    if (!nome || !email || !senha || !telefone || !cpf) {
        return "Todos os campos são obrigatórios."
    }
    
    if (senha.length < 6) {
        return "A senha deve ter no mínimo 6 caracteres."
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return "Email inválido."
    }
    
    return null
}

registrarForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    
    const valores = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value,
        telefone: document.getElementById("telefone").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        identidade: document.getElementById("identidade").value.trim()
    }

    const erroValidacao = validarFormulario(valores)
    if (erroValidacao) {
        mostrarMensagem(erroValidacao)
        return
    }

    const submitBtn = registrarForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true
        mostrarMensagem("Processando...", "info")
    }

    try {
        // Cadastro
        const dataCadastro = await fazerRequisicao(
            "http://localhost:3000/usuario/cadastrar",
            valores
        )

        if (dataCadastro.error) {
            mostrarMensagem(dataCadastro.error)
            return
        }

        // Login automático
        const dataLogin = await fazerRequisicao(
            "http://localhost:3000/login",
            {
                email: valores.email,
                senha: valores.senha
            }
        )

        if (dataLogin.error) {
            mostrarMensagem(dataLogin.error)
            return
        }

        localStorage.setItem("token", dataLogin.token)
        localStorage.setItem("nome", dataLogin.nome)
        localStorage.setItem("tipo", dataLogin.tipo)

        mostrarMensagem("<h3>Cadastro e login efetuados com sucesso!</h3>", "sucesso")
        
        registrarForm.reset()
        
        setTimeout(() => {
            location.href = "../index.html"
        }, 2000)

    } catch (erro) {
        console.error("Erro completo:", erro)
        let mensagemErro = "Ocorreu um erro ao processar sua solicitação."
        
        if (erro.message.includes("400")) {
            mensagemErro = "Dados inválidos. Verifique se todos os campos estão preenchidos corretamente."
        } else if (erro.message.includes("403")) {
            mensagemErro = "CPF inválido ou já cadastrado."
        } else if (erro.message.includes("500")) {
            mensagemErro = "Erro interno do servidor. Tente novamente mais tarde."
        } else if (erro.message) {
            mensagemErro = erro.message
        }
        
        mostrarMensagem(mensagemErro)
    } finally {
        // Reabilitar botão
        if (submitBtn) {
            submitBtn.disabled = false
        }
    }
})