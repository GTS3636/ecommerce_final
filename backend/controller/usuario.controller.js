const usuarioService = require("../services/usuario.service")

class UsuarioController {
    async cadastrar(req,res) {
        try {
            const novoUsuario = await usuarioService.criarUsuario(req.body)
            console.log(novoUsuario)
            if(!novoUsuario) {
                return res.status(500).json({error: "Ocorreu um erro ao cadastrar o usuário!"})
            }
            return res.status(201).json(novoUsuario)
        } catch (err) {
            console.error("Erro ao cadastrar o usuário: ", err)
            const statusCode = err.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao cadastrar o usuário: ", err
            })
        }
    }

    async atualizar (req, res) {
        try {
            const valores = req.body
            if(!valores.codUsuario){
                return res.status(400).json({error: "É necessário informar o código do usuário!"})
            }
            const usuarioAtual = await usuarioService.atualizarUsuario(valores)
            return res.status(200).json(usuarioAtual)
        } catch (err) {
            console.error("Erro ao atualizar o usuário: ", err)
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).json({
                error: "Erro ao atualizar o usuário: ", err
            })
        }
    }

    async deletar (req, res) {
        try {
            const codUsuario = req.params.id
            await usuarioService.deletarUsuario(codUsuario)
            return res.status(200).json({message: "Sucesso ao deletar o usuário!"})
        } catch (err) {
            console.error("Erro ao deletar o usuário: ", err)
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).json({
                error: "Erro ao deletar o usuário: ", err
            });
        }
    }

    async listarUsuarios(req,res) {
        try {
            const usuarios = await usuarioService.listarUsuariosTodos()
            return res.status(200).json(usuarios);
        } catch (err) {
            console.error("Erro ao listar os usuários: ", err)
            
            const statusCode = err.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao listar os usuários: ", err
            })
        }
    }

    // Funcionando
    async listarComFiltro(req, res) {
        try {
            const usuarios = await usuarioService.listarUsuariosFiltro(req.query)
            return res.status(200).json(usuarios);
        } catch (err) {
            console.error("Erro ao listar usuários com filtro:", err)
            const statusCode = err.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao listar os usuários dom filtro: ",err
            })
        }
    }
}

module.exports = new UsuarioController()