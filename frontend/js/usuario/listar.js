let usuariosList = document.getElementById("usuariosList")

// Load users on page load
document.addEventListener("DOMContentLoaded", () => {
    listarUsuarios()
    console.log("Página carregada e função lançada")
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
            if (data.error) {
                usuariosList.innerHTML = `<p style="color: red;">${data.error}</p>`
                return
            }

            if (data.length === 0) {
                usuariosList.innerHTML = "<p>Nenhum usuário encontrado.</p>"
                return
            }

            let html = `
            <h3>Lista de Usuários</h3>
            <table class="products-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>CPF</th>
                        <th>Tipo</th>
                        <th>Identidade</th>
                    </tr>
                </thead>
                <tbody>
        `
            data.forEach(usuario => {
                html += `
                <tr>
                    <td><strong>${usuario.nome}</strong></td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone || 'N/A'}</td>
                    <td>${usuario.cpf}</td>
                    <td><span class="status ${usuario.tipo_usuario === 'ADMIN' ? 'admin' : 'cliente'}">${usuario.tipo_usuario}</span></td>
                    <td>${usuario.identidade || 'N/A'}</td>
                </tr>
            `
            })
            html += `
                </tbody>
            </table>
        `
            usuariosList.innerHTML = html
        })
        .catch((err) => {
            usuariosList.innerHTML = `<p style="color: red;">Erro ao carregar usuários: ${err.message}</p>`
            console.error("Erro ao listar usuários: ", err)
        })
}
