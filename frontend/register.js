let res = document.getElementById("res")
let resgistrarForm = document.getElementById("resgistrarForm")

resgistrarForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    let nome = document.getElementById("nome").value
    let email = document.getElementById("email").value
    let senha = document.getElementById("senha").value
    let telefone = document.getElementById("telefone").value
    let cpf = document.getElementById("senha").value
    let identidade = document.getElementById("identidade").value

    let valores = {
        nome:nome,
        email: email,
        senha: senha,
        telefone: telefone,
        cpf: cpf,
        identidade: identidade
    }

    const responseCad = await fetch("http://localhost:4000/usuario/cadastrar", {
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
    })
    .catch((err)=>{
        res.style.color = "red"
        console.error("Ocorreu um erro ao efetuar o cadastro do usuário: ", err)        
        return res.innerHTML = "Ocorreu um erro ao efetuar o cadastro do usuário, tente novamente mais tarde."
    })

    if(!responseCad){
        return
    }

    fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    })
    .then(resp=>{
        if(!resp.ok){
            throw new Error("Ocorreu um erro ao fazer a requisição.")
        }
        return resp.json()
    })
    .then((data)=>{

        if(data.error){
            res.style.color = "red"
            return res.innerHTML = `${data.error}`
        }

        localStorage.setItem("token", data.token)
        localStorage.setItem("nome", data.nome)
        localStorage.setItem("tipo", data.tipo)

        res.style.color = "green"
        res.innerHTML = `<h3>Login efetuado com sucesso!</h3>`
        setTimeout(()=>{
            location.href = "./index.html"
        },2000)
    })
    .catch((err)=>{
        res.style.color = "red"
        res.innerHTML = "Ocorreu um erro ao efetuar o login, tente novamente mais tarde."
        console.error("Ocorreu um erro ao efetuar o login: ", err)        
    })
})