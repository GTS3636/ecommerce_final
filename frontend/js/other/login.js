let res = document.getElementById("res")
let loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    let email = document.getElementById("email").value
    let senha = document.getElementById("senha").value

    let valores = {
        email: email,
        senha: senha
    }

    fetch("http://localhost:3000/login", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(valores)
    })
    .then(resp=>{
        if(!resp.ok){
            throw new Error("Erro ao requisitar os dados.")
        }
        return resp.json()
    })
    .then((data)=>{
        console.log(data)
        
        if(data.error){
            res.style.color = "red"
            return res.innerHTML = `${data.error}`
        }
        localStorage.setItem("token", data.token)
        localStorage.setItem("nome", data.nome)
        localStorage.setItem("tipo", data.tipo)
        localStorage.setItem("idUsuario", data.idUsuario)

        res.style.color = "green"
        res.innerHTML = `<h3>Login efetuado com sucesso!</h3>`
        setTimeout(()=>{
            location.href = "../index.html"
        },2000)
    })
    .catch((err)=>{
        res.style.color = "red"
        res.innerHTML = "Ocorreu um erro ao efetuar o login, tente novamente mais tarde."
        console.error("Ocorreu um erro ao efetuar o login: ", err)        
    })
})