const Usuario = require('../models/Usuario')
const BaseService = require("./base.service")
const { compareSenha } = require('../utils/criptografia')
const { gerarToken } = require('../utils/tokenJWT')

class AuthService extends BaseService {
    async login({ email, senha }) {
        // -------- validação básica --------
        if (!email || !senha) {
            throw new Error('E-mail e senha são obrigatórios!')
        }

        // -------- buscar usuário no banco --------
        const usuario = await this.buscarPorFiltro(Usuario, {"email": email}, "Usuário")

        // -------- comparar senha --------
        const senhaValida = await compareSenha(senha, usuario.senha)

        if (!senhaValida) {
            throw new Error('Senha inválida')
        }

        // -------- gerar token JWT --------
        const token = gerarToken({
            id: usuario.codUsuario,
            email: usuario.email,
            tipo: usuario.tipo_usuario
        })

        // -------- retorno ao controller --------
        return {
            token,
            usuario: {
                id: usuario.codUsuario,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo_usuario
            }
        }
    }
}


module.exports = new AuthService()