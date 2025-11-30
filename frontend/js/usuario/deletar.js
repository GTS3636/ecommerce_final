let deleteResult = document.getElementById("deleteResult")
let formDeletar = document.getElementById("deletarForm")

formDeletar.addEventListener("submit", (e) => {
    e.preventDefault()

    let codUsuario = document.getElementById("codUsuario").value

    if (!codUsuario) {
        deleteResult.innerHTML = `<p style="color: red;">Por favor, insira o código do usuário.</p>`
        return
    }

    if (!confirm("Tem certeza que deseja deletar este usuário?")) {
        return
    }

    fetch(`http://localhost:3000/usuario/deletar/${codUsuario}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error("Erro ao deletar usuário.")
        }
        return resp.json()
    })
    .then((data) => {
        if (data.erro) {
            deleteResult.innerHTML = `<p style="color: red;">${data.erro}</p>`
            return
        }

        deleteResult.innerHTML = `<p style="color: green;">${data.message || "Usuário deletado com sucesso!"}</p>`
    })
    .catch((err) => {
        deleteResult.innerHTML = `<p style="color: red;">Erro ao deletar usuário: ${err.message}</p>`
        console.error("Erro ao deletar usuário: ", err)
    })
})
