const token = localStorage.getItem("token")
const tipoUsuario = localStorage.getItem("tipoUsuario")

const isSubFolder = location.pathname.includes("/html/")
const loginPath = isSubFolder ? "../login.html" : "./login.html"
const indexPath = isSubFolder ? "../index.html" : "./index.html"

const isOnLoginPage = location.pathname.endsWith("/login.html")
const isOnRegisterPage = location.pathname.endsWith("/register.html")
const isOnIndexPage = location.pathname.endsWith("/index.html")
const isOnCarrinhoPage = location.pathname.endsWith("/carrinho.html")
const isOnSearchPage = location.pathname.endsWith("/search.html")

const isOnAuthPage = isOnLoginPage || isOnRegisterPage
const isOnPublicPage  = isOnCarrinhoPage || isOnIndexPage || isOnSearchPage || isOnAuthPage

if(!token && !isOnPublicPage ){
    location.href = loginPath
}

if(token && isOnAuthPage){
    location.href = indexPath
}

if (isOnIndexPage && tipoUsuario === "ADMIN") {
    const nav = document.querySelector("nav")
    
    if (nav) {
        const adminLinks = [
            { href: "./html/produto/produtoIndex.html", text: "Produtos" },
            { href: "./html/usuario/usuarioIndex.html", text: "Usuários" },
            { href: "./html/entrega/entregaIndex.html", text: "Entregas" },
            { href: "./html/estoque/estoqueIndex.html", text: "Estoque" },
            { href: "./html/pedido/pedidoIndex.html", text: "Pedidos" }
        ]

        adminLinks.forEach(link => {
            const anchor = document.createElement("a")
            anchor.href = link.href
            anchor.textContent = link.text
            nav.appendChild(anchor)
        })
    }
}
if (token && !isOnAuthPage){
    setupNome()
    setupLogout()
}

function setupLogout() {
    const logout = document.getElementById("logout")
    if (logout){
        logout.addEventListener("click", (e)=>{
            e.preventDefault()
            let confirmLogout = confirm("Você tem certeza que deseja fazer logout?")
            if (confirmLogout){
                localStorage.clear()
                location.href = loginPath
            }
        })
    }
}

function setupNome() {
    const nomeP = document.getElementById("nomeP")
    const nomeUser = localStorage.getItem("nomeUser")

    if(nomeP && nomeUser){
        nomeP.textContent = nomeUser
    }
}