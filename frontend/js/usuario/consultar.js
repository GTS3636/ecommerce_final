let usuarioDetails = document.getElementById("usuarioDetails")
let formConsultar = document.getElementById("consultarForm")

formConsultar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codUsuario = document.getElementById("codUsuario").value

    if (!codUsuario) {
        usuarioDetails.innerHTML = `<p style="color: red;">Por favor, insira o código do usuário.</p>`
        return
    }

    fetch(`http://localhost:3000/usuario/consultar/${codUsuario}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error("Usuário não encontrado.")
        }
        return resp.json()
    })
    .then((data) => {
        if (data.erro) {
            usuarioDetails.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        usuarioDetails.innerHTML = `
            <h3>Detalhes do Usuário</h3>
            <p><strong>Código:</strong> ${data.codUsuario}</p>
            <p><strong>Nome:</strong> ${data.nome}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Telefone:</strong> ${data.telefone || 'N/A'}</p>
            <p><strong>CPF:</strong> ${data.cpf}</p>
            <p><strong>Identidade:</strong> ${data.identidade || 'N/A'}</p>
            <p><strong>Tipo de Usuário:</strong> ${data.tipo_usuario}</p>
        `
    })
    .catch((err) => {
        usuarioDetails.innerHTML = `<p style="color: red;">Erro ao consultar usuário: ${err.message}</p>`
        console.error("Erro ao consultar usuário: ", err)
    })
})
