const usuarioService = require("../services/usuario.service")

class UsuarioController {
    async cadastrar(req,res) {
        try {
            const novoUsuario = await usuarioService.criarUsuario(req.body)
            return res.status(201).json(novoUsuario)
        } catch (error) {
            const statusCode = error.statusCode || 500
            return res.status(statusCode).json({
                error: error.message,
                ...(error.camposFaltando && { camposFaltando: error.camposFaltando }),
                ...(error.detalhes && { detalhes: error.detalhes })
            })
        }
    }

    async atualizar (req, res) {
        try {
            const valores = req.body
            const usuarioAtual = await usuarioService.atualizarUsuario(valores)
            return res.status(200).json(usuarioAtual)
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                error: error.message,
                ...(error.camposFaltando && { camposFaltando: error.camposFaltando }),
                ...(error.detalhes && { detalhes: error.detalhes })
            });
        }
    }

    async deletar (req, res) {
        try {
            const codUsuario = req.params.id
            await usuarioService.deletarUsuario(codUsuario)
            return res.status(200).json({message: "Sucesso ao deletar o usuário!"})
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                error: "Erro ao deletar o usuário."
            });
        }
    }

    async listarUsuarios(req,res) {
        try {
            const usuarios = await usuarioService.listarUsuariosTodos()
            return res.status(200).json(usuarios);
        } catch (error) {
            const statusCode = error.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao listar os usuários."
            })
        }
    }

    // Funcionando
    async listarComFiltro(req, res) {
        try {
            const usuarios = await usuarioService.listarUsuariosFiltro(req.query)
            return res.status(200).json(usuarios);
        } catch (error) {
            console.error("Erro ao listar usuários:", error)
            const statusCode = error.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao listar os usuários.",
                detalhes: error.message
            })
        }
    }
}

module.exports = new UsuarioController()