const token = localStorage.getItem("token")
const tipoUsuario = localStorage.getItem("tipo")

const isSubFolder = location.pathname.includes("/html/")
const loginPath = isSubFolder ? "../../login.html" : "./login.html"
const indexPath = isSubFolder ? "../../index.html" : "./index.html"

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
if(token && !isOnAuthPage){
    setupUserInfo()
    setupLogout()
}
if ((token && !isOnAuthPage)&&(tipoUsuario === "ADMIN")){
    setupMenu()
    menu()
}

function setupLogout() {
    const header_right = document.getElementById("header-right")
    
    const logoutBtn = document.createElement("button")
    logoutBtn.className = "header-btn"
    logoutBtn.textContent = "Logout"
    logoutBtn.id = "logout"

    const loginUser = document.getElementById("loginUser")
    const registerUser = document.getElementById("registerUser")

    header_right.removeChild(loginUser)
    header_right.removeChild(registerUser)

    const iLogoutBtn = document.createElement("i")
    iLogoutBtn.className = "fas fa-arrow-right-from-bracket"

    header_right.appendChild(logoutBtn)
    logoutBtn.appendChild(iLogoutBtn)

    const logout = document.getElementById("logout")
    if (logout){
        logout.addEventListener("click", (e)=>{
            e.preventDefault()
            let confirmLogout = confirm("Você tem certeza que deseja fazer logout?")
            if (confirmLogout){
                localStorage.clear()
                location.href = indexPath
            }
        })
    }
}

function setupUserInfo() {
    const nomeUser = localStorage.getItem("nome")
    const user_text = document.getElementById("user-text")
    if (nomeUser && user_text){
        // Extrair apenas o primeiro nome para evitar texto muito longo
        const primeiroNome = nomeUser.split(' ')[0]
        user_text.textContent = ``
        user_text.textContent = `Olá, ${primeiroNome}!`
    }
    if((tipoUsuario && user_text)&&(tipoUsuario === "ADMIN")){
        user_text.textContent += ` (${tipoUsuario})`
    }
}

function menu() {
    // Elementos do DOM
    const menuBtn = document.getElementById('menuBtn')
    const closeBtn = document.getElementById('closeBtn')
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')

    // Função para abrir o menu
    function openSidebar() {
        sidebar.classList.add('active')
        overlay.classList.add('active')
        document.body.style.overflow = 'hidden' // Previne scroll na página
    }

    // Função para fechar o menu
    function closeSidebar() {
        sidebar.classList.remove('active')
        overlay.classList.remove('active')
        document.body.style.overflow = '' // Restaura o scroll
    }

    // Event Listeners
    menuBtn.addEventListener('click', openSidebar)
    closeBtn.addEventListener('click', closeSidebar)
    overlay.addEventListener('click', closeSidebar)

    // Fechar menu com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar()
        }
    })
}

function setupMenu() {
    const header_left = document.getElementById("header-left-menu")
    const menuBtn = document.createElement("button")

    menuBtn.className = "menu-btn"
    menuBtn.id = "menuBtn"

    const iBtnMenu = document.createElement("i")
    iBtnMenu.className = "fas fa-bars"

    menuBtn.appendChild(iBtnMenu)
    header_left.appendChild(menuBtn)
}