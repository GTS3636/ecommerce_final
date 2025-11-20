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

    async consultarPorId (req, res) {
        try {
            const nome = req.body.nome
            const produto = usuarioService.buscarUsuarioPorNome(nome)
            return res.status(200).json(produto)
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                error: error.message
            });
        }
    }

    async atualizar (req, res) {
        try {
            const valores = req.body
            const produtoCad = usuarioService.atualizarUsuario(valores)
            return res.status(200).json(produtoCad)
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
            const codProduto = req.body.codProduto
            await usuarioService.deletarUsuario(codProduto)
            return res.status(200).json({message: "Sucesso ao deletar o usuário!"})
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                error: "Erro ao deletar o produto."
            });
        }
    }

    async listarComFiltro(req, res) {
        try {
            const usuarios = await usuarioService.listarFiltrado(req.query)
            return res.status(200).json(usuarios);
        } catch (error) {
            const statusCode = error.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao listar os usuários."
            })
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
}

module.exports = new UsuarioController()