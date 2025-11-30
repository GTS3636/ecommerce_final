let usuariosList = document.getElementById("usuariosList")

// Load users on page load
document.addEventListener("DOMContentLoaded", () => {
    listarUsuarios()
    console.log("Página carregada e função lançada");
    
})

function listarUsuarios() {
    fetch("http://localhost:3000/usuario/listar", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error("Erro na requisição.")
        }
        return resp.json()
    })
    .then((data) => {
        if (data.erro) {
            usuariosList.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        if (data.length === 0) {
            usuariosList.innerHTML = "<p>Nenhum usuário encontrado.</p>"
            return
        }

        let html = "<h3>Lista de Usuários</h3><ul>"
        data.forEach(usuario => {
            html += `
                <li>
                    <strong>${usuario.nome}</strong> - ${usuario.email} - ${usuario.tipo_usuario}
                    <br>Telefone: ${usuario.telefone || 'N/A'}
                    <br>CPF: ${usuario.cpf}
                    <br>Identidade: ${usuario.identidade || 'N/A'}
                </li><hr>
            `
        })
        html += "</ul>"
        usuariosList.innerHTML = html
    })
    .catch((err) => {
        usuariosList.innerHTML = `<p style="color: red;">Erro ao carregar usuários: ${err.message}</p>`
        console.error("Erro ao listar usuários: ", err)
    })
}
